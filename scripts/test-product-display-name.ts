import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createTranslator } from 'next-intl';
import en from '../src/i18n/messages/en.json';
import es from '../src/i18n/messages/es.json';
import { FEATURED_PRODUCT } from '../src/lib/products';

function read(file: string) {
  return readFileSync(resolve(process.cwd(), file), 'utf8');
}

function collectStringValues(value: unknown, path: string[] = []): Array<{ path: string; value: string }> {
  if (typeof value === 'string') return [{ path: path.join('.'), value }];
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, child]) => collectStringValues(child, [...path, key]));
}

const retiredIdentity = ['za', 'iko'].join('');

assert.equal(FEATURED_PRODUCT.name, 'Venkoi Serve', 'The featured product display name must remain canonical');
assert.equal(FEATURED_PRODUCT.id, 'serve');
assert.equal(FEATURED_PRODUCT.slug, 'serve');
assert.equal(FEATURED_PRODUCT.analyticsProduct, 'serve');
assert.equal(FEATURED_PRODUCT.routeKey, 'productsServe');

for (const [locale, messages] of Object.entries({ en, es })) {
  const hardcodedValues = collectStringValues(messages).filter(({ value }) => new RegExp(`\\b${retiredIdentity}\\b`, 'i').test(value));
  assert.deepEqual(hardcodedValues, [], `${locale.toUpperCase()} public translation values must not hardcode the technical product slug`);
}

const alternateName = 'Rename Test Product';
const representativeKeys = [
  'home.serve.discoverCta',
  'servePage.hero.body',
  'demoPage.serve.heading',
  'aboutPage.exploreServeCta',
  'insightsArticles.restaurantInventory.content.serveTitle',
  'servePage.seo.title'
] as const;

for (const [locale, messages] of Object.entries({ en, es })) {
  const t = createTranslator({ locale, messages });
  for (const key of representativeKeys) {
    const rendered = t(key, { productName: alternateName });
    assert.ok(rendered.includes(alternateName), `${locale.toUpperCase()} ${key} should render an alternate display name`);
    assert.ok(!new RegExp(`\\b${retiredIdentity}\\b`, 'i').test(rendered), `${locale.toUpperCase()} ${key} should not expose the technical product slug`);
  }
}

const callSites: Array<[string, RegExp]> = [
  ['src/app/[locale]/page.tsx', /tHome\('serve\.discoverCta',\s*\{\s*productName:/],
  ['src/app/[locale]/products/serve/page.tsx', /t\('hero\.body',\s*values\)/],
  ['src/app/[locale]/demo/page.tsx', /t\('serve\.heading',\s*productProgramValues\)/],
  ['src/app/[locale]/about/page.tsx', /t\('exploreServeCta',\s*\{\s*productName:/],
  ['src/app/[locale]/insights/restaurant-inventory-information/page.tsx', /t\('content\.serveTitle',\s*productValues\)/]
];

for (const [file, pattern] of callSites) {
  assert.match(read(file), pattern, `${file} should pass the product display-name interpolation value`);
}

assert.match(
  read('src/app/[locale]/products/serve/page.tsx'),
  /title: t\('title', \{ productName: FEATURED_PRODUCT\.name \}\)/,
  'Product metadata should resolve its title from the registry display name'
);
assert.match(
  read('src/app/[locale]/insights/restaurant-inventory-information/page.tsx'),
  /title: t\('seoTitle', \{ productName: FEATURED_PRODUCT\.name \}\)/,
  'Insight metadata should resolve its title from the registry display name'
);

const leadEmailSource = [
  read('src/server/email/lead-emails.tsx'),
  read('src/server/email/templates/UserAcknowledgementEmail.tsx'),
  read('src/server/email/templates/InternalLeadNotificationEmail.tsx')
].join('\n');
assert.doesNotMatch(
  leadEmailSource,
  new RegExp(FEATURED_PRODUCT.name, 'i'),
  'Lead email templates must not hardcode the current product display name'
);
assert.match(
  leadEmailSource,
  /getProductBySlug/,
  'Lead email templates should resolve display identity through the product registry'
);

console.log('Product display-name regression checks passed.');
