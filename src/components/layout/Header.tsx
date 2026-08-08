'use client';

import { useEffect, useState } from 'react';
import { headerNavigation, type NavigationItem, LocalizedLink, usePathname } from '@/i18n/navigation';
import { internalRoutes, getRouteKeyFromPath } from '@/i18n/routing';
import { localeLabels, locales, type Locale } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const navLinks = headerNavigation;

function LanguageSwitcher({ locale, pathname }: { locale: Locale; pathname: string }) {
  const t = useTranslations('header');
  const routeKey = getRouteKeyFromPath(pathname);
  const currentPath = internalRoutes[routeKey];

  return (
    <div className="flex items-center gap-3 text-sm font-semibold">
      <span className="sr-only">{t('language')}</span>
      {locales.map((localeKey) => (
        <LocalizedLink
          key={localeKey}
          href={currentPath}
          locale={localeKey}
          className={cn(
            'transition-colors',
            localeKey === locale ? 'text-ink' : 'text-foreground-muted hover:text-ink'
          )}
        >
          {localeLabels[localeKey]}
        </LocalizedLink>
      ))}
    </div>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('navigation');
  const common = useTranslations('common');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  function getLink(item: NavigationItem) {
    return internalRoutes[item.routeKey];
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition duration-300',
        scrolled ? 'bg-background/95 backdrop-blur-sm border-border' : 'bg-transparent border-transparent'
      )}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <LocalizedLink href={internalRoutes.home} locale={locale} className="flex items-center gap-2">
          <BrandLogo className="text-ink" />
        </LocalizedLink>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <LocalizedLink
              key={item.id}
              href={getLink(item)}
              locale={locale}
              className="text-sm font-medium text-ink transition hover:text-orange"
            >
              {t(item.labelKey)}
            </LocalizedLink>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <LanguageSwitcher locale={locale} pathname={pathname} />
          <LocalizedLink href={internalRoutes.demo} locale={locale} className="hidden md:inline-block">
            <Button variant="primary">{common('demo')}</Button>
          </LocalizedLink>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-ink md:hidden"
        >
          <span className="text-xl">{menuOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-border bg-background/95 p-6 md:hidden">
          <div className="flex items-center justify-between gap-2">
            <LanguageSwitcher locale={locale} pathname={pathname} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-ink"
            >
              ×
            </button>
          </div>
          <nav className="mt-6 grid gap-3 text-base font-medium">
            {navLinks.map((item) => (
              <LocalizedLink
                key={item.id}
                href={getLink(item)}
                locale={locale}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-ink transition hover:bg-surface-muted"
              >
                {t(item.labelKey)}
              </LocalizedLink>
            ))}
          </nav>
          <div className="mt-6">
            <LocalizedLink href={internalRoutes.demo} locale={locale} onClick={() => setMenuOpen(false)}>
              <Button className="w-full">{common('demo')}</Button>
            </LocalizedLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
