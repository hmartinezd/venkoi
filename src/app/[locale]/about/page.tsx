import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { TrackedButton } from '@/components/analytics/TrackedButton';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';

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
  const t = await getTranslations({ locale: currentLocale, namespace: 'aboutPage' });

  return createMetadata({
    title: t('seoTitle'),
    description: t('seoDescription'),
    routeKey: 'about',
    locale: currentLocale
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('aboutPage');
  const tCommon = await getTranslations('common');

  return (
    <>
      {/* Hero */}
      <Section variant="light" spacing="hero">
        <Container className="max-w-4xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-tight">
            {t('heading')}
          </h1>
          <p className="text-lg text-foreground-muted leading-relaxed max-w-3xl">
            {t('body')}
          </p>
        </Container>
      </Section>

      {/* Product Direction */}
      <Section variant="surface" className="border-y border-border">
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {t('strategicDirectionEyebrow')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t('productDirectionHeading')}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              {t('productDirectionBody')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-12 md:items-stretch">
            {/* Primary Pillar: Venkoi Products */}
            <div className="md:col-span-7 rounded-2xl border-2 border-orange/40 bg-background p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-flex items-center rounded-md bg-orange-subtle px-3 py-1 text-xs font-bold text-orange-text uppercase tracking-wider">
                  {t('primaryPillarBadge')}
                </span>
                <h3 className="text-2xl font-bold text-ink">{t('venkoiProductsTitle')}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {t('venkoiProductsDesc', { productName: FEATURED_PRODUCT.name })}
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <Button href={getLocalizedPath('productsZaiko', currentLocale)} variant="secondary">
                  {t('exploreZaikoCta', { productName: FEATURED_PRODUCT.name })}
                </Button>
              </div>
            </div>

            {/* Secondary Pillar: Services */}
            <div className="md:col-span-5 rounded-2xl border border-border bg-background p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                  {t('clientSolutionsBadge')}
                </span>
                <h3 className="text-2xl font-bold text-ink">{t('servicesTitle')}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {t('servicesDesc')}
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <Button href={getLocalizedPath('services', currentLocale)} variant="secondary">
                  {t('servicesCta')}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* How We Build */}
      <Section variant="surface" className="border-y border-border">
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {t('philosophy.eyebrow')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t('philosophy.heading')}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              {t('philosophy.body')}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <span className="block font-mono text-xs font-bold tracking-widest text-orange-text">01</span>
              <h3 className="text-xl font-bold text-ink">{t('philosophy.p1.title')}</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                {t('philosophy.p1.body')}
              </p>
            </div>
            <div className="space-y-4">
              <span className="block font-mono text-xs font-bold tracking-widest text-orange-text">02</span>
              <h3 className="text-xl font-bold text-ink">{t('philosophy.p2.title')}</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                {t('philosophy.p2.body')}
              </p>
            </div>
            <div className="space-y-4">
              <span className="block font-mono text-xs font-bold tracking-widest text-orange-text">03</span>
              <h3 className="text-xl font-bold text-ink">{t('philosophy.p3.title')}</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                {t('philosophy.p3.body')}
              </p>
            </div>
            <div className="space-y-4">
              <span className="block font-mono text-xs font-bold tracking-widest text-orange-text">04</span>
              <h3 className="text-xl font-bold text-ink">{t('philosophy.p4.title')}</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                {t('philosophy.p4.body')}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Local Context / Direct Relationship */}
      <Section variant="light" spacing="compact">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {t('foundationExpansionEyebrow')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t('localGlobalHeading')}
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-foreground-muted">
              {t('localGlobalBody')}
            </p>
          </div>
          <div className="space-y-7 border-t border-border pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
                {t('locationEyebrow')}
              </p>
              <p className="text-sm font-semibold leading-relaxed text-ink">
                {tCommon('locationLine')}
              </p>
            </div>
            <p className="border-l-2 border-orange pl-4 text-xl font-bold leading-snug text-ink sm:text-2xl">
              {t('directBuilderStatement')}
            </p>
            <p className="text-sm leading-relaxed text-foreground-muted">
              {t('directBuilderBody')}
            </p>
          </div>
        </Container>
      </Section>

      {/* Final About CTA */}
      <Section variant="dark" spacing="spacious" className="text-center">
        <Container className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t('footerCta.heading')}
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-white/75">
              {t('footerCta.body')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <TrackedButton
              href={buildProductDemoHref(currentLocale, FEATURED_PRODUCT)}
              variant="brand"
              eventName="zaiko_demo_cta"
              properties={{
                locale: currentLocale,
                product: FEATURED_PRODUCT.analyticsProduct,
                source: 'about_footer'
              }}
            >
              {tCommon('demo')}
            </TrackedButton>
            <Button
              href={getLocalizedPath('contact', currentLocale)}
              variant="inverse"
            >
              {tCommon('startConversation')}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
