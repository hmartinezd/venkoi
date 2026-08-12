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
  'home.zaiko.badge',
  'home.zaiko.availability.launch-release',
  'zaikoPage.nav.earlyAccess',
  'zaikoPage.hero.microcopy',
  'zaikoPage.earlyAccess.eyebrow',
  'zaikoPage.earlyAccess.body',
  'zaikoPage.finalCta.body',
  'demoPage.earlyAccess.badge',
  'demoPage.earlyAccess.body',
  'demoPage.earlyAccess.successMessage'
] as const;

assert.equal(en.common.requestAccess, 'Request Access');
assert.equal(es.common.requestAccess, 'Solicitar Acceso');
assert.equal(en.footer.earlyAccess, 'Request Access');
assert.equal(es.footer.earlyAccess, 'Solicitar Acceso');

for (const [locale, messages, expected, stale] of [
  ['en', en, '6 months', '3 months'],
  ['es', es, '6 meses', '3 meses']
] as const) {
  const t = createTranslator({ locale, messages });
  for (const key of keys) {
    const rendered = t(key, { productName: 'Program Test Product', freeMonths: 6 });
    assert.match(rendered, new RegExp(expected, 'i'), `${locale.toUpperCase()} ${key} should use the alternate duration`);
    assert.doesNotMatch(rendered, new RegExp(stale, 'i'), `${locale.toUpperCase()} ${key} should not retain the current duration`);
  }
}

for (const [locale, messages] of Object.entries({ en, es })) {
  const hardcoded = strings(messages).filter(value => /\b(?:3|three) months\b|\b(?:3|tres) meses\b/i.test(value));
  assert.deepEqual(hardcoded, [], `${locale.toUpperCase()} translations must not hardcode the offer duration`);
  const demoIntentCopy = strings(messages.demoPage.earlyAccess);
  const intentPattern = locale === 'en' ? /access request|request access/i : /solicitud de acceso|solicita acceso/i;
  assert.ok(
    demoIntentCopy.some(value => intentPattern.test(value)),
    `${locale.toUpperCase()} Demo copy should explicitly identify the access-request intent`
  );
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
  ['src/components/product/zaiko/ZaikoFinalCta.tsx', /earlyAccess \? <TrackedButton/],
  ['src/app/[locale]/demo/page.tsx', /earlyAccessEnabled=\{resolvedProduct\.earlyAccess\.enabled\}/],
  ['src/components/forms/DemoRequestForm.tsx', /earlyAccessEnabled \? <div/]
];
for (const [file, pattern] of sources) assert.match(read(file), pattern, `${file} should derive Early Access UI from program state`);

const homepageFeature = read('src/components/home/ZaikoFeature.tsx');
assert.match(homepageFeature, /interest: 'early-access', source: 'home_product'/);
assert.match(homepageFeature, /eventName="zaiko_early_access_cta"/);
assert.match(homepageFeature, /source: 'home_product',[\s\S]*earlyAccess: true/);

const footer = read('src/components/layout/Footer.tsx');
assert.match(footer, /FEATURED_PRODUCT\.earlyAccess\.enabled \? \(/);
assert.match(footer, /interest: 'early-access', source: 'footer'/);
assert.match(footer, /eventName="zaiko_early_access_cta"/);
assert.match(footer, /source: 'footer', earlyAccess: true/);
assert.match(footer, /\{tFooter\('earlyAccess'\)\}/);

assert.ok(!read('src/components/home/ZaikoFeature.tsx').match(/^\s*(['"])use client\1;/m));
assert.ok(!read('src/components/product/zaiko/ZaikoHero.tsx').match(/^\s*(['"])use client\1;/m));
assert.ok(!read('src/components/product/zaiko/ZaikoFinalCta.tsx').match(/^\s*(['"])use client\1;/m));

console.log('Product program regression checks passed.');
