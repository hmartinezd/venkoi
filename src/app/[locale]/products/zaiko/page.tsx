import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ZaikoProductNav } from '@/components/product/zaiko/ZaikoProductNav';
import { ZaikoHero } from '@/components/product/zaiko/ZaikoHero';
import { ZaikoFeatureSection } from '@/components/product/zaiko/ZaikoFeatureSection';
import { ZaikoWorkflow } from '@/components/product/zaiko/ZaikoWorkflow';
import { ZaikoEarlyAccess } from '@/components/product/zaiko/ZaikoEarlyAccess';
import { ZaikoFinalCta } from '@/components/product/zaiko/ZaikoFinalCta';
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
  const t = await getTranslations({ locale: currentLocale, namespace: 'zaikoPage.seo' });

  return createMetadata({
    title: t('title'),
    description: t('description'),
    routeKey: 'productsZaiko',
    locale: currentLocale
  });
}

export default async function ZaikoPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const tNav = await getTranslations('zaikoPage.nav');
  const tHero = await getTranslations('zaikoPage.hero');
  const tIntro = await getTranslations('zaikoPage.intro');
  const tAreas = await getTranslations('zaikoPage.areas');
  const tWorkflow = await getTranslations('zaikoPage.workflow');
  const tEarlyAccess = await getTranslations('zaikoPage.earlyAccess');
  const tFinalCta = await getTranslations('zaikoPage.finalCta');
  const tSeo = await getTranslations('zaikoPage.seo');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Zaiko',
    applicationCategory: 'BusinessApplication',
    description: tSeo('description'),
    author: {
      '@type': 'Organization',
      name: 'Venkoi',
      url: 'https://venkoi.com'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sub-navigation Bar */}
      <ZaikoProductNav
        locale={currentLocale}
        productName={tNav('productName')}
        subtitle={tNav('subtitle')}
        overviewLabel={tNav('overview')}
        inventoryLabel={tNav('inventory')}
        purchasesLabel={tNav('purchases')}
        activityLabel={tNav('activity')}
        costsLabel={tNav('costs')}
        requestDemoLabel={tNav('requestDemo')}
      />

      {/* Hero Section */}
      <ZaikoHero
        locale={currentLocale}
        eyebrow={tHero('eyebrow')}
        heading={tHero('heading')}
        body={tHero('body')}
        primaryCta={tHero('primaryCta')}
        secondaryCta={tHero('secondaryCta')}
        microcopy={tHero('microcopy')}
        noCreditCard={tHero('noCreditCard')}
      />

      {/* Product Introduction */}
      <Section variant="surface" className="py-14 md:py-20 border-t border-border">
        <Container className="max-w-3xl text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {tIntro('eyebrow')}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
            {tIntro('heading')}
          </h2>
          <p className="text-base text-foreground-muted sm:text-lg leading-relaxed">
            {tIntro('body')}
          </p>
        </Container>
      </Section>

      {/* 4 Core Product Feature Areas */}
      <ZaikoFeatureSection
        id="inventory"
        eyebrow={tAreas('inventory.eyebrow')}
        heading={tAreas('inventory.heading')}
        body={tAreas('inventory.body')}
      />

      <ZaikoFeatureSection
        id="purchases"
        eyebrow={tAreas('purchases.eyebrow')}
        heading={tAreas('purchases.heading')}
        body={tAreas('purchases.body')}
        reverse
      />

      <ZaikoFeatureSection
        id="activity"
        eyebrow={tAreas('activity.eyebrow')}
        heading={tAreas('activity.heading')}
        body={tAreas('activity.body')}
      />

      <ZaikoFeatureSection
        id="costs"
        eyebrow={tAreas('costs.eyebrow')}
        heading={tAreas('costs.heading')}
        body={tAreas('costs.body')}
        reverse
      />

      {/* Unified Workflow Composition */}
      <ZaikoWorkflow
        eyebrow={tWorkflow('eyebrow')}
        heading={tWorkflow('heading')}
        body={tWorkflow('body')}
      />

      {/* Early Access Highlight */}
      <ZaikoEarlyAccess
        locale={currentLocale}
        eyebrow={tEarlyAccess('eyebrow')}
        heading={tEarlyAccess('heading')}
        body={tEarlyAccess('body')}
        primaryCta={tEarlyAccess('primaryCta')}
        secondaryCta={tEarlyAccess('secondaryCta')}
      />

      {/* Final Closing CTA */}
      <ZaikoFinalCta
        locale={currentLocale}
        heading={tFinalCta('heading')}
        body={tFinalCta('body')}
        primaryCta={tFinalCta('primaryCta')}
        secondaryCta={tFinalCta('secondaryCta')}
      />
    </>
  );
}
