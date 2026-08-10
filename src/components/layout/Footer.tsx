'use client';

import { LocalizedLink } from '@/i18n/navigation';
import { internalRoutes } from '@/i18n/routing';
import { type Locale } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

export function Footer({ locale, productName }: { locale: Locale; productName: string }) {
  const tFooter = useTranslations('footer');
  const tNav = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface py-14 text-sm text-foreground-muted">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 sm:px-6 lg:px-8 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <LocalizedLink href={internalRoutes.home} locale={locale} className="inline-block focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-lg outline-none">
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
                  className="transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm outline-none"
                >
                  {productName}
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
                  className="transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm outline-none"
                >
                  {tNav('about')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  href={internalRoutes.contact}
                  locale={locale}
                  className="transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm outline-none"
                >
                  {tNav('contact')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  href={internalRoutes.insights}
                  locale={locale}
                  className="transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm outline-none"
                >
                  {tNav('insights')}
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
                  className="transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm outline-none"
                >
                  {tNav('services')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  href={internalRoutes.servicesMobile}
                  locale={locale}
                  className="transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm outline-none"
                >
                  {tNav('mobileApplications')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  href={internalRoutes.servicesWeb}
                  locale={locale}
                  className="transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm outline-none"
                >
                  {tNav('webApplications')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  href={internalRoutes.demo}
                  locale={locale}
                  className="transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm outline-none"
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
