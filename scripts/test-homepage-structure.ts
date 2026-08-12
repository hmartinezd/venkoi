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
  '<PhilosophySection',
  '<InsightsPreview',
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
assert.ok(header.includes('buildProductDemoHref(locale, FEATURED_PRODUCT)'), 'Header Demo should retain product context');
assert.ok(home.indexOf('<ZaikoFeature') < home.indexOf('<ServicesSection'), 'The featured product should precede Services');
assert.ok(hero.includes('<ZaikoProductVisual type="hero"'), 'Homepage Hero should show the overview product preview');
assert.ok(feature.includes('<ZaikoProductVisual type="inventory"'), 'Featured product should show concrete inventory proof');
for (const messages of [en, es]) {
  assert.match(messages.home.hero.eyebrow, /PRODUCT|PRODUCTOS/, 'Hero should identify Venkoi as a product company');
  assert.ok(messages.contactPage.productDemo.eyebrow, 'Contact should distinguish product intent');
}
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
