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

assert.equal(FEATURED_PRODUCT.name, 'Zaiko', 'This milestone must not change the current display name');
assert.equal(FEATURED_PRODUCT.id, 'zaiko');
assert.equal(FEATURED_PRODUCT.slug, 'zaiko');
assert.equal(FEATURED_PRODUCT.analyticsProduct, 'zaiko');
assert.equal(FEATURED_PRODUCT.routeKey, 'productsZaiko');

for (const [locale, messages] of Object.entries({ en, es })) {
  const hardcodedValues = collectStringValues(messages).filter(({ value }) => /zaiko/i.test(value));
  assert.deepEqual(hardcodedValues, [], `${locale.toUpperCase()} public translation values must not hardcode Zaiko`);
}

const alternateName = 'Rename Test Product';
const representativeKeys = [
  'home.zaiko.discoverCta',
  'zaikoPage.hero.body',
  'demoPage.zaiko.heading',
  'aboutPage.exploreZaikoCta',
  'insightsArticles.restaurantInventory.content.zaikoTitle',
  'zaikoPage.seo.title'
] as const;

for (const [locale, messages] of Object.entries({ en, es })) {
  const t = createTranslator({ locale, messages });
  for (const key of representativeKeys) {
    const rendered = t(key, { productName: alternateName });
    assert.ok(rendered.includes(alternateName), `${locale.toUpperCase()} ${key} should render an alternate display name`);
    assert.ok(!/zaiko/i.test(rendered), `${locale.toUpperCase()} ${key} should not retain the current display name`);
  }
}

const callSites: Array<[string, RegExp]> = [
  ['src/app/[locale]/page.tsx', /tHome\('zaiko\.discoverCta',\s*\{\s*productName:/],
  ['src/app/[locale]/products/zaiko/page.tsx', /tHero\('body',\s*productProgramValues\)/],
  ['src/app/[locale]/demo/page.tsx', /t\('zaiko\.heading',\s*productProgramValues\)/],
  ['src/app/[locale]/about/page.tsx', /t\('exploreZaikoCta',\s*\{\s*productName:/],
  ['src/app/[locale]/insights/restaurant-inventory-information/page.tsx', /t\('content\.zaikoTitle',\s*productValues\)/]
];

for (const [file, pattern] of callSites) {
  assert.match(read(file), pattern, `${file} should pass the product display-name interpolation value`);
}

assert.match(
  read('src/app/[locale]/products/zaiko/page.tsx'),
  /title: t\('title', \{ productName: FEATURED_PRODUCT\.name \}\)/,
  'Product metadata should resolve its title from the registry display name'
);
assert.match(
  read('src/app/[locale]/insights/restaurant-inventory-information/page.tsx'),
  /title: t\('seoTitle', \{ productName: FEATURED_PRODUCT\.name \}\)/,
  'Insight metadata should resolve its title from the registry display name'
);

console.log('Product display-name regression checks passed.');
