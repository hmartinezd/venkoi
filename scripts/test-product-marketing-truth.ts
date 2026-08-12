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
  aggregateCapabilityAvailability,
  getCapabilitiesForGroup,
  getGroupAvailability
} from '../src/lib/product-capabilities';
import {
  DEMO_AGENDA,
  filterMarketableEntries,
  filterProductNavigationItems,
  getEntriesMarketingState,
  getGroupsMarketingState,
  getHomepageMarketingState,
  getProductSectionMarketingState,
  getWorkflowMarketingState,
  HOMEPAGE_PRODUCT_OUTCOMES,
  PRODUCT_STORY_CHAPTERS,
  PRODUCT_WORKFLOW_STEPS,
  type ProductMarketingStateResolver
} from '../src/lib/product-marketing';

const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

assert.equal(new Set(PRODUCT_CAPABILITIES.map(({ id }) => id)).size, PRODUCT_CAPABILITIES.length);
for (const group of PRODUCT_CAPABILITY_GROUPS) {
  assert.ok(PRODUCT_CAPABILITIES.some((capability) => capability.group === group), `${group} must be represented`);
}
assert.ok(PRODUCT_CAPABILITIES.every(({ releaseScope }) => releaseScope === 'first-release'));
assert.ok(getCapabilitiesForGroup('physical-counts').length > 0);
assert.notEqual(getGroupAvailability('invoice-purchase-capture'), 'not-marketed');

for (const [states, expected] of [
  [['available', 'available'], 'available'],
  [['early-access', 'early-access'], 'early-access'],
  [['launch-release', 'launch-release'], 'launch-release'],
  [['not-marketed', 'not-marketed'], 'not-marketed'],
  [['available', 'early-access'], 'early-access'],
  [['available', 'launch-release'], 'launch-release'],
  [['early-access', 'launch-release'], 'launch-release'],
  [['available', 'not-marketed'], 'available'],
  [['early-access', 'not-marketed'], 'early-access'],
  [['launch-release', 'not-marketed'], 'launch-release']
] as const) {
  assert.equal(aggregateCapabilityAvailability(states), expected, `${states.join(' + ')} should be ${expected}`);
}
const stateResolver = (
  states: Partial<Record<(typeof PRODUCT_CAPABILITY_GROUPS)[number], ReturnType<typeof getGroupAvailability>>>,
  fallback: ReturnType<typeof getGroupAvailability> = 'available'
): ProductMarketingStateResolver => (groups) => aggregateCapabilityAvailability(
  groups.map((group) => states[group] ?? fallback)
);

for (const state of ['available', 'early-access', 'launch-release'] as const) {
  assert.equal(getProductSectionMarketingState(['physical-counts'], stateResolver({ 'physical-counts': state })), state);
}
assert.equal(getProductSectionMarketingState(['physical-counts'], stateResolver({ 'physical-counts': 'not-marketed' })), null);
assert.equal(
  getProductSectionMarketingState(
    ['vendor-price-intelligence', 'preparation-costing', 'menu-costing'],
    stateResolver({ 'vendor-price-intelligence': 'available', 'preparation-costing': 'launch-release', 'menu-costing': 'available' })
  ),
  'launch-release'
);

for (const messages of [en, es]) {
  for (const key of ['restaurantInventoryCounts', 'restaurantFoodCost', 'restaurantSupplierPrices'] as const) {
    const copy = messages.insightsArticles[key].content.productAvailability;
    assert.match(copy.available, /Zaiko|\{productName\}/);
    assert.match(copy['early-access'], /participating restaurants|restaurantes participantes/i);
    assert.match(copy['launch-release'], /initial release|primera versión/i);
    assert.doesNotMatch(JSON.stringify(copy), /Early Access|Acceso Anticipado/i);
  }
}

