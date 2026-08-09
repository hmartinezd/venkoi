'use client';

import { LocalizedLink } from '@/i18n/navigation';
import { internalRoutes, type Locale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

export function Footer({ locale }: { locale: Locale }) {
  const tFooter = useTranslations('footer');
  const tNav = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface py-14 text-sm text-foreground-muted">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 sm:px-6 lg:px-8 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <LocalizedLink href={internalRoutes.home} locale={locale} className="inline-block">
            <BrandLogo variant="dark" size="footer" />
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
                  href={internalRoutes.services}
                  locale={locale}
                  className="transition hover:text-ink"
                >
                  {tNav('services')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  href={internalRoutes.servicesMobile}
                  locale={locale}
                  className="transition hover:text-ink"
                >
                  {tNav('mobileApplications')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  href={internalRoutes.servicesWeb}
                  locale={locale}
                  className="transition hover:text-ink"
                >
                  {tNav('webApplications')}
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
          <LanguageSwitcher locale={locale} variant="footer" />

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

