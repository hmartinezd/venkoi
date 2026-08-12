'use client';

import { useEffect, useState, useRef } from 'react';
import { LocalizedLink, usePathname } from '@/i18n/navigation';
import { internalRoutes, getRouteKeyFromPath } from '@/i18n/routing';
import { type Locale } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';
import { trackCustomEvent } from '@/lib/analytics';

export function Header({ locale, productName }: { locale: Locale; productName: string }) {
  const pathname = usePathname();
  const routeKey = getRouteKeyFromPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  const tNav = useTranslations('navigation');
  const tHeader = useTranslations('header');
  const tCommon = useTranslations('common');

  const isProductsActive = routeKey === 'productsZaiko';
  const isInsightsActive = [
    'insights',
    'insightRestaurantInventory',
    'insightStartSoftwareProject',
    'insightWebsiteOrWebApp'
  ].includes(routeKey);
  const isServicesActive = ['services', 'servicesMobile', 'servicesWeb'].includes(routeKey);
  const isAboutActive = routeKey === 'about';
  const isContactActive = routeKey === 'contact';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const firstLink = document.querySelector('#mobile-navigation a') as HTMLAnchorElement;
      firstLink?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setMenuOpen(false);
    };
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (menuOpen) {
          setMenuOpen(false);
          mobileTriggerRef.current?.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-200 h-[72px] flex items-center',
        scrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-border shadow-xs'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-orange focus:px-4 focus:py-2 focus:text-ink focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
      >
        {tCommon('skipToContent')}
      </a>
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <LocalizedLink href={internalRoutes.home} locale={locale} className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4">
          <BrandLogo variant="dark" size="header" priority />
        </LocalizedLink>

        {/* Desktop Nav */}
        <nav aria-label={tHeader('mainNavigation')} className="hidden items-center gap-5 lg:flex xl:gap-7">
          <LocalizedLink
            href={internalRoutes.productsZaiko}
            locale={locale}
            aria-current={isProductsActive ? 'page' : undefined}
            className={cn(
              'text-sm font-medium transition hover:text-orange-text focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-8 rounded-sm',
              isProductsActive ? 'text-orange-text' : 'text-ink'
            )}
          >
            {productName}
          </LocalizedLink>

          <LocalizedLink
            href={internalRoutes.insights}
            locale={locale}
            aria-current={isInsightsActive ? 'page' : undefined}
            className={cn(
              'text-sm font-medium transition hover:text-orange-text focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-8 rounded-sm',
              isInsightsActive ? 'text-orange-text' : 'text-ink'
            )}
          >
            {tNav('insights')}
          </LocalizedLink>

          <LocalizedLink
            href={internalRoutes.about}
            locale={locale}
            aria-current={isAboutActive ? 'page' : undefined}
            className={cn(
              'text-sm font-medium transition hover:text-orange-text focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-8 rounded-sm',
              isAboutActive ? 'text-orange-text' : 'text-ink'
            )}
          >
            {tNav('about')}
          </LocalizedLink>

          <LocalizedLink
            href={internalRoutes.services}
            locale={locale}
            aria-current={isServicesActive ? 'page' : undefined}
            className={cn(
              'text-sm font-medium transition hover:text-orange-text focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-8 rounded-sm',
              isServicesActive ? 'text-orange-text' : 'text-ink'
            )}
          >
            {tNav('services')}
          </LocalizedLink>

          <LocalizedLink
            href={internalRoutes.contact}
            locale={locale}
            aria-current={isContactActive ? 'page' : undefined}
            className={cn(
              'text-sm font-medium transition hover:text-orange-text focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-8 rounded-sm',
              isContactActive ? 'text-orange-text' : 'text-ink'
            )}
          >
            {tNav('contact')}
          </LocalizedLink>
        </nav>

        {/* Desktop CTA & Language Switcher */}
        <div className="hidden items-center gap-4 lg:flex xl:gap-6">
          <LanguageSwitcher locale={locale} variant="header" />
          <Button
            href={buildProductDemoHref(locale, FEATURED_PRODUCT, { source: 'header' })}
            variant="primary"
            className="text-xs"
            onClick={() => trackCustomEvent('zaiko_demo_cta', { locale, product: FEATURED_PRODUCT.analyticsProduct, source: 'header' })}
          >
            {tCommon('demo')}
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher locale={locale} variant="mobile" />
          <button
            type="button"
            ref={mobileTriggerRef}
            aria-label={menuOpen ? tHeader('closeMenu') : tHeader('openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-ink outline-none transition hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="absolute top-[72px] inset-x-0 border-b border-border bg-surface/98 p-6 backdrop-blur-lg lg:hidden shadow-lg animate-in slide-in-from-top-2"
        >
          <nav aria-label={tHeader('mainNavigation')} className="grid gap-3 text-base font-medium">
            <LocalizedLink
              href={internalRoutes.productsZaiko}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              aria-current={routeKey === 'productsZaiko' ? 'page' : undefined}
              className={cn(
                'flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset',
                routeKey === 'productsZaiko' ? 'text-orange-text' : 'text-ink'
              )}
            >
              <span className="break-words">{productName}</span>
              <span className="text-xs text-foreground-muted">{tNav('zaikoSubtitle')}</span>
            </LocalizedLink>
            <LocalizedLink
              href={internalRoutes.insights}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              aria-current={isInsightsActive ? 'page' : undefined}
              className={cn(
                'block rounded-xl px-4 py-3 transition hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset',
                isInsightsActive ? 'text-orange-text' : 'text-ink'
              )}
            >
              {tNav('insights')}
            </LocalizedLink>
            <LocalizedLink
              href={internalRoutes.about}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              aria-current={isAboutActive ? 'page' : undefined}
              className={cn(
                'block rounded-xl px-4 py-3 transition hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset',
                isAboutActive ? 'text-orange-text' : 'text-ink'
              )}
            >
              {tNav('about')}
            </LocalizedLink>
            <LocalizedLink
              href={internalRoutes.services}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              aria-current={isServicesActive ? 'page' : undefined}
              className={cn(
                'block rounded-xl px-4 py-3 transition hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset',
                isServicesActive ? 'text-orange-text' : 'text-ink'
              )}
            >
              {tNav('services')}
            </LocalizedLink>
            <LocalizedLink
              href={internalRoutes.contact}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              aria-current={isContactActive ? 'page' : undefined}
              className={cn(
                'block rounded-xl px-4 py-3 transition hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset',
                isContactActive ? 'text-orange-text' : 'text-ink'
              )}
            >
              {tNav('contact')}
            </LocalizedLink>
          </nav>

          <div className="mt-6 pt-4 border-t border-border">
            <Button
              href={buildProductDemoHref(locale, FEATURED_PRODUCT, { source: 'header' })}
              variant="primary"
              className="w-full justify-center"
              onClick={() => {
                trackCustomEvent('zaiko_demo_cta', { locale, product: FEATURED_PRODUCT.analyticsProduct, source: 'header' });
                setMenuOpen(false);
              }}
            >
              {tCommon('demo')}
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
