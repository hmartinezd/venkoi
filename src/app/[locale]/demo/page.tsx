import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
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
  const t = await getTranslations({ locale: currentLocale, namespace: 'demoPage' });
  const seo = await getTranslations({ locale: currentLocale, namespace: 'seo' });
  return createMetadata({
    title: `${t('eyebrow')} | ${seo('title')}`,
    description: t('body'),
    routeKey: 'demo',
    locale: currentLocale
  });
}

export default async function DemoPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('demoPage');

  return (
    <Section variant="light" className="pt-14 pb-20 md:pt-20 md:pb-28">
      <Container className="max-w-4xl space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
              {t('eyebrow')}
            </span>
            <span className="inline-flex items-center rounded-md bg-orange-subtle px-2.5 py-0.5 text-[11px] font-bold text-orange uppercase tracking-wider">
              {t('badge')}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-tight">
            {t('heading')}
          </h1>
          <p className="text-lg text-foreground-muted leading-relaxed max-w-2xl">
            {t('body')}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-ink">{t('earlyAccessTitle')}</h2>
            <p className="text-sm text-foreground-muted leading-relaxed">{t('badgeText')}</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
            <Button href={getLocalizedPath('contact', currentLocale)} variant="primary">
              {t('contactCta')}
            </Button>
            <Button href={getLocalizedPath('productsZaiko', currentLocale)} variant="secondary">
              {t('zaikoCta')}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

