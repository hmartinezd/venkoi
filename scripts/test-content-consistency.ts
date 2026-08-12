import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import en from '../src/i18n/messages/en.json';
import es from '../src/i18n/messages/es.json';

function read(file: string): string {
  return readFileSync(resolve(process.cwd(), file), 'utf8');
}

function compareShape(left: unknown, right: unknown, path = 'messages'): void {
  if (Array.isArray(left) || Array.isArray(right)) {
    assert.ok(Array.isArray(left) && Array.isArray(right), `${path} must be an array in both locales`);
    assert.equal(left.length, right.length, `${path} must have the same array shape in both locales`);
    left.forEach((value, index) => compareShape(value, right[index], `${path}.${index}`));
    return;
  }

  const leftIsObject = left !== null && typeof left === 'object';
  const rightIsObject = right !== null && typeof right === 'object';
  if (leftIsObject || rightIsObject) {
    assert.ok(leftIsObject && rightIsObject, `${path} must be an object in both locales`);
    const leftRecord = left as Record<string, unknown>;
    const rightRecord = right as Record<string, unknown>;
    assert.deepEqual(Object.keys(leftRecord).sort(), Object.keys(rightRecord).sort(), `${path} keys must match`);
    for (const key of Object.keys(leftRecord)) compareShape(leftRecord[key], rightRecord[key], `${path}.${key}`);
    return;
  }

  assert.equal(typeof left, typeof right, `${path} value types must match`);
}

compareShape(en, es);

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

const provisionalPublicCopy = /want to see what we're building\?|still being built|work in progress|coming soon|we're starting close to home|Venkoi is starting|Estamos comenzando cerca de casa|Venkoi está comenzando|\bbeta\b|\bprototype\b|\bMVP\b/i;
for (const [locale, messages] of [['en', en], ['es', es]] as const) {
  const violations = strings(messages).filter((value) => provisionalPublicCopy.test(value));
  assert.deepEqual(violations, [], `${locale} public copy must not imply an available product is provisional`);
}

const navigation = read('src/i18n/navigation.ts');
assert.doesNotMatch(navigation, /headerNavigation|footerNavigation|NavigationItem|NavigationChild/);

const header = read('src/components/layout/Header.tsx');
assert.match(header, /href=\{internalRoutes\.productsZaiko\}/);
assert.match(header, /href=\{buildProductDemoHref\(locale, FEATURED_PRODUCT, \{ source: 'header' \}\)\}/);
assert.match(header, /\{tCommon\('demo'\)\}/);

const homeFinal = read('src/components/home/FinalCta.tsx');
assert.match(homeFinal, /href=\{buildProductDemoHref\(locale, FEATURED_PRODUCT, \{ source: 'home_final_cta' \}\)\}/);
assert.match(homeFinal, /href=\{getLocalizedPath\('contact', locale\)\}/);
assert.doesNotMatch(homeFinal, /type=services|interest=/);

const homePage = read('src/app/[locale]/page.tsx');
assert.match(homePage, /secondaryCta=\{tCommon\('demo'\)\}/);
assert.match(homePage, /location=\{tCommon\('locationLine'\)\}/);
assert.match(homePage, /talkCta=\{tCommon\('startConversation'\)\}/);

const about = read('src/app/[locale]/about/page.tsx');
assert.match(about, /href=\{buildProductDemoHref\(currentLocale, FEATURED_PRODUCT\)\}/);
assert.match(about, /eventName="zaiko_demo_cta"/);
assert.match(about, /source: 'about_footer'/);
assert.match(about, /href=\{getLocalizedPath\('contact', currentLocale\)\}/);
assert.doesNotMatch(about, /type=services|interest=/);

const homeServices = read('src/components/home/ServicesSection.tsx');
assert.match(homeServices, /\?type=services/);
assert.match(homeServices, /eventName="services_cta"/);
assert.match(homeServices, /source: 'home'/);

for (const [file, interest] of [
  ['src/app/[locale]/services/mobile-applications/page.tsx', 'mobile'],
  ['src/app/[locale]/services/websites-web-applications/page.tsx', 'web']
] as const) {
  const source = read(file);
  assert.match(source, new RegExp(`interest="${interest}"`));
}

const restaurantInsight = read('src/app/[locale]/insights/restaurant-inventory-information/page.tsx');
assert.match(restaurantInsight, /buildProductDemoHref\(currentLocale, FEATURED_PRODUCT\)/);
assert.match(restaurantInsight, /eventName="zaiko_demo_cta"/);
assert.match(restaurantInsight, /source: 'insight_restaurant_inventory'/);

const projectInsight = read('src/app/[locale]/insights/start-a-software-project/page.tsx');
assert.match(projectInsight, /\?type=services&interest=unsure/);
assert.match(projectInsight, /eventName="services_cta"/);

const webInsight = read('src/app/[locale]/insights/website-or-web-application/page.tsx');
assert.match(webInsight, /\?type=services&interest=web/);
assert.match(webInsight, /getLocalizedPath\('servicesWeb', currentLocale\)/);

for (const messages of [en, es]) {
  const common = messages.common as Record<string, unknown>;
  const navigationMessages = messages.navigation as Record<string, unknown>;
  const headerMessages = messages.header as Record<string, unknown>;
  const services = messages.servicesPage as Record<string, unknown>;
  const aboutFooter = messages.aboutPage.footerCta as Record<string, unknown>;
  const homeHero = messages.home.hero as Record<string, unknown>;
  const homeProduct = messages.home.zaiko as Record<string, unknown>;
  const homeFinalCta = messages.home.finalCta as Record<string, unknown>;
  const contact = messages.contactPage as Record<string, unknown>;
  const mobileService = messages.mobileServicePage as Record<string, unknown>;
  const webService = messages.webServicePage as Record<string, unknown>;

  for (const key of ['location', 'locationShort', 'contactUs', 'learnMore']) assert.ok(!(key in common));
  for (const key of ['products', 'demo']) assert.ok(!(key in navigationMessages));
  assert.ok(!('logoTitle' in headerMessages));
  for (const key of ['mobileTheme1', 'mobileTheme1Desc', 'mobileTheme2', 'mobileTheme2Desc', 'mobileTheme3', 'mobileTheme3Desc']) {
    assert.ok(!(key in services));
  }
  assert.ok(!('primary' in aboutFooter));
  assert.ok(!('secondary' in aboutFooter));
  for (const key of ['secondaryCta', 'location']) assert.ok(!(key in homeHero));
  assert.ok(!('demoCta' in homeProduct));
  for (const key of ['demoCta', 'talkCta']) assert.ok(!(key in homeFinalCta));
  assert.ok(!('demoCta' in contact));
  assert.ok(!('secondaryCta' in mobileService));
  assert.ok(!('secondaryCta' in webService));
}

console.log('Content consistency regression checks passed.');
