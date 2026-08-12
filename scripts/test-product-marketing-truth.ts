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
  PRODUCT_TRUST_PRINCIPLES
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
    'ZaikoFinalCta', 'ZaikoHero', 'ZaikoProductFit', 'ZaikoProductNav', 'ZaikoProductVisual'
  ].map((name) => read(`src/components/product/zaiko/${name}.tsx`))
].join('\n');

for (const unsupportedClaim of [
  /automatic(?:ally)? (?:invoice|purchase) post/i,
  /autonomous purchasing/i,
  /electronic(?:ally)? order(?:ing)? (?:from )?suppliers/i,
  /available (?:on|for) iOS/i,
  /enterprise multi-location/i
]) {
  assert.doesNotMatch(publicMarketing, unsupportedClaim);
}

const productPage = read('src/app/[locale]/products/zaiko/page.tsx');
for (const preservedArea of ['inventory', 'purchases', 'activity', 'costs']) {
  assert.match(productPage, new RegExp(`'${preservedArea}'`));
}
assert.doesNotMatch(productPage, /Invoice Capture|Counts & Reorder|Owner View/);

const truthDoc = read('docs/PRODUCT-MARKETING-TRUTH.md');
assert.match(truthDoc, /Android/);
assert.match(truthDoc, /local-first/);
assert.match(truthDoc, /single-location/);
assert.match(truthDoc, /never automatically posts a purchase/);
assert.match(truthDoc, /zero is different from an uncounted item/);

console.log('Product marketing-truth regression checks passed.');
