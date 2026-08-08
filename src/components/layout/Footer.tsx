'use client';

import { LocalizedLink, usePathname } from '@/i18n/navigation';
import { internalRoutes, getRouteKeyFromPath } from '@/i18n/routing';
import { localeLabels, locales, type Locale } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/brand/BrandLogo';

export function Footer({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const tFooter = useTranslations('footer');
  const tNav = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const currentYear = new Date().getFullYear();

  const routeKey = getRouteKeyFromPath(pathname);
  const currentPath = internalRoutes[routeKey];

  return (
    <footer className="border-t border-border bg-surface py-14 text-sm text-foreground-muted">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 sm:px-6 lg:px-8 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <LocalizedLink href={internalRoutes.home} locale={locale} className="inline-block">
            <BrandLogo variant="dark" />
          </LocalizedLink>
          <p className="text-base text-ink font-medium">{tFooter('tagline')}</p>
          <p className="text-xs text-foreground-muted">{tFooter('locationText')}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <p className="font-semibold text-ink uppercase text-xs tracking-wider">
              {tFooter('sectionProducts')}
            </p>
            <ul className="space-y-2">
              <li>
                <LocalizedLink
                  href={internalRoutes.productsZaiko}
                  locale={locale}
                  className="transition hover:text-ink"
                >
                  {tNav('zaiko')}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-ink uppercase text-xs tracking-wider">
              {tFooter('sectionCompany')}
            </p>
            <ul className="space-y-2">
              <li>
                <LocalizedLink
                  href={internalRoutes.about}
                  locale={locale}
                  className="transition hover:text-ink"
                >
                  {tNav('about')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  href={internalRoutes.contact}
                  locale={locale}
                  className="transition hover:text-ink"
                >
                  {tNav('contact')}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-ink uppercase text-xs tracking-wider">
              {tFooter('sectionWorkWithUs')}
            </p>
            <ul className="space-y-2">
              <li>
                <LocalizedLink
                  href={internalRoutes.customSoftware}
                  locale={locale}
                  className="transition hover:text-ink"
                >
                  {tNav('customSoftware')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  href={internalRoutes.demo}
                  locale={locale}
                  className="transition hover:text-ink"
                >
                  {tCommon('demo')}
                </LocalizedLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1240px] border-t border-border px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {locales.map((localeKey, idx) => (
              <span key={localeKey} className="flex items-center gap-3">
                <LocalizedLink
                  href={currentPath}
                  locale={localeKey}
                  className={`transition hover:text-ink ${localeKey === locale ? 'font-semibold text-ink' : ''}`}
                >
                  {localeLabels[localeKey]}
                </LocalizedLink>
                {idx < locales.length - 1 ? <span>|</span> : null}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="cursor-default text-foreground-muted">{tCommon('privacy')}</span>
            <span>·</span>
            <span className="cursor-default text-foreground-muted">{tCommon('terms')}</span>
          </div>

          <div>{tCommon('copyright', { year: currentYear })}</div>
        </div>
      </div>
    </footer>
  );
}

