import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import { PRIVACY_CONTACT_EMAIL } from '@/lib/site-config';
import { FEATURED_PRODUCT } from '@/lib/products';

interface PageProps { params: Promise<{ locale: string }> }
function parseLocale(locale: string): Locale { if (locales.includes(locale as Locale)) return locale as Locale; notFound(); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = parseLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'termsPage' });
  return createMetadata({ title: t('seoTitle'), description: t('seoDescription'), routeKey: 'terms', locale });
}

export default async function TermsPage({ params }: PageProps) {
  parseLocale((await params).locale);
  const t = await getTranslations('termsPage');
  const sections = (t.raw('sections') as LegalSection[]).map((section) => ({
    ...section,
    paragraphs: section.paragraphs?.map((text) => text.split('{privacyEmail}').join(PRIVACY_CONTACT_EMAIL).split('{productName}').join(FEATURED_PRODUCT.name)),
    bullets: section.bullets?.map((text) => text.split('{privacyEmail}').join(PRIVACY_CONTACT_EMAIL).split('{productName}').join(FEATURED_PRODUCT.name))
  }));
  return <LegalPage eyebrow={t('eyebrow')} title={t('title')} introduction={t('introduction', { productName: FEATURED_PRODUCT.name })} effectiveDate={t('effectiveDate')} sections={sections} contactEmail={PRIVACY_CONTACT_EMAIL} />;
}
