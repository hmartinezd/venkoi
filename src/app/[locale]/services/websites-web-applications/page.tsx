import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ServiceProcess } from '@/components/services/ServiceProcess';
import { ServiceCta } from '@/components/services/ServiceCta';
import { ServiceStartingPoint } from '@/components/services/ServiceStartingPoint';
import { ServiceFaq } from '@/components/services/ServiceFaq';
import { InsightCard } from '@/components/insights/InsightCard';
import { TrackedButton } from '@/components/analytics/TrackedButton';

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
  const t = await getTranslations({ locale: currentLocale, namespace: 'webServicePage' });

  return createMetadata({
    title: t('seoTitle'),
    description: t('seoDescription'),
    routeKey: 'servicesWeb',
    locale: currentLocale
  });
}

export default async function WebServicePage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('webServicePage');
  const tArticles = await getTranslations('insightsArticles');
  const tInsights = await getTranslations('insightsPage');
  const tPage = await getTranslations();

  const faqItems = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
  ];

  return (
    <>
      <Section variant="light" className="pt-10 pb-20 md:pt-14 md:pb-28">
        <Container>
          <Breadcrumbs
            locale={currentLocale}
            items={[
              { labelKey: 'services', routeKey: 'services' },
              { labelKey: 'webApplications', isCurrent: true },
            ]}
          />

          <div className="max-w-4xl space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
              {t('eyebrow')}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-tight">
              {t('heroHeading')}
            </h1>
            <p className="text-lg text-foreground-muted leading-relaxed max-w-3xl">
              {t('heroBody')}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <TrackedButton
                href={getLocalizedPath('contact', currentLocale) + '?type=services&interest=web'}
                variant="primary"
                eventName="services_cta"
                properties={{ locale: currentLocale, source: 'web_detail_hero' }}
              >
                {t('primaryCta')}
              </TrackedButton>
            </div>
          </div>
        </Container>
      </Section>

      {/* Range Section */}
      <Section variant="surface" className="py-16 md:py-24 border-y border-border">
        <Container>
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-6">
              {t('rangeHeading')}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-background border border-border p-6 rounded-2xl flex items-start gap-4">
                <div className="h-2 w-2 rounded-full bg-orange mt-2 shrink-0" />
                <span className="text-sm font-semibold text-ink leading-relaxed">
                  {t(`rangeItem${i as 1 | 2 | 3 | 4 | 5}`)}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* No Tech Section */}
      <Section variant="light" className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              {t('noTechHeading')}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              {t('noTechBody')}
            </p>
          </div>
        </Container>
      </Section>

      <ServiceProcess heading={t('processHeading')} />

      {/* Existing Project Section */}
      <Section variant="light" className="py-16 md:py-24 border-t border-border/50">
        <Container>
          <div className="max-w-3xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              {t('existingHeading')}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              {t('existingBody')}
            </p>
          </div>
        </Container>
      </Section>

      <ServiceStartingPoint
        locale={currentLocale}
        heading={t('startingPoint.heading')}
        body={t('startingPoint.body')}
        prompts={[
          t('startingPoint.prompt1'),
          t('startingPoint.prompt2'),
          t('startingPoint.prompt3'),
          t('startingPoint.prompt4'),
        ]}
        ctaText={t('startingPoint.cta')}
        ctaInterest="web"
        ctaSource="web_starting_point"
      />

      {/* Related Guide */}
      <Section variant="surface" className="py-16 md:py-24 border-t border-border/50">
        <Container className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
              {t('relatedGuideLabel')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              {tArticles('websiteOrWebApp.title')}
            </h2>
          </div>
          <div className="max-w-2xl">
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

      <ServiceFaq heading={t('faq.heading')} items={faqItems} />

      <ServiceCta
        locale={currentLocale}
        heading={tPage('home.finalCta.heading')}
        body={tPage('home.finalCta.body')}
        cta={t('primaryCta')}
        interest="web"
      />
    </>
  );
}
