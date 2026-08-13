import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

const page = read('src/app/[locale]/products/zaiko/page.tsx');
const story = read('src/components/product/zaiko/ZaikoWorkflowStory.tsx');
const nav = read('src/components/product/zaiko/ZaikoProductNav.tsx');
const visual = read('src/components/product/zaiko/ZaikoProductVisual.tsx');
const marketing = read('src/lib/product-marketing.ts');
const en = JSON.parse(read('src/i18n/messages/en.json'));
const es = JSON.parse(read('src/i18n/messages/es.json'));

for (const component of ['<ZaikoHero', '<ZaikoWorkflowStory', '<ZaikoProductFit', '<ZaikoEarlyAccess', '<ZaikoFaq', '<InsightCard', '<ZaikoFinalCta']) {
  assert.ok(page.includes(component), `${component} should remain in the product story`);
}
for (const anchor of ['overview', 'invoice-capture', 'inventory', 'food-cost', 'counts-reorder', 'owner-view']) {
  assert.ok((page + nav + story + marketing).includes(anchor), `${anchor} should be exposed as a semantic chapter or navigation anchor`);
}
assert.ok(story.includes('scroll-mt-36'), 'Workflow anchors should account for sticky navigation');
assert.ok(story.includes('<ol'), 'Workflow sequence should use ordered semantic markup');
assert.ok(!story.includes('overflow-x-auto'), 'Workflow should wrap rather than require horizontal scrolling');
assert.ok(page.includes('filterMarketableEntries'), 'Product chapters should consult shared marketing availability');
assert.ok(page.includes('getWorkflowMarketingState'), 'Workflow copy should derive its availability state');
assert.ok(nav.includes('filterProductNavigationItems'), 'Navigation should use shared filtering for hidden chapters');
assert.match(page, /visibleChapterIds=\{chapters\.map\(\(\{ id \}\) => id\)\}/, 'Navigation visibility should use the rendered chapters');
assert.match(read('src/components/product/zaiko/ZaikoHero.tsx'), /id="overview"/, 'Overview navigation must retain its hero target');
assert.ok(page.includes('PRODUCT_TRUST_PRINCIPLES'), 'Product page should consume trust principles');
assert.ok(page.includes('PRODUCT_NON_CLAIMS'), 'Product page should consume explicit non-claims');
assert.match(page, /FEATURED_PRODUCT\.earlyAccess\.enabled \? <ZaikoEarlyAccess/, 'Early Access remains registry-controlled');
assert.ok(visual.includes("type: 'hero' | 'inventory' | 'purchases' | 'activity' | 'costs' | 'counts' | 'workflow'"), 'Representative visual types include Counts/Reorder');
assert.match(marketing, /id: 'counts-reorder'[\s\S]*visual: 'counts'/, 'Counts/Reorder should map to its representative visual');
assert.match(visual, /function Counts/, 'Counts/Reorder representative visual should exist');
for (const concept of ['l.expected', 'l.counted', 'l.variance', 'l.target', 'l.neededToTarget', 'l.suggestedPurchase']) {
  assert.ok(visual.includes(concept), `Counts/Reorder visual should represent ${concept.slice(2)} separately`);
}
assert.match(visual, /\[l\.chickenBreast, '12 lb', '0 lb', '-12 lb'\]/, 'A numeric zero should remain a completed count with variance');
assert.match(visual, /\[l\.oliveOil, '6 gal', l\.uncounted, '—'\]/, 'Uncounted should remain distinct from a numeric zero and have no variance');
assert.doesNotMatch(visual, /l\.toBuy|l\.package/, 'Shortage and package-aware purchase must not use ambiguous legacy labels');
assert.ok(visual.includes('FEATURED_PRODUCT.name'), 'Representative visuals use the registry product name');
assert.ok(visual.includes('<figcaption'), 'Representative sample data remains disclosed');
assert.ok(page.includes("operatingSystem: productPlatformToSchemaOperatingSystem(FEATURED_PRODUCT.platform)"), 'Structured data platform remains registry-driven');
assert.ok(page.includes('routeKey="insightRestaurantFoodCost"') && page.includes('routeKey="insightRestaurantInventoryCounts"'), 'Product page should expose multiple relevant guides');

for (const messages of [en, es]) {
  assert.equal(messages.zaikoPage.story.workflow.steps.length, 9);
  assert.equal(messages.zaikoPage.faq.items.length, 10);
  for (const key of ['invoice', 'inventory', 'costing', 'counts', 'owner']) assert.ok(messages.zaikoPage.story.chapters[key]);
  for (const state of ['available', 'early-access', 'launch-release', 'not-marketed']) {
    assert.equal(typeof messages.zaikoPage.story.workflow.availability[state], 'string');
  }
}
assert.doesNotMatch(en.zaikoPage.workflow.heading, /restaurant like yours|intended for/i, 'Connected-workflow copy should not duplicate audience fit');
assert.doesNotMatch(es.zaikoPage.workflow.heading, /restaurante como el tuyo|está pensado/i, 'Spanish connected-workflow copy should not duplicate audience fit');
assert.match(en.zaikoPage.audience.body, /one restaurant location|single-location|one location/i, 'Audience copy should retain single-location fit');
console.log('Product page structure regression checks passed.');
