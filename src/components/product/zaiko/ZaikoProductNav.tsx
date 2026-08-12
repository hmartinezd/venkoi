import { TrackedButton } from '@/components/analytics/TrackedButton';
import type { Locale } from '@/i18n/config';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';

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
}

export function ZaikoProductNav({
  locale,
  productName,
  subtitle,
  overviewLabel,
  invoiceLabel, inventoryLabel, foodCostLabel, countsLabel, ownerLabel,
  requestDemoLabel,
  navigationLabel
}: ZaikoProductNavProps) {
  const navItems = [
    { label: overviewLabel, href: '#overview' },
    { label: invoiceLabel, href: '#invoice-capture' },
    { label: inventoryLabel, href: '#inventory' },
    { label: foodCostLabel, href: '#food-cost' },
    { label: countsLabel, href: '#counts-reorder' },
    { label: ownerLabel, href: '#owner-view' }
  ];

  return (
    <div className="sticky top-[72px] z-40 border-b border-border bg-surface/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        {/* Brand/Product Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-sm font-bold tracking-tight text-ink uppercase">{productName}</span>
          <span className="hidden sm:inline-block text-border-strong">|</span>
          <span className="hidden sm:inline-block text-xs font-semibold tracking-wider text-orange-text uppercase">
            {subtitle}
          </span>
        </div>

        {/* Anchor Links */}
        <nav aria-label={navigationLabel} className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar text-xs font-medium text-foreground-muted">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-2.5 py-1.5 rounded-lg whitespace-nowrap outline-none transition hover:text-ink hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action CTA */}
        <div className="shrink-0 pl-2">
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
