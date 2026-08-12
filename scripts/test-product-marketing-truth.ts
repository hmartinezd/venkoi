import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import en from '../src/i18n/messages/en.json';
import es from '../src/i18n/messages/es.json';
import {
  COST_COVERAGE_STATES,
  PRODUCT_CAPABILITIES,
  PRODUCT_CAPABILITY_GROUPS,
  PRODUCT_NON_CLAIMS,
  PRODUCT_TRUST_PRINCIPLES,
  getCapabilitiesForGroup,
  getGroupAvailability
} from '../src/lib/product-capabilities';

const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

assert.equal(new Set(PRODUCT_CAPABILITIES.map(({ id }) => id)).size, PRODUCT_CAPABILITIES.length);
for (const group of PRODUCT_CAPABILITY_GROUPS) {
  assert.ok(PRODUCT_CAPABILITIES.some((capability) => capability.group === group), `${group} must be represented`);
}
assert.ok(PRODUCT_CAPABILITIES.every(({ releaseScope }) => releaseScope === 'first-release'));
assert.ok(
  PRODUCT_CAPABILITIES.every(({ availability }) => availability === 'launch-release'),
  'Capabilities without documented release acceptance must remain launch-release'
);
assert.ok(getCapabilitiesForGroup('physical-counts').length > 0);
assert.equal(getGroupAvailability('invoice-purchase-capture'), 'launch-release');

const capabilityIds = new Set(PRODUCT_CAPABILITIES.map(({ id }) => id));
for (const required of [
  'purchase-draft',
  'explicit-purchase-posting',
  'activity-history',
  'incomplete-comparison-warnings',
  'preparation-cost-coverage',
  'menu-cost-coverage',
  'zero-distinct-from-uncounted',
  'package-aware-suggested-quantity',
  'clean-device-recovery-validation'
]) {
  assert.ok(capabilityIds.has(required), `${required} must remain modeled`);
}

assert.equal(PRODUCT_TRUST_PRINCIPLES.invoicePosting.automaticPosting, false);
assert.deepEqual(PRODUCT_TRUST_PRINCIPLES.invoicePosting.userMust, ['review', 'correct', 'explicitly-post']);
assert.equal(PRODUCT_TRUST_PRINCIPLES.traceability.inventoryChangesRetainSourceHistory, true);
assert.deepEqual(COST_COVERAGE_STATES, ['full', 'partial', 'uncosted']);
assert.equal(PRODUCT_TRUST_PRINCIPLES.costing.fabricateMissingCosts, false);
assert.equal(PRODUCT_TRUST_PRINCIPLES.physicalCounts.zeroEqualsUncounted, false);
assert.equal(PRODUCT_TRUST_PRINCIPLES.physicalCounts.reviewBeforePosting, true);
assert.equal(PRODUCT_TRUST_PRINCIPLES.reorder.supplierElectronicOrdering, false);

for (const nonClaim of [
  'cloud-sync',
  'multi-location-management',
  'supplier-electronic-ordering',
  'ios-application',
  'autonomous-purchasing',
  'automatic-invoice-posting'
]) {
  assert.ok(PRODUCT_NON_CLAIMS.includes(nonClaim as (typeof PRODUCT_NON_CLAIMS)[number]));
}

const publicMarketing = [
  JSON.stringify(en),
  JSON.stringify(es),
  read('src/app/[locale]/products/zaiko/page.tsx'),
  read('src/app/[locale]/page.tsx'),
  read('src/app/[locale]/demo/page.tsx'),
  read('src/components/home/ZaikoFeature.tsx'),
  ...[
    'ZaikoCapabilities', 'ZaikoContext', 'ZaikoEarlyAccess', 'ZaikoExplorer', 'ZaikoFaq',
    'ZaikoFinalCta', 'ZaikoHero', 'ZaikoProductFit', 'ZaikoProductNav', 'ZaikoProductVisual', 'ZaikoWorkflowStory'
  ].map((name) => read(`src/components/product/zaiko/${name}.tsx`))
].join('\n');

for (const unsupportedPositiveClaim of [
  /invoices? (?:are|is) automatically posted/i,
  /autonomous purchasing/i,
  /electronically places supplier orders/i,
  /available (?:on|for) iOS/i,
  /built for enterprise multi-location/i
]) {
  assert.doesNotMatch(publicMarketing, unsupportedPositiveClaim);
}

const productPage = read('src/app/[locale]/products/zaiko/page.tsx');
for (const chapter of ['invoice-capture', 'inventory', 'food-cost', 'counts-reorder', 'owner-view']) {
  assert.match(productPage, new RegExp(`'${chapter}'`));
}
assert.match(en.zaikoPage.story.chapters.invoice.trust, /restaurant decides/i);
assert.match(en.zaikoPage.story.chapters.costing.trust, /instead of inventing precision/i);
assert.match(en.zaikoPage.story.chapters.counts.trust, /0 means counted and found zero/i);
assert.match(en.zaikoPage.story.chapters.counts.trust, /does not place supplier orders electronically/i);
assert.match(en.zaikoPage.hero.body, /Android/);
assert.match(en.zaikoPage.hero.body, /local-first/i);
assert.doesNotMatch(en.zaikoPage.hero.body, /Web|iOS|cloud sync|multi-location/i);

const truthDoc = read('docs/PRODUCT-MARKETING-TRUTH.md');
assert.match(truthDoc, /Android/);
assert.match(truthDoc, /local-first/);
assert.match(truthDoc, /single-location/);
assert.match(truthDoc, /never automatically posts a purchase/);
assert.match(truthDoc, /zero is different from an uncounted item/);

console.log('Product marketing-truth regression checks passed.');
