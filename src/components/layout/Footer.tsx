import { LocalizedLink } from '@/i18n/navigation';
import { internalRoutes } from '@/i18n/routing';
import { type Locale } from '@/i18n/config';
import { getTranslations } from 'next-intl/server';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { DirectContactChannels } from '@/components/contact/DirectContactChannels';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';
import { TrackedButton } from '@/components/analytics/TrackedButton';

export async function Footer({ locale, productName }: { locale: Locale; productName: string }) {
  const tFooter = await getTranslations('footer');
  const tNav = await getTranslations('navigation');
  const tCommon = await getTranslations('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface py-12 text-sm text-foreground-muted">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 sm:px-6 lg:px-8 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <LocalizedLink href={internalRoutes.home} locale={locale} className="inline-block focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-lg outline-none">
            <BrandLogo variant="dark" size="footer" />
          </LocalizedLink>
          <p className="text-base text-ink font-medium">{tFooter('tagline')}</p>
          <p className="text-xs text-foreground-muted">{tFooter('locationText')}</p>
          <DirectContactChannels
            variant="compact"
            whatsappMessage={tFooter('contact.whatsappMessage')}
            whatsappLabel={tFooter('contact.whatsappLabel')}
            whatsappAriaLabel={tFooter('contact.whatsappAriaLabel')}
            emailLabel={tFooter('contact.emailLabel')}
            emailAriaLabel={tFooter('contact.emailAriaLabel')}
            emailSubject={tFooter('contact.emailSubject')}
          />
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
                  className="font-normal text-foreground-muted transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm outline-none"
                >
                  {productName}
                </LocalizedLink>
              </li>
              <li>
                <TrackedButton
                  href={buildProductDemoHref(locale, FEATURED_PRODUCT, { source: 'footer' })}
                  variant="text"
                  eventName="zaiko_demo_cta"
                  properties={{ locale, product: FEATURED_PRODUCT.analyticsProduct, source: 'footer' }}
                  className="font-normal text-foreground-muted transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm outline-none"
                >
                  {tCommon('demo')}
                </TrackedButton>
              </li>
              {FEATURED_PRODUCT.earlyAccess.enabled ? (
                <li>
                  <TrackedButton
                    href={buildProductDemoHref(locale, FEATURED_PRODUCT, { interest: 'early-access', source: 'footer' })}
                    variant="text"
                    eventName="zaiko_early_access_cta"
                    properties={{ locale, product: FEATURED_PRODUCT.analyticsProduct, source: 'footer', earlyAccess: true }}
                    className="font-normal text-foreground-muted transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm outline-none"
                  >
                    {tFooter('earlyAccess')}
                  </TrackedButton>
                </li>
              ) : null}
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
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1240px] border-t border-border px-4 pt-7 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
          <LanguageSwitcher locale={locale} variant="footer" />

          <div className="flex items-center gap-4">
            <LocalizedLink
              href={internalRoutes.privacy}
              locale={locale}
              className="rounded-sm outline-none transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4"
            >
              {tCommon('privacy')}
            </LocalizedLink>
            <span>·</span>
            <LocalizedLink
              href={internalRoutes.terms}
              locale={locale}
              className="rounded-sm outline-none transition hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4"
            >
              {tCommon('terms')}
            </LocalizedLink>
          </div>

          <div>{tCommon('copyright', { year: currentYear })}</div>
        </div>
      </div>
    </footer>
  );
}
