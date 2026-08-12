export const PRODUCT_CAPABILITY_GROUPS = [
  'setup',
  'invoice-purchase-capture',
  'inventory',
  'traceability',
  'vendor-price-intelligence',
  'preparation-costing',
  'menu-costing',
  'physical-counts',
  'reorder-assistance',
  'owner-view',
  'exports',
  'data-safety'
] as const;

export type ProductCapabilityGroup = (typeof PRODUCT_CAPABILITY_GROUPS)[number];
export type ProductReleaseScope = 'first-release' | 'post-pilot';
export type ProductCapabilityAvailability =
  | 'available'
  | 'early-access'
  | 'launch-release'
  | 'not-marketed';

export type ProductCapability = {
  id: string;
  group: ProductCapabilityGroup;
  releaseScope: ProductReleaseScope;
  availability: ProductCapabilityAvailability;
};

function launchCapabilities(
  group: ProductCapabilityGroup,
  ids: readonly string[]
): ProductCapability[] {
  return ids.map((id) => ({
    id,
    group,
    releaseScope: 'first-release',
    availability: 'launch-release'
  }));
}

// Release acceptance is not documented for these newly modeled workflows, so they
// remain launch-release facts rather than claims of present public availability.
export const PRODUCT_CAPABILITIES: readonly ProductCapability[] = [
  ...launchCapabilities('setup', [
    'restaurant-profile', 'storage-areas', 'ingredient-catalog', 'units', 'count-units',
    'purchase-packages', 'package-conversions', 'suppliers', 'vendor-items', 'catalog-csv-import',
    'import-validation-correction'
  ]),
  ...launchCapabilities('invoice-purchase-capture', [
    'camera-document-capture', 'ocr-document-extraction', 'reviewable-detected-fields',
    'supplier-invoice-metadata', 'invoice-totals', 'invoice-line-extraction',
    'extraction-confidence-validation', 'vendor-item-ingredient-matching',
    'package-conversion-matching', 'correction-before-posting', 'purchase-draft',
    'attached-source-document', 'explicit-purchase-posting'
  ]),
  ...launchCapabilities('inventory', [
    'current-inventory', 'inventory-storage-areas', 'purchases', 'waste', 'production',
    'adjustments', 'physical-count-adjustments', 'inventory-movement'
  ]),
  ...launchCapabilities('traceability', [
    'activity-history', 'movement-source', 'purchase-source', 'waste-source',
    'production-source', 'count-adjustment-source', 'audit-friendly-history'
  ]),
  ...launchCapabilities('vendor-price-intelligence', [
    'latest-purchase-price', 'previous-comparable-price', 'absolute-price-change',
    'percentage-price-change', 'package-price', 'normalized-base-unit-cost',
    'supplier-vendor-item-history', 'comparable-supplier-pricing',
    'meaningful-increase-warnings', 'incomplete-comparison-warnings',
    'purchase-line-source-traceability'
  ]),
  ...launchCapabilities('preparation-costing', [
    'preparation-recipes', 'preparation-raw-ingredients', 'prepared-nested-components',
    'current-component-cost', 'batch-cost', 'preparation-yield', 'cost-per-yield-unit',
    'ingredient-price-change-impact', 'preparation-cost-coverage'
  ]),
  ...launchCapabilities('menu-costing', [
    'menu-raw-ingredients', 'menu-prepared-ingredients', 'plate-cost', 'manual-selling-price',
    'food-cost-percentage', 'gross-profit-before-labor-overhead', 'menu-cost-coverage',
    'menu-vendor-price-change-impact'
  ]),
  ...launchCapabilities('physical-counts', [
    'fast-count-entry', 'physical-count-units', 'transparent-count-conversions',
    'count-search-filter', 'count-progress', 'resume-unfinished-count',
    'zero-distinct-from-uncounted', 'count-review-before-posting',
    'expected-counted-variance', 'traceable-count-adjustment', 'final-count-summary'
  ]),
  ...launchCapabilities('reorder-assistance', [
    'below-par-ingredients', 'quantity-needed-to-par', 'reorder-supplier-grouping',
    'package-aware-suggested-quantity', 'shareable-csv-shopping-list'
  ]),
  ...launchCapabilities('owner-view', [
    'current-inventory-value', 'recent-purchasing', 'purchases-week-month', 'waste-value',
    'top-wasted-ingredients', 'owner-price-increase-signals', 'owner-incomplete-cost-coverage',
    'owner-preparation-menu-costs', 'owner-below-par-items', 'recent-operational-signals'
  ]),
  ...launchCapabilities('exports', ['pilot-workflow-csv-exports']),
  ...launchCapabilities('data-safety', [
    'backup', 'restore-recovery', 'clean-device-recovery-validation', 'pilot-support-diagnostics'
  ])
];

export const COST_COVERAGE_STATES = ['full', 'partial', 'uncosted'] as const;
export type CostCoverageState = (typeof COST_COVERAGE_STATES)[number];

export const PRODUCT_TRUST_PRINCIPLES = {
  invoicePosting: {
    detectionCan: ['detect', 'extract', 'match', 'suggest'],
    userMust: ['review', 'correct', 'explicitly-post'],
    automaticPosting: false
  },
  traceability: {
    inventoryChangesRetainSourceHistory: true
  },
  costing: {
    coverageStates: COST_COVERAGE_STATES,
    fabricateMissingCosts: false
  },
  physicalCounts: {
    zeroEqualsUncounted: false,
    reviewBeforePosting: true
  },
  reorder: {
    supplierElectronicOrdering: false
  },
  dataSafety: {
    operationalDataShouldBeRecoverable: true,
    automaticBackupIsCurrentPublicClaim: false
  }
} as const;

export const PRODUCT_NON_CLAIMS = [
  'pos-integration',
  'accounting-integration',
  'cloud-sync',
  'multi-location-management',
  'supplier-electronic-ordering',
  'ios-application',
  'advanced-ai-copilot',
  'autonomous-purchasing',
  'automatic-invoice-posting',
  'enterprise-chain-management'
] as const;

export function getCapabilitiesForGroup(group: ProductCapabilityGroup): readonly ProductCapability[] {
  return PRODUCT_CAPABILITIES.filter((capability) => capability.group === group);
}

export function getGroupAvailability(group: ProductCapabilityGroup): ProductCapabilityAvailability {
  const capabilities = getCapabilitiesForGroup(group);
  if (capabilities.some((capability) => capability.availability === 'available')) return 'available';
  if (capabilities.some((capability) => capability.availability === 'early-access')) return 'early-access';
  if (capabilities.some((capability) => capability.availability === 'launch-release')) return 'launch-release';
  return 'not-marketed';
}
