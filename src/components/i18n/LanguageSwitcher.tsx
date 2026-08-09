'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LocalizedLink, usePathname } from '@/i18n/navigation';
import { internalRoutes, getRouteKeyFromPath, type RouteKey } from '@/i18n/routing';
import { localeLabels, locales, type Locale } from '@/i18n/config';
import { trackCustomEvent } from '@/lib/analytics';
import { getSafeLocalizedIntentQuery } from '@/lib/navigation-intent';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  locale: Locale;
  variant?: 'header' | 'footer' | 'mobile';
  className?: string;
}

function LanguageSwitcherContent({ locale, variant = 'header', className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = getRouteKeyFromPath(pathname);
  const currentPath = internalRoutes[routeKey];

  const containerClasses = cn(
    'flex items-center',
    variant === 'header' && 'gap-2 text-xs font-semibold tracking-wider',
    variant === 'footer' && 'gap-3 text-xs',
    variant === 'mobile' && 'gap-2 text-xs font-semibold tracking-wider',
    className
  );

  return (
    <div className={containerClasses}>
      {locales.map((localeKey, index) => {
        const safeParams = getSafeLocalizedIntentQuery(routeKey, searchParams);
        const query = Object.fromEntries(safeParams.entries());
        const isActive = localeKey === locale;

        return (
          <span key={localeKey} className="flex items-center gap-2">
            <LocalizedLink
              href={{ pathname: currentPath, query }}
              locale={localeKey}
              onClick={() => {
                if (localeKey !== locale) {
                  trackCustomEvent('language_switch', {
                    locale: localeKey,
                    source: variant
                  });
                }
              }}
              className={cn(
                'transition-colors',
                variant === 'header' && cn(
                  'py-1 px-1.5 rounded hover:text-ink',
                  isActive ? 'text-ink font-bold border-b-2 border-orange' : 'text-foreground-muted'
                ),
                variant === 'footer' && cn(
                  'hover:text-ink',
                  isActive ? 'font-semibold text-ink' : 'text-foreground-muted'
                ),
                variant === 'mobile' && cn(
                  'py-1 px-1.5 rounded hover:text-ink',
                  isActive ? 'text-ink font-bold border-b-2 border-orange' : 'text-foreground-muted'
                )
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {localeLabels[localeKey]}
            </LocalizedLink>
            {index < locales.length - 1 ? (
              <span className={cn(
                'text-border-strong',
                variant === 'footer' && 'text-foreground-muted/30'
              )}>|</span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  const fallbackClasses = cn(
    'animate-pulse bg-surface-muted rounded',
    props.variant === 'header' && 'h-6 w-20',
    props.variant === 'footer' && 'h-4 w-24',
    props.variant === 'mobile' && 'h-6 w-20'
  );

  return (
    <Suspense fallback={<div className={fallbackClasses} />}>
      <LanguageSwitcherContent {...props} />
    </Suspense>
  );
}
