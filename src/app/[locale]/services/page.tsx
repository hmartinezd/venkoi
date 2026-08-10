import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import { InsightCard } from '@/components/insights/InsightCard';

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
  const t = await getTranslations({ locale: currentLocale, namespace: 'servicesPage' });

  return createMetadata({
    title: t('seoTitle'),
    description: t('seoDescription'),
    routeKey: 'services',
    locale: currentLocale
  });
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('servicesPage');
  const tArticles = await getTranslations('insightsArticles');
  const tInsights = await getTranslations('insightsPage');

  return (
    <>
      {/* Hero Section */}
      <Section variant="light" spacing="hero">
        <Container className="max-w-4xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-tight">
            {t('heading')}
          </h1>
          <p className="text-lg text-foreground-muted leading-relaxed max-w-3xl">
            {t('body')}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <TrackedButton
              href={getLocalizedPath('contact', currentLocale) + '?type=services'}
              variant="primary"
              eventName="services_cta"
              properties={{ locale: currentLocale, source: 'services_overview_hero' }}
            >
              {t('primaryCta')}
            </TrackedButton>
            <span className="text-xs font-semibold text-foreground-muted flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              {t('secondaryCue')}
            </span>
          </div>
        </Container>
      </Section>

      {/* Service 01 — Mobile Applications */}
      <Section variant="surface" className="border-y border-border">
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center rounded-md bg-orange-subtle px-3 py-1 text-xs font-bold text-orange-text uppercase tracking-wider">
              {t('mobileEyebrow')}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t('mobileTitle')}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              {t('mobileBody')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-orange-text">01</span>
              <h3 className="text-lg font-bold text-ink">{t('mobileTheme1')}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {t('mobileTheme1Desc')}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-orange-text">02</span>
              <h3 className="text-lg font-bold text-ink">{t('mobileTheme2')}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {t('mobileTheme2Desc')}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-orange-text">03</span>
              <h3 className="text-lg font-bold text-ink">{t('mobileTheme3')}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {t('mobileTheme3Desc')}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <TrackedButton
              href={getLocalizedPath('servicesMobile', currentLocale)}
              variant="secondary"
              eventName="services_cta"
              properties={{ locale: currentLocale, source: 'services_overview_mobile' }}
            >
              {t('exploreMobile')}
            </TrackedButton>
          </div>
        </Container>
      </Section>

      {/* Service 02 — Websites & Web Applications */}
      <Section variant="light">
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center rounded-md bg-orange-subtle px-3 py-1 text-xs font-bold text-orange-text uppercase tracking-wider">
              {t('webEyebrow')}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t('webTitle')}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              {t('webBody')}
            </p>
            <p className="text-sm text-foreground-muted/80 leading-relaxed italic">
              {t('webSupporting')}
            </p>
          </div>

          <div className="pt-2">
            <TrackedButton
              href={getLocalizedPath('servicesWeb', currentLocale)}
              variant="secondary"
              eventName="services_cta"
              properties={{ locale: currentLocale, source: 'services_overview_web' }}
            >
              {t('exploreWeb')}
            </TrackedButton>
          </div>
        </Container>
      </Section>

      {/* How We Work — Project Delivery Lifecycle */}
      <Section variant="surface" className="border-t border-border">
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {t('howWeWork.eyebrow')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t('howWeWork.heading')}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-orange-text">{t('howWeWork.stage1Num')}</span>
                <h3 className="text-lg font-bold text-ink">{t('howWeWork.stage1Title')}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {t('howWeWork.stage1Desc')}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-orange-text">{t('howWeWork.stage2Num')}</span>
                <h3 className="text-lg font-bold text-ink">{t('howWeWork.stage2Title')}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {t('howWeWork.stage2Desc')}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-orange-text">{t('howWeWork.stage3Num')}</span>
                <h3 className="text-lg font-bold text-ink">{t('howWeWork.stage3Title')}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {t('howWeWork.stage3Desc')}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-orange-text">{t('howWeWork.stage4Num')}</span>
                <h3 className="text-lg font-bold text-ink">{t('howWeWork.stage4Title')}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {t('howWeWork.stage4Desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-orange/30 bg-orange-subtle/50 p-4 sm:p-6 text-center max-w-3xl mx-auto">
            <p className="text-sm sm:text-base font-semibold text-ink">
              &ldquo;{t('howWeWork.testingPrinciple')}&rdquo;
            </p>
          </div>
        </Container>
      </Section>

      {/* Project Fit Section */}
      <Section variant="light" className="border-t border-border">
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {t('projectFit.eyebrow')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t('projectFit.heading')}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface p-6 flex flex-col justify-center">
                <p className="text-sm font-semibold text-ink leading-relaxed">
                  {t(`projectFit.item${i as 1 | 2 | 3}`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Helpful Guides Section */}
      <Section variant="light" spacing="compact" className="border-t border-border">
        <Container className="space-y-8">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {t('relatedGuides')}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <InsightCard
              locale={currentLocale}
              category={tArticles('startSoftwareProject.category')}
              title={tArticles('startSoftwareProject.title')}
              description={tArticles('startSoftwareProject.description')}
              routeKey="insightStartSoftwareProject"
              readMoreLabel={tInsights('readMore')}
            />
            <InsightCard
              locale={currentLocale}
              category={tArticles('websiteOrWebApp.category')}
              title={tArticles('websiteOrWebApp.title')}
              description={tArticles('websiteOrWebApp.description')}
              routeKey="insightWebsiteOrWebApp"
              readMoreLabel={tInsights('readMore')}
            />
          </div>
        </Container>
      </Section>

      {/* Idea / Approach Section */}
      <Section variant="dark" spacing="spacious" className="text-center">
        <Container className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
              {t('approachEyebrow')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t('ideaTitle')}
            </h2>
            <p className="text-base text-white/70 leading-relaxed max-w-xl mx-auto">
              {t('ideaBody')}
            </p>
          </div>

          <div className="rounded-full border border-white/20 bg-white/5 px-6 py-2 inline-block mb-8">
            <p className="text-xs sm:text-sm font-medium text-white/90">
              {t('differentiator')}
            </p>
          </div>

          <div className="pt-2">
            <TrackedButton
              href={getLocalizedPath('contact', currentLocale) + '?type=services'}
              variant="primary"
              className="bg-orange text-white hover:bg-orange/90"
              eventName="services_cta"
              properties={{ locale: currentLocale, source: 'services_overview_footer' }}
            >
              {t('ideaCta')}
            </TrackedButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
