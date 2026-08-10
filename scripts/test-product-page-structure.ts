import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function read(file: string) {
  return readFileSync(resolve(process.cwd(), file), 'utf8');
}

const page = read('src/app/[locale]/products/zaiko/page.tsx');
const explorer = read('src/components/product/zaiko/ZaikoExplorer.tsx');
const capabilities = read('src/components/product/zaiko/ZaikoCapabilities.tsx');
const productNav = read('src/components/product/zaiko/ZaikoProductNav.tsx');

const expectedOrder = [
  '<ZaikoHero',
  '<ZaikoContext',
  '<ZaikoExplorer',
  '<ZaikoCapabilities',
  '<ZaikoProductFit',
  '<ZaikoEarlyAccess',
  '<ZaikoFaq',
  '<InsightCard',
  '<ZaikoFinalCta'
];

let previousIndex = -1;
for (const component of expectedOrder) {
  const index = page.indexOf(component);
  assert.ok(index > previousIndex, `${component} should appear in the intended Product page sequence`);
  previousIndex = index;
}

assert.ok(!page.includes('ZaikoFeatureSection'), 'Product page should not render ZaikoFeatureSection');
assert.ok(page.trimEnd().endsWith('</>\n  );\n}'), 'Final CTA should remain the final rendered page section');

for (const area of ['inventory', 'purchases', 'activity', 'costs']) {
  assert.ok(explorer.includes(`'${area}'`), `Explorer should include the ${area} area key`);
  assert.ok(capabilities.includes("id={capability.id}"), 'Capabilities should render each capability anchor id');
  assert.ok(productNav.includes(`href: '#${area}'`), `Product navigation should preserve #${area}`);
}

assert.ok(capabilities.includes('scroll-mt-36'), 'Capability anchors should preserve the sticky-nav scroll offset');
assert.ok(!explorer.includes('supporting:'), 'Explorer content model should not receive supporting bullets');
assert.ok(!explorer.includes('activeContent.supporting'), 'Explorer should not render detailed supporting bullets');
assert.ok(explorer.includes('activeContent.summary'), 'Explorer should render concise area summaries');
assert.ok(explorer.includes("source: 'zaiko_explorer'"), 'Explorer Demo analytics source should remain stable');
assert.ok(explorer.includes('eventName="zaiko_demo_cta"'), 'Explorer Demo event should remain stable');
assert.ok(explorer.includes('buildProductDemoHref'), 'Explorer Demo URL should use the product-link helper');
assert.ok(explorer.includes('href={`#${activeArea}`}'), 'Explorer detail link should target the active capability');
assert.ok(explorer.includes('aria-pressed={activeArea === area}'), 'Explorer selectors should preserve aria-pressed');

for (const file of [
  'src/components/product/zaiko/ZaikoContext.tsx',
  'src/components/product/zaiko/ZaikoCapabilities.tsx',
  'src/components/product/zaiko/ZaikoProductFit.tsx'
]) {
  assert.ok(!/^\s*(['"])use client\1;/m.test(read(file)), `${file} should remain a Server Component`);
}

console.log('Product page structure regression checks passed.');
