'use client';

import { useEffect, useState, useRef } from 'react';
import { LocalizedLink, usePathname } from '@/i18n/navigation';
import { internalRoutes, getRouteKeyFromPath, getLocalizedPath } from '@/i18n/routing';
import { localeLabels, locales, type Locale } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

function LanguageSwitcher({ locale, pathname }: { locale: Locale; pathname: string }) {
  const routeKey = getRouteKeyFromPath(pathname);
  const currentPath = internalRoutes[routeKey];

  return (
    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider">
      {locales.map((localeKey, index) => (
        <span key={localeKey} className="flex items-center gap-2">
          <LocalizedLink
            href={currentPath}
            locale={localeKey}
            className={cn(
              'transition-colors py-1 px-1.5 rounded hover:text-ink',
              localeKey === locale
                ? 'text-ink font-bold border-b-2 border-orange'
                : 'text-foreground-muted'
            )}
          >
            {localeLabels[localeKey]}
          </LocalizedLink>
          {index < locales.length - 1 ? <span className="text-border-strong">|</span> : null}
        </span>
      ))}
    </div>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tNav = useTranslations('navigation');
  const tHeader = useTranslations('header');
  const tCommon = useTranslations('common');

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
        setDropdownOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
          <BrandLogo className="text-ink" />
        </LocalizedLink>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {/* Products Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setDropdownOpen((prev) => !prev);
                }
              }}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition hover:text-orange focus:outline-hidden"
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
              <div className="absolute left-0 mt-3 w-72 rounded-2xl border border-border bg-surface p-3 shadow-card transition-all">
                <LocalizedLink
                  href={internalRoutes.productsZaiko}
                  locale={locale}
                  onClick={() => setDropdownOpen(false)}
                  className="group flex flex-col rounded-xl p-3 hover:bg-surface-muted transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink group-hover:text-orange">
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
            href={internalRoutes.customSoftware}
            locale={locale}
            className="text-sm font-medium text-ink transition hover:text-orange"
          >
            {tNav('customSoftware')}
          </LocalizedLink>

          <LocalizedLink
            href={internalRoutes.about}
            locale={locale}
            className="text-sm font-medium text-ink transition hover:text-orange"
          >
            {tNav('about')}
          </LocalizedLink>

          <LocalizedLink
            href={internalRoutes.contact}
            locale={locale}
            className="text-sm font-medium text-ink transition hover:text-orange"
          >
            {tNav('contact')}
          </LocalizedLink>
        </nav>

        {/* Desktop CTA & Language Switcher */}
        <div className="hidden items-center gap-6 md:flex">
          <LanguageSwitcher locale={locale} pathname={pathname} />
          <Button href={getLocalizedPath('demo', locale)} variant="primary" className="text-xs">
            {tCommon('demo')}
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher locale={locale} pathname={pathname} />
          <button
            type="button"
            aria-label={menuOpen ? tHeader('closeMenu') : tHeader('openMenu')}
            aria-expanded={menuOpen}
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
        <div className="absolute top-[72px] inset-x-0 border-b border-border bg-surface/98 p-6 backdrop-blur-lg md:hidden shadow-lg animate-in slide-in-from-top-2">
          <nav className="grid gap-3 text-base font-medium">
            <LocalizedLink
              href={internalRoutes.productsZaiko}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-ink transition hover:bg-surface-muted"
            >
              <span>{tNav('zaiko')}</span>
              <span className="text-xs text-foreground-muted">{tNav('zaikoSubtitle')}</span>
            </LocalizedLink>
            <LocalizedLink
              href={internalRoutes.customSoftware}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-ink transition hover:bg-surface-muted"
            >
              {tNav('customSoftware')}
            </LocalizedLink>
            <LocalizedLink
              href={internalRoutes.about}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-ink transition hover:bg-surface-muted"
            >
              {tNav('about')}
            </LocalizedLink>
            <LocalizedLink
              href={internalRoutes.contact}
              locale={locale}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-ink transition hover:bg-surface-muted"
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

