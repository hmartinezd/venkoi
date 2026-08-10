import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ServiceCta } from '@/components/services/ServiceCta';
import { ServiceDecisionSupport } from '@/components/services/ServiceDecisionSupport';
import { ServiceDetailHero } from '@/components/services/ServiceDetailHero';
import { ServiceProcess } from '@/components/services/ServiceProcess';
import { ServiceScope } from '@/components/services/ServiceScope';
import { ServiceStartingPoint } from '@/components/services/ServiceStartingPoint';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';

interface PageProps { params: Promise<{ locale: string }> }
function parseLocale(locale: string): Locale { if (locales.includes(locale as Locale)) return locale as Locale; notFound(); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const currentLocale = parseLocale((await params).locale);
  const t = await getTranslations({ locale: currentLocale, namespace: 'mobileServicePage' });
  return createMetadata({ title: t('seoTitle'), description: t('seoDescription'), routeKey: 'servicesMobile', locale: currentLocale });
}

export default async function MobileServicePage({ params }: PageProps) {
  const currentLocale = parseLocale((await params).locale); setRequestLocale(currentLocale);
  const t = await getTranslations('mobileServicePage');
  const process = await getTranslations('servicesPage.howWeWork');
  const articles = await getTranslations('insightsArticles');
  const insights = await getTranslations('insightsPage');
  const stages = ([1, 2, 3, 4] as const).map((i) => ({ number: process(`stage${i}Num`), title: process(`stage${i}Title`), description: process(`stage${i}Desc`) }));
  const faqItems = ([1, 2, 3, 4, 5] as const).map((i) => ({ question: t(`faq.q${i}`), answer: t(`faq.a${i}`) }));

  return <>
    <ServiceDetailHero locale={currentLocale} breadcrumbLabelKey="mobileApplications" eyebrow={t('eyebrow')} heading={t('heroHeading')} body={t('heroBody')} cta={t('primaryCta')} interest="mobile" analyticsSource="mobile_detail_hero" />
    <ServiceScope heading={t('rangeHeading')} items={([1, 2, 3, 4, 5] as const).map((i) => t(`rangeItem${i}`))} supporting={{ heading: t('platformHeading'), body: t('platformBody'), items: ['iOS', 'Android'] }} />
    <ServiceProcess eyebrow={process('eyebrow')} heading={t('processHeading')} stages={stages} testingPrinciple={process('testingPrinciple')} />
    <ServiceStartingPoint locale={currentLocale} heading={t('startingPoint.heading')} body={t('startingPoint.body')} existingProject={{ heading: t('existingHeading'), body: t('existingBody') }} prompts={([1, 2, 3, 4] as const).map((i) => t(`startingPoint.prompt${i}`))} ctaText={t('startingPoint.cta')} ctaInterest="mobile" ctaSource="mobile_starting_point" />
    <ServiceDecisionSupport locale={currentLocale} heading={articles('relatedGuides')} guide={{ category: articles('startSoftwareProject.category'), title: articles('startSoftwareProject.title'), description: articles('startSoftwareProject.description'), routeKey: 'insightStartSoftwareProject', readMoreLabel: insights('readMore') }} faqHeading={t('faq.heading')} faqItems={faqItems} />
    <ServiceCta locale={currentLocale} heading={t('finalCta.heading')} body={t('finalCta.body')} cta={t('primaryCta')} interest="mobile" />
  </>;
}
