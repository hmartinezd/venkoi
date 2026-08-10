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
  const t = await getTranslations({ locale: currentLocale, namespace: 'webServicePage' });
  return createMetadata({ title: t('seoTitle'), description: t('seoDescription'), routeKey: 'servicesWeb', locale: currentLocale });
}

export default async function WebServicePage({ params }: PageProps) {
  const currentLocale = parseLocale((await params).locale); setRequestLocale(currentLocale);
  const t = await getTranslations('webServicePage');
  const process = await getTranslations('servicesPage.howWeWork');
  const articles = await getTranslations('insightsArticles');
  const insights = await getTranslations('insightsPage');
  const stages = ([1, 2, 3, 4] as const).map((i) => ({ number: process(`stage${i}Num`), title: process(`stage${i}Title`), description: process(`stage${i}Desc`) }));
  const faqItems = ([1, 2, 3, 4, 5] as const).map((i) => ({ question: t(`faq.q${i}`), answer: t(`faq.a${i}`) }));

  return <>
    <ServiceDetailHero locale={currentLocale} breadcrumbLabelKey="webApplications" eyebrow={t('eyebrow')} heading={t('heroHeading')} body={t('heroBody')} cta={t('primaryCta')} interest="web" analyticsSource="web_detail_hero" />
    <ServiceScope heading={t('rangeHeading')} items={([1, 2, 3, 4, 5] as const).map((i) => t(`rangeItem${i}`))} supporting={{ heading: t('noTechHeading'), body: t('noTechBody') }} />
    <ServiceProcess eyebrow={process('eyebrow')} heading={t('processHeading')} stages={stages} testingPrinciple={process('testingPrinciple')} />
    <ServiceStartingPoint locale={currentLocale} heading={t('startingPoint.heading')} body={t('startingPoint.body')} existingProject={{ heading: t('existingHeading'), body: t('existingBody') }} prompts={([1, 2, 3, 4] as const).map((i) => t(`startingPoint.prompt${i}`))} ctaText={t('startingPoint.cta')} ctaInterest="web" ctaSource="web_starting_point" />
    <ServiceDecisionSupport locale={currentLocale} heading={articles('relatedGuides')} guide={{ category: articles('websiteOrWebApp.category'), title: articles('websiteOrWebApp.title'), description: articles('websiteOrWebApp.description'), routeKey: 'insightWebsiteOrWebApp', readMoreLabel: insights('readMore') }} faqHeading={t('faq.heading')} faqItems={faqItems} />
    <ServiceCta locale={currentLocale} heading={t('finalCta.heading')} body={t('finalCta.body')} cta={t('primaryCta')} interest="web" />
  </>;
}
