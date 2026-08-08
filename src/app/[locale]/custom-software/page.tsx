import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
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
  const t = await getTranslations({ locale: currentLocale, namespace: 'customSoftware' });
  const seo = await getTranslations({ locale: currentLocale, namespace: 'seo' });
  return createMetadata({
    title: `${t('title')} | ${seo('title')}`,
    description: t('intro'),
    routeKey: 'customSoftware',
    locale: currentLocale
  });
}

export default async function CustomSoftwarePage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('customSoftware');

  return (
    <Section className="pt-20 pb-24">
      <Container className="max-w-4xl space-y-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange">{t('title')}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{t('title')}</h1>
          <p className="text-lg leading-8 text-foreground-muted">{t('intro')}</p>
        </div>
        <div className="rounded-[28px] border border-border bg-surface p-10">
          <p className="text-base leading-8 text-foreground-muted">{t('placeholder')}</p>
        </div>
      </Container>
    </Section>
  );
}

