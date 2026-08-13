import { TrackedButton } from '@/components/analytics/TrackedButton';
import type { Locale } from '@/i18n/config';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';
import { filterProductNavigationItems } from '@/lib/product-marketing';

interface ZaikoProductNavProps {
  locale: Locale;
  productName: string;
  subtitle: string;
  overviewLabel: string;
  invoiceLabel: string;
  inventoryLabel: string;
  foodCostLabel: string;
  countsLabel: string;
  ownerLabel: string;
  requestDemoLabel: string;
  navigationLabel: string;
  visibleChapterIds: readonly string[];
}

export function ZaikoProductNav({
  locale,
  productName,
  subtitle,
  overviewLabel,
  invoiceLabel, inventoryLabel, foodCostLabel, countsLabel, ownerLabel,
  requestDemoLabel,
  navigationLabel,
  visibleChapterIds
}: ZaikoProductNavProps) {
  const navItems = filterProductNavigationItems([
    { label: overviewLabel, href: '#overview' },
    { label: invoiceLabel, href: '#invoice-capture' },
    { label: inventoryLabel, href: '#inventory' },
    { label: foodCostLabel, href: '#food-cost' },
    { label: countsLabel, href: '#counts-reorder' },
    { label: ownerLabel, href: '#owner-view' }
  ], visibleChapterIds);

  return (
    <div className="sticky top-[72px] z-40 border-b border-border bg-surface/95 backdrop-blur-md transition-all">
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-[minmax(0,1fr)_auto] items-center lg:h-14 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:px-8">
        {/* Brand/Product Identity */}
        <div className="flex h-12 min-w-0 items-center gap-2.5 pl-4 sm:pl-6 lg:h-auto lg:shrink-0 lg:pl-0">
          <span className="truncate text-sm font-bold uppercase tracking-tight text-ink">{productName}</span>
          <span className="hidden text-border-strong lg:inline-block">|</span>
          <span className="hidden text-xs font-semibold uppercase tracking-wider text-orange-text lg:inline-block">
            {subtitle}
          </span>
        </div>

        {/* Anchor Links */}
        <nav aria-label={navigationLabel} className="no-scrollbar col-span-2 row-start-2 flex h-11 w-full items-center gap-1 overflow-x-auto whitespace-nowrap border-t border-border px-1 text-xs font-medium text-foreground-muted sm:gap-2 sm:px-3 lg:col-span-1 lg:row-start-auto lg:h-auto lg:border-t-0 lg:px-2 lg:py-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-2.5 py-2 outline-none transition hover:bg-surface-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action CTA */}
        <div className="col-start-2 row-start-1 shrink-0 px-4 sm:pr-6 lg:col-start-auto lg:row-start-auto lg:pl-2 lg:pr-0">
          <TrackedButton
            href={buildProductDemoHref(locale, FEATURED_PRODUCT, { source: 'product_nav' })}
            variant="primary"
            className="text-xs px-3.5 py-2 rounded-lg"
            eventName="zaiko_demo_cta"
            properties={{
              locale,
              product: FEATURED_PRODUCT.analyticsProduct,
              source: 'product_nav'
            }}
          >
            {requestDemoLabel}
          </TrackedButton>
        </div>
      </div>
    </div>
  );
}
