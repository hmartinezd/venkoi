import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import { getSiteOrigin } from '@/lib/site-config';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { HeroSection } from '@/components/home/HeroSection';
import { ProductsIntro } from '@/components/home/ProductsIntro';
import { ZaikoFeature } from '@/components/home/ZaikoFeature';
import { ServicesSection } from '@/components/home/ServicesSection';
import { LocalSection } from '@/components/home/LocalSection';
import { PhilosophySection } from '@/components/home/PhilosophySection';
import { AboutPreview } from '@/components/home/AboutPreview';
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
  setRequestLocale(currentLocale);

  const tHome = await getTranslations('home');
  const origin = getSiteOrigin();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Venkoi',
    url: origin,
    logo: `${origin}/brand/venkoi-logo-dark.png`,
    description: tHome('hero.body'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tampa Bay',
      addressRegion: 'FL',
      addressCountry: 'US'
    }
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
        primaryCta={tHome('hero.primaryCta')}
        secondaryCta={tHome('hero.secondaryCta')}
        location={tHome('hero.location')}
      />

      <ProductsIntro
        eyebrow={tHome('productsIntro.eyebrow')}
        heading={tHome('productsIntro.heading')}
        body={tHome('productsIntro.body')}
      />

      <ZaikoFeature
        locale={currentLocale}
        eyebrow={tHome('zaiko.eyebrow')}
        heading={tHome('zaiko.heading')}
        body={tHome('zaiko.body')}
        discoverCta={tHome('zaiko.discoverCta')}
        demoCta={tHome('zaiko.demoCta')}
        badge={tHome('zaiko.badge')}
        badgeText={tHome('zaiko.badgeText')}
        theme1Title={tHome('zaiko.theme1Title')}
        theme1Desc={tHome('zaiko.theme1Desc')}
        theme2Title={tHome('zaiko.theme2Title')}
        theme2Desc={tHome('zaiko.theme2Desc')}
        theme3Title={tHome('zaiko.theme3Title')}
        theme3Desc={tHome('zaiko.theme3Desc')}
        theme4Title={tHome('zaiko.theme4Title')}
        theme4Desc={tHome('zaiko.theme4Desc')}
      />

      <ServicesSection
        locale={currentLocale}
        eyebrow={tHome('services.eyebrow')}
        heading={tHome('services.heading')}
        body={tHome('services.body')}
        cta={tHome('services.cta')}
        mobileTitle={tHome('services.mobileTitle')}
        mobileDesc={tHome('services.mobileDesc')}
        webTitle={tHome('services.webTitle')}
        webDesc={tHome('services.webDesc')}
      />

      <LocalSection
        eyebrow={tHome('local.eyebrow')}
        heading={tHome('local.heading')}
        body={tHome('local.body')}
        tampaTitle={tHome('local.tampaTitle')}
        tampaDesc={tHome('local.tampaDesc')}
        southFloridaTitle={tHome('local.southFloridaTitle')}
        southFloridaDesc={tHome('local.southFloridaDesc')}
        beyondTitle={tHome('local.beyondTitle')}
        beyondDesc={tHome('local.beyondDesc')}
        prominentStatement={tHome('local.prominentStatement')}
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

      <AboutPreview
        locale={currentLocale}
        eyebrow={tHome('aboutPreview.eyebrow')}
        heading={tHome('aboutPreview.heading')}
        p1={tHome('aboutPreview.p1')}
        p2={tHome('aboutPreview.p2')}
        p3={tHome('aboutPreview.p3')}
        cta={tHome('aboutPreview.cta')}
      />

      <FinalCta
        locale={currentLocale}
        heading={tHome('finalCta.heading')}
        body={tHome('finalCta.body')}
        demoCta={tHome('finalCta.demoCta')}
        talkCta={tHome('finalCta.talkCta')}
        locationLine={tHome('finalCta.locationLine')}
      />
    </>
  );
}
