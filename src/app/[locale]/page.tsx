import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import { getSiteOrigin } from '@/lib/site-config';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FEATURED_PRODUCT } from '@/lib/products';
import { buildServeVisualLabels } from '@/lib/serve-visual-labels';
import { filterMarketableEntries, getHomepageMarketingState, HOMEPAGE_PRODUCT_OUTCOMES } from '@/lib/product-marketing';

import { HeroSection } from '@/components/home/HeroSection';
import { ServeFeature } from '@/components/home/ServeFeature';
import { ServicesSection } from '@/components/home/ServicesSection';
import { PhilosophySection } from '@/components/home/PhilosophySection';
import { CompanyContext } from '@/components/home/CompanyContext';
import { InsightsPreview } from '@/components/home/InsightsPreview';
import { FinalCta } from '@/components/home/FinalCta';

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
  const seo = await getTranslations({ locale: currentLocale, namespace: 'seo' });
  return createMetadata({
    title: seo('title'),
    description: seo('description'),
    routeKey: 'home',
    locale: currentLocale
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);

  const tHome = await getTranslations('home');
  const tCommon = await getTranslations('common');
  const tArticles = await getTranslations('insightsArticles');
  const tInsights = await getTranslations('insightsPage');
  const tVisuals = await getTranslations('servePage.visuals');
  const origin = getSiteOrigin();
  const visualLabels = buildServeVisualLabels(tVisuals);
  const homepageState = getHomepageMarketingState();
  const outcomeKeys = filterMarketableEntries(HOMEPAGE_PRODUCT_OUTCOMES)
    .map(({ key }) => key);

  const articles = [
    {
      routeKey: 'insightRestaurantInventory' as const,
      category: tArticles('restaurantInventory.category'),
      title: tArticles('restaurantInventory.title'),
      description: tArticles('restaurantInventory.description')
    },
    {
      routeKey: 'insightRestaurantFoodCost' as const,
      category: tArticles('restaurantFoodCost.category'),
      title: tArticles('restaurantFoodCost.title'),
      description: tArticles('restaurantFoodCost.description')
    },
    {
      routeKey: 'insightRestaurantInventoryCounts' as const,
      category: tArticles('restaurantInventoryCounts.category'),
      title: tArticles('restaurantInventoryCounts.title'),
      description: tArticles('restaurantInventoryCounts.description')
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
        name: 'Venkoi',
        url: origin,
        logo: `${origin}/brand/venkoi-logo-dark.png`,
        description: tHome('hero.body')
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: 'Venkoi',
        publisher: {
          '@id': `${origin}/#organization`
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection
        locale={currentLocale}
        eyebrow={tHome('hero.eyebrow')}
        heading={tHome('hero.heading')}
        body={tHome('hero.body')}
        primaryCta={tHome('hero.primaryCta', { productName: FEATURED_PRODUCT.name })}
        secondaryCta={tCommon('demo')}
        visualLabels={visualLabels}
      />

      <ServeFeature
        locale={currentLocale}
        eyebrow={tHome('serve.eyebrow', { productName: FEATURED_PRODUCT.name })}
        heading={tHome('serve.heading')}
        body={tHome('serve.body', { productName: FEATURED_PRODUCT.name })}
        discoverCta={tHome('serve.discoverCta', { productName: FEATURED_PRODUCT.name })}
        demoCta={tCommon('demo')}
        earlyAccess={FEATURED_PRODUCT.earlyAccess.enabled ? {
          badge: tHome('serve.badge', { freeMonths: FEATURED_PRODUCT.earlyAccess.freeMonths }),
          badgeText: tHome(`serve.availability.${homepageState}`, {
            productName: FEATURED_PRODUCT.name,
            freeMonths: FEATURED_PRODUCT.earlyAccess.freeMonths
          }),
          cta: tCommon('requestAccess')
        } : undefined}
        visibleOutcomeKeys={outcomeKeys}
        theme1Title={tHome('serve.theme1Title')}
        theme1Desc={tHome('serve.theme1Desc')}
        theme2Title={tHome('serve.theme2Title')}
        theme2Desc={tHome('serve.theme2Desc')}
        theme3Title={tHome('serve.theme3Title')}
        theme3Desc={tHome('serve.theme3Desc')}
        theme4Title={tHome('serve.theme4Title')}
        theme4Desc={tHome('serve.theme4Desc')}
        theme5Title={tHome('serve.theme5Title')}
        theme5Desc={tHome('serve.theme5Desc')}
        visualLabels={visualLabels}
      />

      <InsightsPreview
        locale={currentLocale}
        eyebrow={tHome('insights.eyebrow')}
        heading={tHome('insights.heading')}
        body={tHome('insights.body')}
        cta={tHome('insights.cta')}
        readMoreLabel={tInsights('readMore')}
        articles={articles}
      />

      <PhilosophySection
        eyebrow={tHome('philosophy.eyebrow')}
        heading={tHome('philosophy.heading')}
        item1Num={tHome('philosophy.item1Num')}
        item1Title={tHome('philosophy.item1Title')}
        item1Desc={tHome('philosophy.item1Desc')}
        item2Num={tHome('philosophy.item2Num')}
        item2Title={tHome('philosophy.item2Title')}
        item2Desc={tHome('philosophy.item2Desc')}
        item3Num={tHome('philosophy.item3Num')}
        item3Title={tHome('philosophy.item3Title')}
        item3Desc={tHome('philosophy.item3Desc')}
      />

      <CompanyContext
        locale={currentLocale}
        eyebrow={tHome('aboutPreview.eyebrow')}
        heading={tHome('aboutPreview.heading')}
        p1={tHome('aboutPreview.p1')}
        location={tHome('aboutPreview.location')}
        cta={tHome('aboutPreview.cta')}
      />

      <ServicesSection
        locale={currentLocale}
        eyebrow={tHome('services.eyebrow')}
        heading={tHome('services.heading')}
        body={tHome('services.body')}
        cta={tHome('services.cta')}
        learnMore={tHome('services.learnMore')}
        mobileTitle={tHome('services.mobileTitle')}
        mobileDesc={tHome('services.mobileDesc')}
        webTitle={tHome('services.webTitle')}
        webDesc={tHome('services.webDesc')}
      />

      <FinalCta
        locale={currentLocale}
        heading={tHome('finalCta.heading')}
        body={tHome('finalCta.body')}
        demoCta={tCommon('demo')}
        talkCta={tCommon('startConversation')}
      />
    </>
  );
}