const foodCost = PRODUCT_STORY_CHAPTERS.find(({ id }) => id === 'food-cost');
assert.ok(foodCost);
assert.equal(
  getEntriesMarketingState([foodCost], stateResolver({
    'vendor-price-intelligence': 'available',
    'preparation-costing': 'launch-release',
    'menu-costing': 'launch-release'
  })),
  'launch-release'
);
assert.equal(
  getEntriesMarketingState([foodCost], stateResolver({
    'vendor-price-intelligence': 'available',
    'preparation-costing': 'early-access',
    'menu-costing': 'available'
  })),
  'early-access'
);

assert.equal(
  getWorkflowMarketingState(stateResolver({ setup: 'launch-release' })),
  'launch-release',
  'Visible Setup must keep an otherwise available workflow at launch-release'
);
assert.equal(getWorkflowMarketingState(stateResolver({})), 'available');
assert.equal(
  getWorkflowMarketingState(stateResolver({ traceability: 'early-access' })),
  'early-access'
);
const setupHidden = stateResolver({ setup: 'not-marketed' });
assert.ok(!filterMarketableEntries(PRODUCT_WORKFLOW_STEPS, setupHidden).some(({ key }) => key === 0));
assert.equal(getWorkflowMarketingState(setupHidden), 'available');

const ownerHidden = stateResolver({ 'owner-view': 'not-marketed' });
const visibleChapters = filterMarketableEntries(PRODUCT_STORY_CHAPTERS, ownerHidden);
assert.ok(!visibleChapters.some(({ id }) => id === 'owner-view'));
assert.ok(visibleChapters.some(({ id }) => id === 'food-cost'));
const mixedFoodCost = stateResolver({
  'vendor-price-intelligence': 'not-marketed',
  'preparation-costing': 'available',
  'menu-costing': 'not-marketed'
});
assert.ok(filterMarketableEntries([foodCost], mixedFoodCost).includes(foodCost));

const navFixture = [
  { href: '#overview' },
  { href: '#invoice-capture' },
  { href: '#owner-view' }
];
assert.deepEqual(
  filterProductNavigationItems(navFixture, visibleChapters.map(({ id }) => id)).map(({ href }) => href),
  ['#overview', '#invoice-capture']
);

const homepageOwnerHidden = filterMarketableEntries(HOMEPAGE_PRODUCT_OUTCOMES, ownerHidden);
assert.ok(!homepageOwnerHidden.some(({ id }) => id === 'owner-view'));
assert.equal(getHomepageMarketingState(ownerHidden), 'available');
assert.equal(
  getHomepageMarketingState(stateResolver({ 'invoice-purchase-capture': 'launch-release' })),
  'launch-release'
);

const hiddenDemoOwner = filterMarketableEntries(DEMO_AGENDA, stateResolver({
  'owner-view': 'not-marketed', exports: 'not-marketed', 'data-safety': 'not-marketed'
}));
assert.ok(!hiddenDemoOwner.some(({ key }) => key === 'ownerView'));
assert.ok(hiddenDemoOwner.some(({ key }) => key === 'invoicePurchase'));

assert.equal(
  getGroupsMarketingState(['vendor-price-intelligence', 'preparation-costing', 'menu-costing']),
  'launch-release',
  'Current multi-group chapter truth must remain conservative'
);
assert.equal(PRODUCT_STORY_CHAPTERS.length, 5);
assert.equal(HOMEPAGE_PRODUCT_OUTCOMES.length, 5);
assert.equal(DEMO_AGENDA.length, 5);

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
const productMarketing = read('src/lib/product-marketing.ts');
for (const chapter of ['invoice-capture', 'inventory', 'food-cost', 'counts-reorder', 'owner-view']) {
  assert.match(productMarketing, new RegExp(`'${chapter}'`));
}
assert.doesNotMatch(productPage, /getGroupAvailability\(group\) === 'launch-release'/);
assert.match(productPage, /filterMarketableEntries\(PRODUCT_STORY_CHAPTERS\)/);
assert.match(productPage, /visibleChapterIds=\{chapters\.map/);
assert.match(read('src/app/[locale]/page.tsx'), /availability\.\$\{homepageState\}/);
assert.match(read('src/app/[locale]/demo/page.tsx'), /filterMarketableEntries\(DEMO_AGENDA\)/);
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
