import { footerNavigation } from '@/i18n/navigation';
import { getLocalizedPath } from '@/i18n/routing';
import { localeLabels, type Locale } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface py-12 text-sm text-foreground-muted">
      <div className="mx-auto grid max-w-screen-2xl gap-12 px-4 sm:px-6 lg:px-8 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <p className="font-semibold text-ink">VENKOI</p>
          <p>{t('footer.title')}</p>
          <p>{t('common.location')}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <p className="font-semibold text-ink">{t('footer.sectionProducts')}</p>
            {footerNavigation.products.map((item) => (
              <Link key={item.id} href={getLocalizedPath(item.routeKey, locale)} locale={false} className="block transition hover:text-ink">
                {t(`navigation.${item.labelKey}`)}
              </Link>
            ))}
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-ink">{t('footer.sectionCompany')}</p>
            {footerNavigation.company.map((item) => (
              <Link key={item.id} href={getLocalizedPath(item.routeKey, locale)} locale={false} className="block transition hover:text-ink">
                {t(`navigation.${item.labelKey}`)}
              </Link>
            ))}
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-ink">{t('footer.sectionWorkWithUs')}</p>
            {footerNavigation.workWithUs.map((item) => (
              <Link key={item.id} href={getLocalizedPath(item.routeKey, locale)} locale={false} className="block transition hover:text-ink">
                {t(`navigation.${item.labelKey}`)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-screen-2xl border-t border-border px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span>{localeLabels[locale]}</span>
            <span>{t('common.locationShort')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" disabled className="cursor-not-allowed text-foreground-muted">
              {t('common.privacy')}
            </button>
            <button type="button" disabled className="cursor-not-allowed text-foreground-muted">
              {t('common.terms')}
            </button>
          </div>
          <div>{t('common.copyright', { year: currentYear })}</div>
        </div>
      </div>
    </footer>
  );
}
