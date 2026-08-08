import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getLocalizedPath } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
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

  const t = await getTranslations('home');
  const common = await getTranslations('common');

  return (
    <>
      <Section className="pt-20 pb-24">
        <Container className="grid gap-12 lg:grid-cols-[55%_40%] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange">{t('eyebrow')}</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {t('heading')}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-foreground-muted sm:text-lg">{t('body')}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button href={getLocalizedPath('productsZaiko', currentLocale)}>{t('primaryCta')}</Button>
              <Button variant="secondary" href={getLocalizedPath('customSoftware', currentLocale)}>
                {t('secondaryCta')}
              </Button>
            </div>
            <p className="mt-8 text-sm text-foreground-muted">{common('location')}</p>
          </div>

          <div className="relative isolate">
            <div className="absolute inset-0 rounded-[32px] bg-surface p-8 shadow-card ring-1 ring-border" />
            <div className="relative space-y-6 rounded-[32px] border border-border bg-white p-8">
              <div className="h-64 rounded-[28px] bg-surface-muted" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-surface px-5 py-4">
                  <div className="h-3 w-14 rounded-full bg-orange-subtle" />
                  <p className="mt-4 text-sm font-semibold text-ink">VENKOI</p>
                  <p className="mt-2 text-sm text-foreground-muted">Platform foundation for product-ready software.</p>
                </div>
                <div className="rounded-3xl border border-border bg-surface px-5 py-4">
                  <div className="h-3 w-10 rounded-full bg-orange-subtle" />
                  <p className="mt-4 text-sm font-semibold text-ink">Zaiko</p>
                  <p className="mt-2 text-sm text-foreground-muted">Restaurant operations software architecture.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="muted" className="pb-24">
        <Container>
          <div className="grid gap-10 rounded-[28px] border border-border bg-surface p-8 sm:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange">Design System</p>
              <h2 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">A thoughtful foundation for future Venkoi pages.</h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-foreground-muted">
                This milestone establishes responsive layout, tokens, locale-aware routing, and the architecture for product pages and marketing content.
              </p>
            </div>
            <div className="space-y-4 rounded-[20px] border border-border bg-background p-6">
              <div className="rounded-3xl bg-surface p-5">
                <p className="text-sm font-semibold text-ink">Buttons</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-[14px] bg-ink px-4 py-2 text-sm font-semibold text-white">Primary</span>
                  <span className="inline-flex items-center rounded-[14px] border border-border px-4 py-2 text-sm font-semibold text-ink">Secondary</span>
                  <span className="inline-flex items-center rounded-[14px] px-4 py-2 text-sm font-semibold text-ink">Text CTA</span>
                </div>
              </div>
              <div className="rounded-3xl bg-surface p-5">
                <p className="text-sm font-semibold text-ink">Surfaces</p>
                <p className="mt-3 text-sm leading-6 text-foreground-muted">
                  Reusable cards and sections emphasize spacing, hierarchy, and subtle borders rather than decoration.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

