import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');
const form = read('src/components/forms/DemoRequestForm.tsx');
const page = read('src/app/[locale]/demo/page.tsx');
const footer = read('src/components/layout/Footer.tsx');
const about = read('src/app/[locale]/about/page.tsx');
const insight = read('src/app/[locale]/insights/restaurant-inventory-information/page.tsx');
const contact = read('src/app/[locale]/contact/page.tsx');
const productMarketing = read('src/lib/product-marketing.ts');

const assertConversionEntry = (
  source: string,
  expectedSource: string,
  eventName: 'zaiko_demo_cta' | 'zaiko_early_access_cta'
) => {
  assert.match(source, new RegExp(`eventName=["']${eventName}["']`));
  assert.match(source, new RegExp(`source: ["']${expectedSource}["']`));
};

assert.match(footer, /buildProductDemoHref\(locale, FEATURED_PRODUCT, \{ source: 'footer' \}\)/);
assert.match(footer, /buildProductDemoHref\(locale, FEATURED_PRODUCT, \{ interest: 'early-access', source: 'footer' \}\)/);
assertConversionEntry(footer, 'footer', 'zaiko_demo_cta');
assertConversionEntry(footer, 'footer', 'zaiko_early_access_cta');

assert.match(about, /buildProductDemoHref\(currentLocale, FEATURED_PRODUCT, \{ source: 'about' \}\)/);
assertConversionEntry(about, 'about', 'zaiko_demo_cta');

assert.match(insight, /buildProductDemoHref\(currentLocale, FEATURED_PRODUCT, \{ source: 'insight' \}\)/);
assertConversionEntry(insight, 'insight', 'zaiko_demo_cta');

assert.match(contact, /buildProductDemoHref\(currentLocale, FEATURED_PRODUCT, \{ source: 'contact_escape' \}\)/);
assertConversionEntry(contact, 'contact_escape', 'zaiko_demo_cta');

for (const legacySource of ['about_footer', 'insight_restaurant_inventory', 'zaiko_explorer']) {
  for (const conversionEntry of [footer, about, insight, contact]) {
    assert.doesNotMatch(conversionEntry, new RegExp(`source: ["']${legacySource}["']`));
  }
}

assert.match(form, /if \(pending\) return;/, 'pending submissions have a synchronous guard');
assert.match(form, /disabled=\{pending\}/, 'submit is disabled while pending');
assert.match(form, /submitEarlyAccess/, 'Early Access uses an intent-aware submit label');
assert.match(form, /fixedEarlyAccessIntent/, 'URL-selected Early Access cannot contradict page intent');
assert.match(form, /demo_form_start/);
assert.match(form, /demo_form_submit/);
assert.match(form, /demo_form_success/);
assert.equal((form.match(/source: conversionSource/g) ?? []).length, 3, 'controlled source reaches all downstream funnel events');
assert.match(form, /optionalSummary/, 'qualification remains progressive and optional');
assert.match(form, /optionalDetailsRef\.current\.open = true/, 'hidden optional errors open before focus');
assert.match(form, /successActions\.product/);
assert.match(form, /successActions\.guide/);
assert.match(page, /normalizeDemoConversionSource\(source\)/, 'Demo page normalizes source before client analytics');
assert.match(page, /fixedEarlyAccessIntent=\{isEarlyAccess\}/);
for (const agendaKey of ['setupInventory', 'invoicePurchase', 'costIntelligence', 'countsReorder', 'ownerView']) {
  assert.match(productMarketing, new RegExp(agendaKey), `Demo agenda should include ${agendaKey}`);
}
assert.match(page, /filterMarketableEntries\(DEMO_AGENDA\)/, 'Demo agenda should omit non-marketable workflows');

console.log('Demo funnel regression tests passed.');
