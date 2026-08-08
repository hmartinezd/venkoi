import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { internalRoutes } from '@/i18n/routing';
import { LocalizedLink } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

function parseLocale(locale: string): Locale {
  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  notFound();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  const t = await getTranslations({ locale: currentLocale, namespace: 'products' });
  const seo = await getTranslations({ locale: currentLocale, namespace: 'seo' });
  return createMetadata({
    title: `${t('zaikoTitle')} | ${seo('title')}`,
    description: t('zaikoIntro'),
    routeKey: 'productsZaiko',
    locale: currentLocale
  });
}

export default async function ZaikoPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('products');

  return (
    <Section className="pt-20 pb-24">
      <Container className="max-w-4xl space-y-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange">{t('zaikoTitle')}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{t('zaikoTitle')}</h1>
          <p className="text-lg leading-8 text-foreground-muted">{t('zaikoIntro')}</p>
        </div>
        <div className="rounded-[28px] border border-border bg-surface p-10">
          <p className="text-base leading-8 text-foreground-muted">{t('placeholder')}</p>
          <div className="mt-8 inline-flex rounded-[14px] border border-border bg-background px-5 py-3 text-sm font-semibold text-ink">
            <LocalizedLink href={internalRoutes.demo} locale={currentLocale} className="transition hover:text-orange">
              {t('placeholder')}
            </LocalizedLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}


