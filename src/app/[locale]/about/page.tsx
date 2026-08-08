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
  const t = await getTranslations({ locale: currentLocale, namespace: 'aboutPage' });
  const seo = await getTranslations({ locale: currentLocale, namespace: 'seo' });
  return createMetadata({
    title: `${t('eyebrow')} | ${seo('title')}`,
    description: t('body'),
    routeKey: 'about',
    locale: currentLocale
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('aboutPage');

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-14 pb-20 md:pt-20 md:pb-28">
        <Container className="max-w-4xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-tight">
            {t('heading')}
          </h1>
          <p className="text-lg text-foreground-muted leading-relaxed max-w-3xl">
            {t('body')}
          </p>
        </Container>
      </Section>

      {/* Product Direction */}
      <Section variant="surface" className="py-16 md:py-24 border-y border-border">
        <Container className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
              STRATEGIC DIRECTION
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t('productDirectionHeading')}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              {t('productDirectionBody')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-12 md:items-stretch">
            {/* Primary Strategic Pillar: Venkoi Products (Larger Column) */}
            <div className="md:col-span-7 rounded-2xl border-2 border-orange/40 bg-background p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-flex items-center rounded-md bg-orange-subtle px-3 py-1 text-xs font-bold text-orange uppercase tracking-wider">
                  PRIMARY STRATEGIC PILLAR
                </span>
                <h3 className="text-2xl font-bold text-ink">{t('venkoiProductsTitle')}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {t('venkoiProductsDesc')}
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <Button href={getLocalizedPath('productsZaiko', currentLocale)} variant="secondary">
                  Explore Zaiko
                </Button>
              </div>
            </div>

            {/* Secondary Pillar: Custom Software */}
            <div className="md:col-span-5 rounded-2xl border border-border bg-background p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
                  CLIENT SOLUTIONS
                </span>
                <h3 className="text-2xl font-bold text-ink">{t('customSoftwareTitle')}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {t('customSoftwareDesc')}
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <Button href={getLocalizedPath('customSoftware', currentLocale)} variant="secondary">
                  Custom Software Services
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Local / Global Idea */}
      <Section variant="light" className="py-16 md:py-24">
        <Container className="max-w-4xl space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
              FOUNDATION & EXPANSION
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t('localGlobalHeading')}
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 text-base text-foreground-muted leading-relaxed">
            <p>{t('localGlobalBody')}</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
