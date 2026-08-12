import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import { getSiteOrigin } from '@/lib/site-config';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FEATURED_PRODUCT } from '@/lib/products';
import { buildZaikoVisualLabels } from '@/lib/zaiko-visual-labels';

import { HeroSection } from '@/components/home/HeroSection';
import { ZaikoFeature } from '@/components/home/ZaikoFeature';
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
  const tVisuals = await getTranslations('zaikoPage.visuals');
  const origin = getSiteOrigin();
  const visualLabels = buildZaikoVisualLabels(tVisuals);

  const articles = [
    {
      routeKey: 'insightRestaurantInventory' as const,
      category: tArticles('restaurantInventory.category'),
      title: tArticles('restaurantInventory.title'),
      description: tArticles('restaurantInventory.description')
    },
    {
      routeKey: 'insightStartSoftwareProject' as const,
      category: tArticles('startSoftwareProject.category'),
      title: tArticles('startSoftwareProject.title'),
      description: tArticles('startSoftwareProject.description')
    },
    {
      routeKey: 'insightWebsiteOrWebApp' as const,
      category: tArticles('websiteOrWebApp.category'),
      title: tArticles('websiteOrWebApp.title'),
      description: tArticles('websiteOrWebApp.description')
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
        location={tCommon('locationLine')}
        visualLabels={visualLabels}
      />

      <ZaikoFeature
        locale={currentLocale}
        eyebrow={tHome('zaiko.eyebrow', { productName: FEATURED_PRODUCT.name })}
        heading={tHome('zaiko.heading')}
        body={tHome('zaiko.body', { productName: FEATURED_PRODUCT.name })}
        discoverCta={tHome('zaiko.discoverCta', { productName: FEATURED_PRODUCT.name })}
        demoCta={tCommon('demo')}
        earlyAccess={FEATURED_PRODUCT.earlyAccess.enabled ? {
          badge: tHome('zaiko.badge', { freeMonths: FEATURED_PRODUCT.earlyAccess.freeMonths }),
          badgeText: tHome('zaiko.badgeText', {
            productName: FEATURED_PRODUCT.name,
            freeMonths: FEATURED_PRODUCT.earlyAccess.freeMonths
          })
        } : undefined}
        theme1Title={tHome('zaiko.theme1Title')}
        theme1Desc={tHome('zaiko.theme1Desc')}
        theme2Title={tHome('zaiko.theme2Title')}
        theme2Desc={tHome('zaiko.theme2Desc')}
        theme3Title={tHome('zaiko.theme3Title')}
        theme3Desc={tHome('zaiko.theme3Desc')}
        theme4Title={tHome('zaiko.theme4Title')}
        theme4Desc={tHome('zaiko.theme4Desc')}
        productName={FEATURED_PRODUCT.name}
        visualLabels={visualLabels}
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

      <InsightsPreview
        locale={currentLocale}
        eyebrow={tHome('insights.eyebrow')}
        heading={tHome('insights.heading')}
        body={tHome('insights.body')}
        cta={tHome('insights.cta')}
        readMoreLabel={tInsights('readMore')}
        articles={articles}
      />

      <CompanyContext
        locale={currentLocale}
        eyebrow={tHome('aboutPreview.eyebrow')}
        heading={tHome('aboutPreview.heading')}
        p1={tHome('aboutPreview.p1')}
        p2={tHome('aboutPreview.p2')}
        p3={tHome('aboutPreview.p3')}
        cta={tHome('aboutPreview.cta')}
        localEyebrow={tHome('local.eyebrow')}
        localHeading={tHome('local.heading')}
        localBody={tHome('local.body')}
        tampaTitle={tHome('local.tampaTitle')}
        tampaDesc={tHome('local.tampaDesc')}
        southFloridaTitle={tHome('local.southFloridaTitle')}
        southFloridaDesc={tHome('local.southFloridaDesc')}
        beyondTitle={tHome('local.beyondTitle')}
        beyondDesc={tHome('local.beyondDesc')}
        prominentStatement={tHome('local.prominentStatement')}
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
        locationLine={tHome('finalCta.locationLine')}
      />
    </>
  );
}
