import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ZaikoProductNav } from '@/components/product/zaiko/ZaikoProductNav';
import { ZaikoHero } from '@/components/product/zaiko/ZaikoHero';
import { ZaikoFeatureSection } from '@/components/product/zaiko/ZaikoFeatureSection';
import { ZaikoWorkflow } from '@/components/product/zaiko/ZaikoWorkflow';
import { ZaikoEarlyAccess } from '@/components/product/zaiko/ZaikoEarlyAccess';
import { ZaikoFinalCta } from '@/components/product/zaiko/ZaikoFinalCta';
import { ZaikoProblemSection } from '@/components/product/zaiko/ZaikoProblemSection';
import { ZaikoExplorer } from '@/components/product/zaiko/ZaikoExplorer';
import { ZaikoAudience } from '@/components/product/zaiko/ZaikoAudience';
import { ZaikoFaq } from '@/components/product/zaiko/ZaikoFaq';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import { getSiteOrigin } from '@/lib/site-config';
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
  const tProblem = await getTranslations('zaikoPage.problem');
  const tExplorer = await getTranslations('zaikoPage.explorer');
  const tAreas = await getTranslations('zaikoPage.areas');
  const tWorkflow = await getTranslations('zaikoPage.workflow');
  const tAudience = await getTranslations('zaikoPage.audience');
  const tEarlyAccess = await getTranslations('zaikoPage.earlyAccess');
  const tFaq = await getTranslations('zaikoPage.faq');
  const tFinalCta = await getTranslations('zaikoPage.finalCta');
  const tSeo = await getTranslations('zaikoPage.seo');
  const tVisuals = await getTranslations('zaikoPage.visuals');

  const origin = getSiteOrigin();

  const visualLabels = {
    inventory: tVisuals('inventory'),
    purchases: tVisuals('purchases'),
    activity: tVisuals('activity'),
    costs: tVisuals('costs'),
    onHand: tVisuals('onHand'),
    incoming: tVisuals('incoming'),
    history: tVisuals('history'),
    trend: tVisuals('trend')
  };

  const explorerAreas = {
    inventory: {
      label: tNav('inventory'),
      eyebrow: tAreas('inventory.eyebrow'),
      heading: tAreas('inventory.heading'),
      body: tAreas('inventory.body'),
      supporting: [
        tAreas('inventory.supporting.0'),
        tAreas('inventory.supporting.1'),
        tAreas('inventory.supporting.2')
      ]
    },
    purchases: {
      label: tNav('purchases'),
      eyebrow: tAreas('purchases.eyebrow'),
      heading: tAreas('purchases.heading'),
      body: tAreas('purchases.body'),
      supporting: [
        tAreas('purchases.supporting.0'),
        tAreas('purchases.supporting.1'),
        tAreas('purchases.supporting.2')
      ]
    },
    activity: {
      label: tNav('activity'),
      eyebrow: tAreas('activity.eyebrow'),
      heading: tAreas('activity.heading'),
      body: tAreas('activity.body'),
      supporting: [
        tAreas('activity.supporting.0'),
        tAreas('activity.supporting.1'),
        tAreas('activity.supporting.2')
      ]
    },
    costs: {
      label: tNav('costs'),
      eyebrow: tAreas('costs.eyebrow'),
      heading: tAreas('costs.heading'),
      body: tAreas('costs.body'),
      supporting: [
        tAreas('costs.supporting.0'),
        tAreas('costs.supporting.1'),
        tAreas('costs.supporting.2')
      ]
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Zaiko',
    applicationCategory: 'BusinessApplication',
    description: tSeo('description'),
    operatingSystem: 'Web',
    author: {
      '@type': 'Organization',
      name: 'Venkoi',
      url: origin
    }
  };

  const faqItems = ['0', '1', '2', '3', '4'].map(idx => ({
    q: tFaq(`items.${idx}.q`),
    a: tFaq(`items.${idx}.a`)
  }));

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
        earlyAccessLabel={tNav('earlyAccess')}
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
        labels={visualLabels}
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

      {/* Problem Section */}
      <ZaikoProblemSection
        eyebrow={tProblem('eyebrow')}
        heading={tProblem('heading')}
        body={tProblem('body')}
      />

      {/* Product Explorer */}
      <ZaikoExplorer
        locale={currentLocale}
        eyebrow={tExplorer('eyebrow')}
        heading={tExplorer('heading')}
        body={tExplorer('body')}
        detailLinkLabel={tExplorer('detailLink')}
        demoCtaLabel={tExplorer('demoCta')}
        areas={explorerAreas}
        visualLabels={visualLabels}
      />

      {/* 4 Core Product Feature Areas */}
      <ZaikoFeatureSection
        id="inventory"
        eyebrow={tAreas('inventory.eyebrow')}
        heading={tAreas('inventory.heading')}
        body={tAreas('inventory.body')}
        supporting={[
          tAreas('inventory.supporting.0'),
          tAreas('inventory.supporting.1'),
          tAreas('inventory.supporting.2')
        ]}
        labels={visualLabels}
      />

      <ZaikoFeatureSection
        id="purchases"
        eyebrow={tAreas('purchases.eyebrow')}
        heading={tAreas('purchases.heading')}
        body={tAreas('purchases.body')}
        supporting={[
          tAreas('purchases.supporting.0'),
          tAreas('purchases.supporting.1'),
          tAreas('purchases.supporting.2')
        ]}
        reverse
        labels={visualLabels}
      />

      <ZaikoFeatureSection
        id="activity"
        eyebrow={tAreas('activity.eyebrow')}
        heading={tAreas('activity.heading')}
        body={tAreas('activity.body')}
        supporting={[
          tAreas('activity.supporting.0'),
          tAreas('activity.supporting.1'),
          tAreas('activity.supporting.2')
        ]}
        labels={visualLabels}
      />

      <ZaikoFeatureSection
        id="costs"
        eyebrow={tAreas('costs.eyebrow')}
        heading={tAreas('costs.heading')}
        body={tAreas('costs.body')}
        supporting={[
          tAreas('costs.supporting.0'),
          tAreas('costs.supporting.1'),
          tAreas('costs.supporting.2')
        ]}
        reverse
        labels={visualLabels}
      />

      {/* Unified Workflow Composition */}
      <ZaikoWorkflow
        eyebrow={tWorkflow('eyebrow')}
        heading={tWorkflow('heading')}
        body={tWorkflow('body')}
        labels={visualLabels}
      />

      {/* Who Zaiko is for */}
      <ZaikoAudience
        heading={tAudience('heading')}
        body={tAudience('body')}
        items={[
          tAudience('items.0'),
          tAudience('items.1'),
          tAudience('items.2')
        ]}
      />

      {/* Early Access Highlight */}
      <ZaikoEarlyAccess
        locale={currentLocale}
        eyebrow={tEarlyAccess('eyebrow')}
        heading={tEarlyAccess('heading')}
        body={tEarlyAccess('body')}
        details={[
          tEarlyAccess('details.0'),
          tEarlyAccess('details.1'),
          tEarlyAccess('details.2'),
          tEarlyAccess('details.3')
        ]}
        primaryCta={tEarlyAccess('primaryCta')}
        secondaryCta={tEarlyAccess('secondaryCta')}
      />

      {/* FAQ Section */}
      <ZaikoFaq
        heading={tFaq('heading')}
        items={faqItems}
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
