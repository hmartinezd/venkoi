import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ZaikoProductNav } from '@/components/product/zaiko/ZaikoProductNav';
import { ZaikoHero } from '@/components/product/zaiko/ZaikoHero';
import { ZaikoCapabilities } from '@/components/product/zaiko/ZaikoCapabilities';
import { ZaikoContext } from '@/components/product/zaiko/ZaikoContext';
import { ZaikoProductFit } from '@/components/product/zaiko/ZaikoProductFit';
import { ZaikoEarlyAccess } from '@/components/product/zaiko/ZaikoEarlyAccess';
import { ZaikoFinalCta } from '@/components/product/zaiko/ZaikoFinalCta';
import { ZaikoExplorer } from '@/components/product/zaiko/ZaikoExplorer';
import { ZaikoFaq } from '@/components/product/zaiko/ZaikoFaq';
import { InsightCard } from '@/components/insights/InsightCard';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { createMetadata } from '@/lib/seo';
import { getSiteOrigin } from '@/lib/site-config';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
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
  const t = await getTranslations({ locale: currentLocale, namespace: 'zaikoPage.seo' });

  return createMetadata({
    title: t('title', { productName: FEATURED_PRODUCT.name }),
    description: t('description', { productName: FEATURED_PRODUCT.name }),
    routeKey: 'productsZaiko',
    locale: currentLocale
  });
}

