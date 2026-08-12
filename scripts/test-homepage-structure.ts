import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function read(file: string) {
  return readFileSync(resolve(process.cwd(), file), 'utf8');
}

const home = read('src/app/[locale]/page.tsx');
const header = read('src/components/layout/Header.tsx');
const footer = read('src/components/layout/Footer.tsx');
const hero = read('src/components/home/HeroSection.tsx');
const feature = read('src/components/home/ZaikoFeature.tsx');
const en = JSON.parse(read('src/i18n/messages/en.json'));
const es = JSON.parse(read('src/i18n/messages/es.json'));
const expectedOrder = [
  '<HeroSection',
  '<ZaikoFeature',
  '<InsightsPreview',
  '<PhilosophySection',
  '<CompanyContext',
  '<ServicesSection',
  '<FinalCta'
];

let previousIndex = -1;
for (const component of expectedOrder) {
  const index = home.indexOf(component);
  assert.ok(index > previousIndex, `${component} should appear in the intended Homepage sequence`);
  previousIndex = index;
}

assert.ok(!home.includes('ProductsIntro'), 'ProductsIntro should not be rendered or imported by Home');

assert.ok(
  header.indexOf('href={internalRoutes.productsZaiko}') < header.indexOf('href={internalRoutes.services}'),
  'The featured product should remain ahead of Services in navigation'
);
assert.ok(header.includes("buildProductDemoHref(locale, FEATURED_PRODUCT, { source: 'header' })"), 'Header Demo should retain product and source context');
assert.ok(home.indexOf('<ZaikoFeature') < home.indexOf('<ServicesSection'), 'The featured product should precede Services');
assert.ok(home.includes("routeKey: 'insightRestaurantFoodCost'") && home.includes("routeKey: 'insightRestaurantInventoryCounts'"), 'Homepage Insights preview should be product-first');
assert.ok(hero.includes('<ZaikoProductVisual type="hero"'), 'Homepage Hero should show the overview product preview');
assert.ok(!hero.includes('location'), 'Homepage Hero should not foreground geography');
assert.ok(!read('src/components/home/FinalCta.tsx').includes('locationLine'), 'Final CTA should focus on the two conversion paths');
assert.ok(!read('src/components/home/CompanyContext.tsx').includes('regions.map'), 'Company context should not present geography as a regional framework');
assert.ok(feature.includes('<ZaikoProductVisual type="inventory"'), 'Featured product should show concrete inventory proof');
assert.match(home, /cta: tCommon\('requestAccess'\)/, 'Homepage should pass the localized public access label to the featured product');
assert.match(feature, /interest: 'early-access', source: 'home_product'/, 'Homepage access should use the fixed access intent and controlled source');
assert.match(feature, /eventName="zaiko_early_access_cta"/, 'Homepage access should preserve the access CTA analytics event');
assert.ok(
  feature.indexOf('earlyAccess.cta') < feature.indexOf('{/* CTAs */}'),
  'Request Access should remain inside the program callout rather than the main CTA row'
);
assert.ok(home.includes('buildZaikoVisualLabels(tVisuals)'), 'Homepage should use the shared visual-label builder');
assert.match(home, /getHomepageMarketingState\(\)/, 'Homepage availability copy should use its own derived product state');
assert.match(home, /filterMarketableEntries\(HOMEPAGE_PRODUCT_OUTCOMES\)/, 'Homepage should hide non-marketable outcomes');
for (const messages of [en, es]) {
  assert.doesNotMatch(messages.home.hero.eyebrow, /PRODUCT-FIRST SOFTWARE COMPANY|EMPRESA DE SOFTWARE CENTRADA EN PRODUCTOS/i, 'Hero should not lead with internal company positioning');
  assert.match(messages.home.hero.eyebrow, /RESTAURANT INVENTORY|INVENTARIO/i, 'Hero should identify the featured restaurant inventory context');
  assert.match(messages.home.hero.heading, /came|changed|costs|attention|llegó|cambió|cuesta|atención/i, 'Hero should lead with operational questions or outcomes');
  assert.match(messages.home.hero.body, /Venkoi/, 'Homepage should present Venkoi as the company');
  for (const key of ['theme1Title', 'theme2Title', 'theme3Title', 'theme4Title', 'theme5Title']) {
    assert.ok(messages.home.zaiko[key], `Homepage product outcome ${key} should exist`);
  }
  for (const state of ['available', 'early-access', 'launch-release', 'not-marketed']) {
    assert.equal(typeof messages.home.zaiko.availability[state], 'string');
  }
  assert.ok(messages.contactPage.productDemo.eyebrow, 'Contact should distinguish product intent');
}
assert.match(en.home.zaiko.theme1Desc, /review/i, 'Homepage should explain invoice review before posting');
assert.match(en.home.zaiko.theme2Desc, /receiving|waste|production/i, 'Homepage should explain why inventory changed');
assert.match(en.home.zaiko.theme3Desc, /Partial|Missing/i, 'Homepage should expose incomplete cost coverage');
assert.match(en.home.zaiko.theme4Desc, /par[\s\S]*packages[\s\S]*supplier/i, 'Homepage should explain reorder preparation logic');
assert.match(en.home.zaiko.theme5Desc, /price changes[\s\S]*variance[\s\S]*cost gaps/i, 'Homepage Owner View should identify signals requiring attention');
assert.doesNotMatch(JSON.stringify(en.home) + JSON.stringify(es.home), /PRODUCT-FIRST SOFTWARE COMPANY|EMPRESA DE SOFTWARE CENTRADA EN PRODUCTOS/i);
assert.doesNotMatch(header + '\n' + footer, /linkedin|instagram|twitter\.com|facebook/i, 'Layout must not add unsupported social links');

for (const file of [
  'src/components/home/HeroSection.tsx',
  'src/components/home/ZaikoFeature.tsx',
  'src/components/home/FinalCta.tsx'
]) {
  assert.ok(
    read(file).includes('buildProductDemoHref'),
    `${file} should keep product Demo URLs behind buildProductDemoHref`
  );
}

for (const file of [
  'src/components/home/CompanyContext.tsx',
  'src/components/home/InsightsPreview.tsx',
  'src/components/home/ServicesSection.tsx'
]) {
  assert.ok(!/^\s*(['"])use client\1;/m.test(read(file)), `${file} should remain a Server Component`);
}

console.log('Homepage structure regression checks passed.');
