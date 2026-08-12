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
const visual = read('src/components/product/zaiko/ZaikoProductVisual.tsx');
const en = JSON.parse(read('src/i18n/messages/en.json'));
const es = JSON.parse(read('src/i18n/messages/es.json'));

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

assert.ok(capabilities.includes('id={capability.id}'), 'Capabilities should render dynamic capability anchor ids');

for (const area of ['inventory', 'purchases', 'activity', 'costs']) {
  assert.ok(explorer.includes(`'${area}'`), `Explorer should include the ${area} area key`);
  assert.ok(page.includes(`'${area}'`), `Product page capability source should include the ${area} id`);
  assert.ok(productNav.includes(`href: '#${area}'`), `Product navigation should preserve #${area}`);
}

assert.ok(capabilities.includes('scroll-mt-36'), 'Capability anchors should preserve the sticky-nav scroll offset');
assert.match(page, /FEATURED_PRODUCT\.earlyAccess\.enabled \? <ZaikoEarlyAccess/, 'Early Access should retain its position while being conditional');
assert.ok(!explorer.includes('supporting:'), 'Explorer content model should not receive supporting bullets');
assert.ok(!explorer.includes('activeContent.supporting'), 'Explorer should not render detailed supporting bullets');
assert.ok(explorer.includes('activeContent.summary'), 'Explorer should render concise area summaries');
assert.ok(explorer.includes("source: 'zaiko_explorer'"), 'Explorer Demo analytics source should remain stable');
assert.ok(explorer.includes('eventName="zaiko_demo_cta"'), 'Explorer Demo event should remain stable');
assert.ok(explorer.includes('buildProductDemoHref'), 'Explorer Demo URL should use the product-link helper');
assert.ok(explorer.includes('href={`#${activeArea}`}'), 'Explorer detail link should target the active capability');
assert.ok(explorer.includes('aria-pressed={activeArea === area}'), 'Explorer selectors should preserve aria-pressed');
assert.ok(visual.includes("type: 'hero' | 'inventory' | 'purchases' | 'activity' | 'costs' | 'workflow'"), 'Preview system should expose every supported product view');
assert.ok(visual.includes('Representative interface with sample operational data') === false, 'Visible preview copy should remain localized rather than hard-coded');
assert.ok(visual.includes('FEATURED_PRODUCT.name'), 'Product preview should use the registry-driven display name');
assert.ok(visual.includes('<figcaption'), 'Representative sample data should be explicitly disclosed');
assert.ok(!visual.includes('overflow-x-auto'), 'Preview should adapt without introducing horizontal scrolling');
for (const messages of [en, es]) {
  const labels = messages.zaikoPage.visuals;
  for (const key of ['preview', 'sampleData', 'item', 'quantity', 'vendor', 'currentCost', 'tomatoes', 'receiving', 'workflow']) {
    assert.ok(labels[key], `Product preview label ${key} should exist in every locale`);
  }
}

for (const file of [
  'src/components/product/zaiko/ZaikoContext.tsx',
  'src/components/product/zaiko/ZaikoCapabilities.tsx',
  'src/components/product/zaiko/ZaikoProductFit.tsx'
]) {
  assert.ok(!/^\s*(['"])use client\1;/m.test(read(file)), `${file} should remain a Server Component`);
}

console.log('Product page structure regression checks passed.');
