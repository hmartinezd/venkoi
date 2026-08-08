import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { DemoRequestForm } from '@/components/forms/DemoRequestForm';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import { isDemoEnabledProduct } from '@/lib/products';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
  const t = await getTranslations({ locale: currentLocale, namespace: 'demoPage' });
  const seo = await getTranslations({ locale: currentLocale, namespace: 'seo' });
  return createMetadata({
    title: `${t('eyebrow')} | ${seo('title')}`,
    description: t('body'),
    routeKey: 'demo',
    locale: currentLocale,
    noIndex: true
  });
}

export default async function DemoPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { product, interest } = await searchParams;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('demoPage');

  const selectedProduct =
    typeof product === 'string' && isDemoEnabledProduct(product) ? product : 'zaiko';
  const selectedInterest = typeof interest === 'string' ? interest : '';

  const isZaiko = selectedProduct === 'zaiko';
  const isEarlyAccess = selectedInterest === 'early-access';

  const eyebrowText = isZaiko ? t('zaiko.eyebrow') : t('eyebrow');
  const headingText = isZaiko ? t('zaiko.heading') : t('heading');
  const bodyText = isZaiko ? t('zaiko.body') : t('body');
  const badgeText = isEarlyAccess ? t('zaiko.earlyAccessBadge') : t('badgeText');


  return (
    <Section variant="light" className="pt-14 pb-20 md:pt-20 md:pb-28">
      <Container className="max-w-4xl space-y-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
              {eyebrowText}
            </span>
            <span className="inline-flex items-center rounded-md bg-orange-subtle px-2.5 py-0.5 text-[11px] font-bold text-orange uppercase tracking-wider">
              {isEarlyAccess ? t('zaiko.earlyAccessBadge') : t('badge')}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-tight">
            {headingText}
          </h1>
          <p className="text-lg text-foreground-muted leading-relaxed max-w-2xl">
            {bodyText}
          </p>
        </div>

        {/* Demo Request / Early Access Form Shell */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-card">
          <div className="space-y-2 border-b border-border pb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-ink">
                {isZaiko ? t('zaiko.title') : t('earlyAccessTitle')}
              </h2>
              {isEarlyAccess && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 border border-orange/30 px-3 py-0.5 text-xs font-bold text-orange">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                  {t('zaiko.earlyAccessBadge')}
                </span>
              )}
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed">
              {badgeText}
            </p>
          </div>

          <DemoRequestForm
            locale={currentLocale}
            initialProduct={selectedProduct}
            initialInterest={selectedInterest}
          />
        </div>
      </Container>
    </Section>
  );
}
