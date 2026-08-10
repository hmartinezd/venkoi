import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { DemoRequestForm } from '@/components/forms/DemoRequestForm';
import { DirectContactChannels } from '@/components/contact/DirectContactChannels';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import { isDemoEnabledProduct, getDefaultDemoProduct, FEATURED_PRODUCT } from '@/lib/products';
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

  const defaultProduct = getDefaultDemoProduct().slug;
  const hasValidProductContext = typeof product === 'string' && isDemoEnabledProduct(product);
  const selectedProduct = hasValidProductContext ? product : defaultProduct;
  const selectedInterest = typeof interest === 'string' ? interest : '';

  const isZaiko = selectedProduct === 'zaiko';
  const isEarlyAccess = selectedInterest === 'early-access';
  const productProgramValues = {
    productName: FEATURED_PRODUCT.name,
    freeMonths: FEATURED_PRODUCT.earlyAccess.freeMonths
  };

  let eyebrowText = isZaiko ? t('zaiko.eyebrow') : t('eyebrow');
  let headingText = isZaiko ? t('zaiko.heading') : t('heading');
  let bodyText = isZaiko ? t('zaiko.body') : t('body');

  if (isZaiko && isEarlyAccess) {
    eyebrowText = t('earlyAccess.eyebrow', productProgramValues);
    headingText = t('earlyAccess.heading', productProgramValues);
    bodyText = t('earlyAccess.body', productProgramValues);
  }

  const formTitle = isEarlyAccess
    ? t('earlyAccess.formTitle')
    : (isZaiko ? t('zaiko.title') : t('earlyAccessTitle'));

  const formDesc = isEarlyAccess
    ? t('earlyAccess.badge')
    : (isZaiko ? t('zaiko.formDescription') : t('badgeText', productProgramValues));

  return (
    <Section variant="light" className="pt-14 pb-20 md:pt-20 md:pb-28">
      <Container className="max-w-4xl space-y-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
              {eyebrowText}
            </span>
            {isEarlyAccess && (
              <span className="inline-flex items-center rounded-md bg-orange/10 px-2 py-0.5 text-[10px] font-bold text-orange uppercase tracking-wider border border-orange/20">
                {t('badge')}
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-tight">
            {headingText}
          </h1>
          <p className="text-lg text-foreground-muted leading-relaxed max-w-2xl">
            {bodyText}
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-bold text-ink">{t('direct.heading')}</h2>
            <p className="text-sm text-foreground-muted">{t('direct.body')}</p>
          </div>
          <DirectContactChannels
            whatsappMessage={hasValidProductContext
              ? t('direct.productMessage', { productName: FEATURED_PRODUCT.name })
              : t('direct.genericMessage')}
            whatsappLabel={t('direct.whatsappLabel')}
            whatsappAriaLabel={t('direct.whatsappAriaLabel')}
            showEmail={false}
            className="shrink-0"
          />
        </div>

        {/* Demo Request / Early Access Form Shell */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-card">
          <div className="space-y-2 border-b border-border pb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-ink">
                {formTitle}
              </h2>
              {isEarlyAccess && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 border border-orange/30 px-3 py-0.5 text-xs font-bold text-orange">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                  {t('badge')}
                </span>
              )}
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed">
              {formDesc}
            </p>
          </div>

          <DemoRequestForm
            locale={currentLocale}
            initialProduct={selectedProduct}
            initialInterest={selectedInterest}
          />
        </div>

        {/* What Happens Next Section */}
        <div className="rounded-2xl border border-border bg-surface p-8 space-y-8">
          <h2 className="text-2xl font-bold text-ink">{t('nextSteps.heading')}</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="space-y-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange/10 text-orange text-sm font-bold">
                  {step}
                </span>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {step === 3 && isEarlyAccess ? t('nextSteps.step3EarlyAccess') : t(`nextSteps.step${step}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