export default async function ZaikoPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);

  const tNav = await getTranslations('zaikoPage.nav');
  const tHeader = await getTranslations('header');
  const tHero = await getTranslations('zaikoPage.hero');
  const tIntro = await getTranslations('zaikoPage.intro');
  const tProblem = await getTranslations('zaikoPage.problem');
  const tExplorer = await getTranslations('zaikoPage.explorer');
  const tCapabilities = await getTranslations('zaikoPage.capabilities');
  const tAreas = await getTranslations('zaikoPage.areas');
  const tWorkflow = await getTranslations('zaikoPage.workflow');
  const tAudience = await getTranslations('zaikoPage.audience');
  const tEarlyAccess = await getTranslations('zaikoPage.earlyAccess');
  const tFaq = await getTranslations('zaikoPage.faq');
  const tFinalCta = await getTranslations('zaikoPage.finalCta');
  const tSeo = await getTranslations('zaikoPage.seo');
  const tVisuals = await getTranslations('zaikoPage.visuals');
  const tArticles = await getTranslations('insightsArticles');
  const tInsights = await getTranslations('insightsPage');

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
      summary: tExplorer('summaries.inventory')
    },
    purchases: {
      label: tNav('purchases'),
      eyebrow: tAreas('purchases.eyebrow'),
      heading: tAreas('purchases.heading'),
      summary: tExplorer('summaries.purchases')
    },
    activity: {
      label: tNav('activity'),
      eyebrow: tAreas('activity.eyebrow'),
      heading: tAreas('activity.heading'),
      summary: tExplorer('summaries.activity')
    },
    costs: {
      label: tNav('costs'),
      eyebrow: tAreas('costs.eyebrow'),
      heading: tAreas('costs.heading'),
      summary: tExplorer('summaries.costs')
    }
  };

  const productProgramValues = {
    productName: FEATURED_PRODUCT.name,
    freeMonths: FEATURED_PRODUCT.earlyAccess.freeMonths
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: FEATURED_PRODUCT.name,
    url: `${origin}${getLocalizedPath('productsZaiko', currentLocale)}`,
    applicationCategory: 'BusinessApplication',
    description: tSeo('description', productProgramValues),
    operatingSystem: 'Web',
    author: {
      '@type': 'Organization',
      name: 'Venkoi',
      url: origin
    }
  };

  const baseFaqItems = ['0', '1', '2'].map(idx => ({
    q: tFaq(`items.${idx}.q`, productProgramValues),
    a: tFaq(`items.${idx}.a`, productProgramValues)
  }));
  const faqItems = [
    ...baseFaqItems,
    ...(FEATURED_PRODUCT.earlyAccess.enabled ? [{
      q: tFaq('items.3.q', productProgramValues),
      a: tFaq('items.3.a', productProgramValues)
    }] : []),
    {
      q: tFaq('items.4.q', productProgramValues),
      a: tFaq(FEATURED_PRODUCT.earlyAccess.enabled ? 'items.4.a' : 'gettingStartedDemoOnly', productProgramValues)
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sub-navigation Bar */}
      <ZaikoProductNav
        locale={currentLocale}
        productName={FEATURED_PRODUCT.name}
        subtitle={tNav('subtitle')}
        overviewLabel={tNav('overview')}
        inventoryLabel={tNav('inventory')}
        purchasesLabel={tNav('purchases')}
        activityLabel={tNav('activity')}
        costsLabel={tNav('costs')}
        earlyAccessLabel={FEATURED_PRODUCT.earlyAccess.enabled ? tNav('earlyAccess') : undefined}
        requestDemoLabel={tNav('requestDemo')}
        navigationLabel={tHeader('productNavigation', { productName: FEATURED_PRODUCT.name })}
      />

      {/* Hero Section */}
      <ZaikoHero
        locale={currentLocale}
        eyebrow={tHero('eyebrow', productProgramValues)}
        heading={tHero('heading')}
        body={tHero('body', productProgramValues)}
        primaryCta={tHero('primaryCta')}
        earlyAccess={FEATURED_PRODUCT.earlyAccess.enabled ? {
          cta: tHero('secondaryCta'),
          microcopy: tHero('microcopy', productProgramValues),
          noCreditCard: tHero('noCreditCard')
        } : undefined}
        labels={visualLabels}
      />

      {/* Product Context */}
      <ZaikoContext
        intro={{
          eyebrow: tIntro('eyebrow'),
          heading: tIntro('heading'),
          body: tIntro('body', productProgramValues)
        }}
        problem={{
          eyebrow: tProblem('eyebrow'),
          heading: tProblem('heading'),
          body: tProblem('body', productProgramValues)
        }}
      />

      {/* Product Explorer */}
      <ZaikoExplorer
        locale={currentLocale}
        eyebrow={tExplorer('eyebrow', productProgramValues)}
        heading={tExplorer('heading')}
        body={tExplorer('body', productProgramValues)}
        detailLinkLabel={tExplorer('detailLink', { area: '{area}' })}
        demoCtaLabel={tExplorer('demoCta')}
        areas={explorerAreas}
        visualLabels={visualLabels}
      />

      {/* Capabilities in Detail */}
      <ZaikoCapabilities
        eyebrow={tCapabilities('eyebrow')}
        heading={tCapabilities('heading')}
        body={tCapabilities('body')}
        capabilities={(['inventory', 'purchases', 'activity', 'costs'] as const).map(id => ({
          id,
          eyebrow: tAreas(`${id}.eyebrow`),
          heading: tAreas(`${id}.heading`),
          body: tAreas(`${id}.body`, productProgramValues),
          supporting: [
            tAreas(`${id}.supporting.0`),
            tAreas(`${id}.supporting.1`),
            tAreas(`${id}.supporting.2`)
          ]
        }))}
      />

      {/* Unified Product Fit */}
      <ZaikoProductFit
        workflow={{
          eyebrow: tWorkflow('eyebrow'),
          heading: tWorkflow('heading'),
          body: tWorkflow('body')
        }}
        audience={{
          heading: tAudience('heading'),
          body: tAudience('body', productProgramValues),
          items: [tAudience('items.0'), tAudience('items.1'), tAudience('items.2')]
        }}
        labels={visualLabels}
      />

      {/* Early Access Highlight */}
      {FEATURED_PRODUCT.earlyAccess.enabled ? <ZaikoEarlyAccess
        locale={currentLocale}
        eyebrow={tEarlyAccess('eyebrow')}
        heading={tEarlyAccess('heading', productProgramValues)}
        body={tEarlyAccess('body', productProgramValues)}
        details={[
          tEarlyAccess('details.0', productProgramValues),
          tEarlyAccess('details.1', productProgramValues),
          tEarlyAccess('details.2', productProgramValues),
          tEarlyAccess('details.3', productProgramValues)
        ]}
        primaryCta={tEarlyAccess('primaryCta')}
        secondaryCta={tEarlyAccess('secondaryCta')}
      /> : null}

      {/* FAQ Section */}
      <ZaikoFaq
        heading={tFaq('heading', productProgramValues)}
        items={faqItems}
      />

      {/* Related Guide Section */}
      <Section variant="light" spacing="compact" className="border-t border-border">
        <Container className="max-w-4xl">
          <div className="space-y-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text text-center">
              {tArticles('relatedGuide')}
            </p>
            <div className="max-w-2xl mx-auto">
              <InsightCard
                locale={currentLocale}
                category={tArticles('restaurantInventory.category')}
                title={tArticles('restaurantInventory.title')}
                description={tArticles('restaurantInventory.description')}
                routeKey="insightRestaurantInventory"
                readMoreLabel={tInsights('readMore')}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Final Closing CTA */}
      <ZaikoFinalCta
        locale={currentLocale}
        heading={tFinalCta('heading')}
        body={tFinalCta(FEATURED_PRODUCT.earlyAccess.enabled ? 'body' : 'bodyDemoOnly')}
        primaryCta={tFinalCta('primaryCta')}
        earlyAccess={FEATURED_PRODUCT.earlyAccess.enabled ? { cta: tFinalCta('secondaryCta') } : undefined}
        directHeading={tFinalCta('directHeading', { productName: FEATURED_PRODUCT.name })}
        directBody={tFinalCta('directBody')}
        whatsappLabel={tFinalCta('whatsappLabel')}
        whatsappAriaLabel={tFinalCta('whatsappAriaLabel', { productName: FEATURED_PRODUCT.name })}
        whatsappMessage={tFinalCta('whatsappMessage', { productName: FEATURED_PRODUCT.name })}
      />
    </>
  );
}
