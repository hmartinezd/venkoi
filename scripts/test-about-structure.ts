import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (file: string): string => readFileSync(resolve(process.cwd(), file), 'utf8');
const about = read('src/app/[locale]/about/page.tsx');

const chapterMarkers = [
  '{/* Hero */}',
  '{/* Product Direction */}',
  '{/* How We Build */}',
  '{/* Local Context / Direct Relationship */}',
  '{/* Final About CTA */}'
];

let previousIndex = -1;
for (const marker of chapterMarkers) {
  const index = about.indexOf(marker);
  assert.ok(index > previousIndex, `${marker} should appear in the intended About sequence`);
  previousIndex = index;
}

assert.match(about, /t\('venkoiProductsDesc', \{ productName: FEATURED_PRODUCT\.name \}\)/);
assert.match(about, /t\('exploreZaikoCta', \{ productName: FEATURED_PRODUCT\.name \}\)/);
assert.match(about, /href=\{buildProductDemoHref\(currentLocale, FEATURED_PRODUCT, \{ source: 'about' \}\)\}/);
assert.match(about, /eventName="zaiko_demo_cta"/);
assert.match(about, /product: FEATURED_PRODUCT\.analyticsProduct/);
assert.match(about, /source: 'about'/);
assert.match(about, /href=\{getLocalizedPath\('contact', currentLocale\)\}/);
assert.ok(!about.includes("'?type=services"), 'The generic About conversation should not force service intent');
assert.ok(!/^\s*(['"])use client\1;/m.test(about), 'About should remain a Server Component');

console.log('About structure regression checks passed.');
