import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { DemoRequestForm } from '@/components/forms/DemoRequestForm';
import { DirectContactChannels } from '@/components/contact/DirectContactChannels';
import { ProductDemoAgenda } from '@/components/demo/ProductDemoAgenda';
import { NextSteps } from '@/components/shared/NextSteps';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import { isEarlyAccessInterest, resolveDemoProduct } from '@/lib/products';
import { getLocalizedPath } from '@/i18n/routing';
import { normalizeDemoConversionSource } from '@/lib/product-links';
import type { Metadata } from 'next';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

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
  const { product, interest, source } = await searchParams;
  const currentLocale = parseLocale(locale);

  const t = await getTranslations('demoPage');
  const messages = await getMessages();

  const resolvedProduct = resolveDemoProduct(product);
  const selectedProduct = resolvedProduct.slug;
  const isEarlyAccess = isEarlyAccessInterest(resolvedProduct, interest);
  const selectedInterest = isEarlyAccess ? 'early-access' : '';
  const conversionSource = normalizeDemoConversionSource(source);

  const isZaiko = resolvedProduct.slug === 'zaiko';
  const productProgramValues = {
    productName: resolvedProduct.name,
    freeMonths: resolvedProduct.earlyAccess.freeMonths
  };

  let eyebrowText = isZaiko ? t('zaiko.eyebrow', productProgramValues) : t('eyebrow');
  let headingText = isZaiko ? t('zaiko.heading', productProgramValues) : t('heading');
  let bodyText = isZaiko ? t('zaiko.body', productProgramValues) : t('body');

  if (isZaiko && isEarlyAccess) {
    eyebrowText = t('earlyAccess.eyebrow', productProgramValues);
    headingText = t('earlyAccess.heading', productProgramValues);
    bodyText = t('earlyAccess.body', productProgramValues);
  }

  const formTitle = isEarlyAccess
    ? t('earlyAccess.formTitle')
    : (isZaiko ? t('zaiko.title', productProgramValues) : t('earlyAccessTitle'));

  const formDesc = isEarlyAccess
    ? t('earlyAccess.badge', productProgramValues)
    : (isZaiko ? t('zaiko.formDescription', productProgramValues) : t('badgeText', productProgramValues));

  return (
    <Section variant="light" spacing="hero">
      <Container className="space-y-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {eyebrowText}
            </span>
            {isEarlyAccess && (
              <span className="inline-flex items-center rounded-md bg-orange/10 px-2 py-0.5 text-[10px] font-bold text-orange-text uppercase tracking-wider border border-orange/20">
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
            whatsappMessage={t('direct.productMessage', { productName: resolvedProduct.name })}
            whatsappLabel={t('direct.whatsappLabel')}
            whatsappAriaLabel={t('direct.whatsappAriaLabel')}
            showEmail={false}
            className="shrink-0"
          />
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Demo Request / Early Access Form Shell */}
          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
              <div className="space-y-6">
                <div className="space-y-2 border-b border-border pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-xl font-bold text-ink">{formTitle}</h2>
                    {isEarlyAccess && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 border border-orange/30 px-3 py-0.5 text-xs font-bold text-orange-text">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                        {t('badge')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground-muted leading-relaxed">{formDesc}</p>
                </div>

                <NextIntlClientProvider messages={{ demoPage: messages.demoPage }}>
                  <DemoRequestForm
                    locale={currentLocale}
                    initialProduct={selectedProduct}
                    initialInterest={selectedInterest}
                    productName={resolvedProduct.name}
                    freeMonths={resolvedProduct.earlyAccess.freeMonths}
                    earlyAccessEnabled={resolvedProduct.earlyAccess.enabled}
                    fixedEarlyAccessIntent={isEarlyAccess}
                    conversionSource={conversionSource}
                  />
                </NextIntlClientProvider>
              </div>
            </div>
            <p className="text-sm text-foreground-muted">
              {t('contactEscape.prompt')}{' '}
              <a
                href={getLocalizedPath('contact', currentLocale)}
                className="rounded-sm font-semibold text-ink underline decoration-border-strong underline-offset-4 outline-none transition hover:text-orange-text focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                {t('contactEscape.link')}
              </a>
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-surface-muted/50 p-6 sm:p-8 lg:col-span-5">
            <ProductDemoAgenda
              eyebrow={t('agenda.eyebrow')}
              heading={t('agenda.heading', { productName: resolvedProduct.name })}
              items={['setupInventory', 'invoicePurchase', 'costIntelligence', 'countsReorder', 'ownerView'].map((area) => ({
                title: t(`agenda.items.${area}.title`),
                description: t(`agenda.items.${area}.description`)
              }))}
            />
          </aside>
        </div>

        <NextSteps
          heading={t('nextSteps.heading')}
          steps={[1, 2, 3].map((step) =>
            step === 3 && isEarlyAccess
              ? t('nextSteps.step3EarlyAccess')
              : t(`nextSteps.step${step}`, productProgramValues)
          )}
        />
      </Container>
    </Section>
  );
}
