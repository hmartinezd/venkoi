'use client';

import { Button } from '@/components/ui/Button';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';

interface ZaikoProductNavProps {
  locale: Locale;
  productName: string;
  subtitle: string;
  overviewLabel: string;
  inventoryLabel: string;
  purchasesLabel: string;
  activityLabel: string;
  costsLabel: string;
  requestDemoLabel: string;
}

export function ZaikoProductNav({
  locale,
  productName,
  subtitle,
  overviewLabel,
  inventoryLabel,
  purchasesLabel,
  activityLabel,
  costsLabel,
  requestDemoLabel
}: ZaikoProductNavProps) {
  const navItems = [
    { label: overviewLabel, href: '#overview' },
    { label: inventoryLabel, href: '#inventory' },
    { label: purchasesLabel, href: '#purchases' },
    { label: activityLabel, href: '#activity' },
    { label: costsLabel, href: '#costs' },
    { label: locale === 'es' ? 'Acceso Anticipado' : 'Early Access', href: '#early-access' },
  ];

  return (
    <div className="sticky top-[72px] z-40 border-b border-border bg-surface/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        {/* Brand/Product Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-sm font-bold tracking-tight text-ink uppercase">{productName}</span>
          <span className="hidden sm:inline-block text-border-strong">|</span>
          <span className="hidden sm:inline-block text-xs font-semibold tracking-wider text-orange uppercase">
            {subtitle}
          </span>
        </div>

        {/* Anchor Links */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar text-xs font-medium text-foreground-muted">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-2.5 py-1.5 rounded-lg whitespace-nowrap transition hover:text-ink hover:bg-surface-muted"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action CTA */}
        <div className="shrink-0 pl-2">
          <Button
            href={getLocalizedPath('demo', locale) + '?product=zaiko'}
            variant="primary"
            className="text-xs px-3.5 py-2 rounded-lg"
          >
            {requestDemoLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
