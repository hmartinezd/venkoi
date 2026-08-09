'use client';

import { useEffect, useState, useRef } from 'react';
import { LocalizedLink, usePathname } from '@/i18n/navigation';
import { internalRoutes, getRouteKeyFromPath, getLocalizedPath, type Locale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const routeKey = getRouteKeyFromPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  const tNav = useTranslations('navigation');
  const tHeader = useTranslations('header');
  const tCommon = useTranslations('common');

  const isProductsActive = routeKey === 'productsZaiko';
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
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (dropdownOpen) {
          setDropdownOpen(false);
          dropdownTriggerRef.current?.focus();
        }
        if (menuOpen) {
          setMenuOpen(false);
          mobileTriggerRef.current?.focus();
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen, menuOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-200 h-[72px] flex items-center',
        scrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-border shadow-xs'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <LocalizedLink href={internalRoutes.home} locale={locale} className="flex items-center gap-2">
          <BrandLogo variant="dark" size="header" priority />
        </LocalizedLink>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {/* Products Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              ref={dropdownTriggerRef}
              onClick={() => setDropdownOpen((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setDropdownOpen((prev) => !prev);
                }
              }}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-controls="products-navigation"
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-medium transition hover:text-orange focus:outline-hidden',
                isProductsActive ? 'text-orange' : 'text-ink'
              )}
            >
              <span>{tHeader('productsDropdown')}</span>
              <svg
                className={cn('h-4 w-4 transition-transform duration-200', dropdownOpen && 'rotate-180')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                id="products-navigation"
                className="absolute left-0 mt-3 w-72 rounded-2xl border border-border bg-surface p-3 shadow-card transition-all"
              >
                <LocalizedLink
                  href={internalRoutes.productsZaiko}
                  locale={locale}
                  onClick={() => setDropdownOpen(false)}
                  aria-current={routeKey === 'productsZaiko' ? 'page' : undefined}
                  className={cn(
                    'group flex flex-col rounded-xl p-3 transition',
                    routeKey === 'productsZaiko' ? 'bg-surface-muted' : 'hover:bg-surface-muted'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'text-sm font-semibold group-hover:text-orange',
                      routeKey === 'productsZaiko' ? 'text-orange' : 'text-ink'
                    )}>
                      {tNav('zaiko')}
                    </span>
                    <span className="rounded-md bg-orange-subtle px-2 py-0.5 text-[10px] font-bold text-orange uppercase tracking-wider">
                      {tHeader('productBadge')}
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-foreground-muted">
                    {tNav('zaikoSubtitle')}
                  </span>
                </LocalizedLink>
              </div>
            )}
          </div>

          <LocalizedLink
            href={internalRoutes.services}
            locale={locale}
            aria-current={isServicesActive ? 'page' : undefined}
            className={cn(
              'text-sm font-medium transition hover:text-orange',
              isServicesActive ? 'text-orange' : 'text-ink'
            )}
          >
            {tNav('services')}
          </LocalizedLink>

          <LocalizedLink
            href={internalRoutes.about}
            locale={locale}
            aria-current={isAboutActive ? 'page' : undefined}
            className={cn(
              'text-sm font-medium transition hover:text-orange',
              isAboutActive ? 'text-orange' : 'text-ink'
            )}
          >
            {tNav('about')}
          </LocalizedLink>

          <LocalizedLink
            href={internalRoutes.contact}
            locale={locale}
            aria-current={isContactActive ? 'page' : undefined}
            className={cn(
              'text-sm font-medium transition hover:text-orange',
              isContactActive ? 'text-orange' : 'text-ink'
            )}
          >
            {tNav('contact')}
          </LocalizedLink>
        </nav>

        {/* Desktop CTA & Language Switcher */}
        <div className="hidden items-center gap-6 md:flex">
          <LanguageSwitcher locale={locale} variant="header" />
          <Button href={getLocalizedPath('demo', locale)} variant="primary" className="text-xs">
            {tCommon('demo')}
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher locale={locale} variant="mobile" />
          <button
            type="button"
            ref={mobileTriggerRef}
            aria-label={menuOpen ? tHeader('closeMenu') : tHeader('openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-ink transition hover:bg-surface-muted"
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
          className="absolute top-[72px] inset-x-0 border-b border-border bg-surface/98 p-6 backdrop-blur-lg md:hidden shadow-lg animate-in slide-in-from-top-2"
        >
          <nav className="grid gap-3 text-base font-medium">
            <LocalizedLink
              href={internalRoutes.productsZaiko}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              aria-current={routeKey === 'productsZaiko' ? 'page' : undefined}
              className={cn(
                'flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-surface-muted',
                routeKey === 'productsZaiko' ? 'text-orange' : 'text-ink'
              )}
            >
              <span>{tNav('zaiko')}</span>
              <span className="text-xs text-foreground-muted">{tNav('zaikoSubtitle')}</span>
            </LocalizedLink>
            <LocalizedLink
              href={internalRoutes.services}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              aria-current={isServicesActive ? 'page' : undefined}
              className={cn(
                'block rounded-xl px-4 py-3 transition hover:bg-surface-muted',
                isServicesActive ? 'text-orange' : 'text-ink'
              )}
            >
              {tNav('services')}
            </LocalizedLink>
            <LocalizedLink
              href={internalRoutes.about}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              aria-current={isAboutActive ? 'page' : undefined}
              className={cn(
                'block rounded-xl px-4 py-3 transition hover:bg-surface-muted',
                isAboutActive ? 'text-orange' : 'text-ink'
              )}
            >
              {tNav('about')}
            </LocalizedLink>
            <LocalizedLink
              href={internalRoutes.contact}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              aria-current={isContactActive ? 'page' : undefined}
              className={cn(
                'block rounded-xl px-4 py-3 transition hover:bg-surface-muted',
                isContactActive ? 'text-orange' : 'text-ink'
              )}
            >
              {tNav('contact')}
            </LocalizedLink>
          </nav>

          <div className="mt-6 pt-4 border-t border-border">
            <Button
              href={getLocalizedPath('demo', locale)}
              variant="primary"
              className="w-full justify-center"
              onClick={() => setMenuOpen(false)}
            >
              {tCommon('demo')}
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

