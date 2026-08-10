import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createTranslator } from 'next-intl';
import en from '../src/i18n/messages/en.json';
import es from '../src/i18n/messages/es.json';
import { FEATURED_PRODUCT, isEarlyAccessInterest, type Product } from '../src/lib/products';

function read(file: string) {
  return readFileSync(resolve(process.cwd(), file), 'utf8');
}

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(strings);
}

assert.equal(FEATURED_PRODUCT.status, 'available');
assert.equal(FEATURED_PRODUCT.earlyAccess.enabled, true);
assert.equal(FEATURED_PRODUCT.earlyAccess.freeMonths, 3);
assert.equal(FEATURED_PRODUCT.demoEnabled, true);
assert.equal(FEATURED_PRODUCT.pricingEnabled, false);

const keys = [
  'home.zaiko.badgeText',
  'zaikoPage.hero.microcopy',
  'zaikoPage.earlyAccess.heading',
  'zaikoPage.earlyAccess.body',
  'demoPage.earlyAccess.badge',
  'demoPage.form.earlyAccess'
] as const;

for (const [locale, messages, expected, stale] of [
  ['en', en, '6 months', '3 months'],
  ['es', es, '6 meses', '3 meses']
] as const) {
  const t = createTranslator({ locale, messages });
  for (const key of keys) {
    const rendered = t(key, { productName: 'Program Test Product', freeMonths: 6 });
    assert.ok(rendered.includes(expected), `${locale.toUpperCase()} ${key} should use the alternate duration`);
    assert.ok(!rendered.includes(stale), `${locale.toUpperCase()} ${key} should not retain the current duration`);
  }
}

for (const [locale, messages] of Object.entries({ en, es })) {
  const hardcoded = strings(messages).filter(value => /\b(?:3|three) months\b|\b(?:3|tres) meses\b/i.test(value));
  assert.deepEqual(hardcoded, [], `${locale.toUpperCase()} translations must not hardcode the Early Access duration`);
}

const disabledProduct: Product = {
  ...FEATURED_PRODUCT,
  earlyAccess: { ...FEATURED_PRODUCT.earlyAccess, enabled: false }
};
assert.equal(disabledProduct.status, 'available');
assert.equal(isEarlyAccessInterest(disabledProduct, 'early-access'), false);

const sources: Array<[string, RegExp]> = [
  ['src/app/[locale]/page.tsx', /earlyAccess=\{FEATURED_PRODUCT\.earlyAccess\.enabled \?/],
  ['src/components/home/ZaikoFeature.tsx', /earlyAccess \? \(/],
  ['src/app/[locale]/products/zaiko/page.tsx', /FEATURED_PRODUCT\.earlyAccess\.enabled \? <ZaikoEarlyAccess/],
  ['src/components/product/zaiko/ZaikoHero.tsx', /earlyAccess \? \(/],
  ['src/components/product/zaiko/ZaikoProductNav.tsx', /\.\.\.\(earlyAccessLabel \?/],
  ['src/components/product/zaiko/ZaikoFinalCta.tsx', /earlyAccess \? <TrackedButton/],
  ['src/app/[locale]/products/zaiko/page.tsx', /gettingStartedDemoOnly/],
  ['src/app/[locale]/demo/page.tsx', /earlyAccessEnabled=\{resolvedProduct\.earlyAccess\.enabled\}/],
  ['src/components/forms/DemoRequestForm.tsx', /earlyAccessEnabled \? <div/]
];
for (const [file, pattern] of sources) assert.match(read(file), pattern, `${file} should derive Early Access UI from program state`);

assert.ok(!read('src/components/home/ZaikoFeature.tsx').match(/^\s*(['"])use client\1;/m));
assert.ok(!read('src/components/product/zaiko/ZaikoHero.tsx').match(/^\s*(['"])use client\1;/m));
assert.ok(!read('src/components/product/zaiko/ZaikoFinalCta.tsx').match(/^\s*(['"])use client\1;/m));

console.log('Product program regression checks passed.');
