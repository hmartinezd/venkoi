'use client';

import { LocalizedLink } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { type Locale } from '@/i18n/config';
import { internalRoutes, type RouteKey } from '@/i18n/routing';

interface BreadcrumbItem {
  labelKey: string;
  routeKey?: RouteKey;
  isCurrent?: boolean;
}

interface BreadcrumbsProps {
  locale: Locale;
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ locale, items }: BreadcrumbsProps) {
  const t = useTranslations('breadcrumbs');

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-widest text-foreground-muted uppercase">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-border-strong" aria-hidden="true">
                /
              </span>
            )}
            {item.isCurrent || !item.routeKey ? (
              <span className="text-ink" aria-current="page">
                {t(item.labelKey)}
              </span>
            ) : (
              <LocalizedLink
                href={internalRoutes[item.routeKey]}
                locale={locale}
                className="transition-colors hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm"
              >
                {t(item.labelKey)}
              </LocalizedLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
