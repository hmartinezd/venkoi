import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

const page = read('src/app/[locale]/products/zaiko/page.tsx');
const story = read('src/components/product/zaiko/ZaikoWorkflowStory.tsx');
const nav = read('src/components/product/zaiko/ZaikoProductNav.tsx');
const visual = read('src/components/product/zaiko/ZaikoProductVisual.tsx');
const en = JSON.parse(read('src/i18n/messages/en.json'));
const es = JSON.parse(read('src/i18n/messages/es.json'));

for (const component of ['<ZaikoHero', '<ZaikoWorkflowStory', '<ZaikoProductFit', '<ZaikoEarlyAccess', '<ZaikoFaq', '<InsightCard', '<ZaikoFinalCta']) {
  assert.ok(page.includes(component), `${component} should remain in the product story`);
}
for (const anchor of ['overview', 'invoice-capture', 'inventory', 'food-cost', 'counts-reorder', 'owner-view']) {
  assert.ok((page + nav + story).includes(anchor), `${anchor} should be exposed as a semantic chapter or navigation anchor`);
}
assert.ok(story.includes('scroll-mt-36'), 'Workflow anchors should account for sticky navigation');
assert.ok(story.includes('<ol'), 'Workflow sequence should use ordered semantic markup');
assert.ok(!story.includes('overflow-x-auto'), 'Workflow should wrap rather than require horizontal scrolling');
assert.ok(page.includes('getGroupAvailability'), 'Product claims should consult capability availability');
assert.ok(page.includes('PRODUCT_TRUST_PRINCIPLES'), 'Product page should consume trust principles');
assert.ok(page.includes('PRODUCT_NON_CLAIMS'), 'Product page should consume explicit non-claims');
assert.match(page, /FEATURED_PRODUCT\.earlyAccess\.enabled \? <ZaikoEarlyAccess/, 'Early Access remains registry-controlled');
assert.ok(visual.includes("type: 'hero' | 'inventory' | 'purchases' | 'activity' | 'costs' | 'workflow'"), 'Existing representative visual types remain available');
assert.ok(visual.includes('FEATURED_PRODUCT.name'), 'Representative visuals use the registry product name');
assert.ok(visual.includes('<figcaption'), 'Representative sample data remains disclosed');
assert.ok(page.includes("operatingSystem: productPlatformToSchemaOperatingSystem(FEATURED_PRODUCT.platform)"), 'Structured data platform remains registry-driven');

for (const messages of [en, es]) {
  assert.equal(messages.zaikoPage.story.workflow.steps.length, 9);
  assert.equal(messages.zaikoPage.faq.items.length, 10);
  for (const key of ['invoice', 'inventory', 'costing', 'counts', 'owner']) assert.ok(messages.zaikoPage.story.chapters[key]);
}
console.log('Product page structure regression checks passed.');
