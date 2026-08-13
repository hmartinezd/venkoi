import {
  aggregateCapabilityAvailability,
  getGroupAvailability,
  type ProductCapabilityAvailability,
  type ProductCapabilityGroup
} from './product-capabilities';

export type ProductMarketingState = ProductCapabilityAvailability;
export type ProductMarketingStateResolver = (
  groups: readonly ProductCapabilityGroup[]
) => ProductMarketingState;

export const PRODUCT_STORY_CHAPTERS = [
  { id: 'invoice-capture', key: 'invoice', groups: ['invoice-purchase-capture'], visual: 'purchases' },
  { id: 'inventory', key: 'inventory', groups: ['inventory', 'traceability'], visual: 'activity' },
  { id: 'food-cost', key: 'costing', groups: ['vendor-price-intelligence', 'preparation-costing', 'menu-costing'], visual: 'costs' },
  { id: 'counts-reorder', key: 'counts', groups: ['physical-counts', 'reorder-assistance'], visual: 'counts' },
  { id: 'owner-view', key: 'owner', groups: ['owner-view'] }
] as const satisfies readonly {
  id: string;
  key: string;
  groups: readonly ProductCapabilityGroup[];
  visual?: 'purchases' | 'inventory' | 'activity' | 'costs' | 'counts';
}[];

export const PRODUCT_WORKFLOW_STEPS = [
  { key: 0, groups: ['setup'] },
  { key: 1, groups: ['invoice-purchase-capture'] },
  { key: 2, groups: ['invoice-purchase-capture'] },
  { key: 3, groups: ['invoice-purchase-capture'] },
  { key: 4, groups: ['inventory', 'traceability'] },
  { key: 5, groups: ['vendor-price-intelligence', 'preparation-costing', 'menu-costing'] },
  { key: 6, groups: ['physical-counts'] },
  { key: 7, groups: ['reorder-assistance'] },
  { key: 8, groups: ['owner-view'] }
] as const satisfies readonly { key: number; groups: readonly ProductCapabilityGroup[] }[];

export const HOMEPAGE_PRODUCT_OUTCOMES = PRODUCT_STORY_CHAPTERS;

export const DEMO_AGENDA = [
  { key: 'setupInventory', groups: ['setup', 'inventory'] },
  { key: 'invoicePurchase', groups: ['invoice-purchase-capture'] },
  { key: 'costIntelligence', groups: ['vendor-price-intelligence', 'preparation-costing', 'menu-costing'] },
  { key: 'countsReorder', groups: ['physical-counts', 'reorder-assistance'] },
  { key: 'ownerView', groups: ['owner-view', 'exports', 'data-safety'] }
] as const satisfies readonly { key: string; groups: readonly ProductCapabilityGroup[] }[];

export function getGroupsMarketingState(
  groups: readonly ProductCapabilityGroup[]
): ProductMarketingState {
  return aggregateCapabilityAvailability(groups.map(getGroupAvailability));
}

export function getProductSectionMarketingState(
  groups: readonly ProductCapabilityGroup[],
  resolveState: ProductMarketingStateResolver = getGroupsMarketingState
): ProductMarketingState | null {
  const state = resolveState(groups);
  return state === 'not-marketed' ? null : state;
}

export function areGroupsMarketable(groups: readonly ProductCapabilityGroup[]): boolean {
  return getGroupsMarketingState(groups) !== 'not-marketed';
}

export function filterMarketableEntries<T extends { groups: readonly ProductCapabilityGroup[] }>(
  entries: readonly T[],
  resolveState: ProductMarketingStateResolver = getGroupsMarketingState
): T[] {
  return entries.filter(({ groups }) => resolveState(groups) !== 'not-marketed');
}

export function getEntriesMarketingState<T extends { groups: readonly ProductCapabilityGroup[] }>(
  entries: readonly T[],
  resolveState: ProductMarketingStateResolver = getGroupsMarketingState
): ProductMarketingState {
  return aggregateCapabilityAvailability(
    filterMarketableEntries(entries, resolveState).map(({ groups }) => resolveState(groups))
  );
}

export function getWorkflowMarketingState(
  resolveState: ProductMarketingStateResolver = getGroupsMarketingState
): ProductMarketingState {
  return getEntriesMarketingState(PRODUCT_WORKFLOW_STEPS, resolveState);
}

export function getHomepageMarketingState(
  resolveState: ProductMarketingStateResolver = getGroupsMarketingState
): ProductMarketingState {
  return getEntriesMarketingState(HOMEPAGE_PRODUCT_OUTCOMES, resolveState);
}

export function filterProductNavigationItems<T extends { href: string }>(
  items: readonly T[],
  visibleChapterIds: readonly string[]
): T[] {
  return items.filter(({ href }) => href === '#overview' || visibleChapterIds.includes(href.slice(1)));
}
