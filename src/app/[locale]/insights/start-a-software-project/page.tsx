import { InsightArticle, ArticleSection } from '@/components/insights/InsightArticle';
import { InsightCard } from '@/components/insights/InsightCard';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
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
  const t = await getTranslations({ locale: currentLocale, namespace: 'insightsArticles.startSoftwareProject' });

  return createMetadata({
    title: t('seoTitle'),
    description: t('seoDescription'),
    routeKey: 'insightStartSoftwareProject',
    locale: currentLocale,
    openGraphType: 'article'
  });
}

export default async function StartSoftwareProjectArticle({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('insightsArticles.startSoftwareProject');
  const tRelated = await getTranslations('insightsArticles');
  const tInsights = await getTranslations('insightsPage');
  const content = t.raw('content');

  const ctaArea = (
    <div>
      <TrackedButton
        href={getLocalizedPath('contact', currentLocale) + '?type=services&interest=unsure'}
        variant="primary"
        eventName="services_cta"
        properties={{
          locale: currentLocale,
          source: 'insight_start_software_project',
          interest: 'unsure'
        }}
      >
        {content.cta}
      </TrackedButton>
    </div>
  );

  const relatedGuides = (
    <div className="space-y-8">
      <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
        {tRelated('relatedGuides')}
      </h2>
      <div className="max-w-md">
        <InsightCard
          locale={currentLocale}
          category={tRelated('websiteOrWebApp.category')}
          title={tRelated('websiteOrWebApp.title')}
          description={tRelated('websiteOrWebApp.description')}
          routeKey="insightWebsiteOrWebApp"
          readMoreLabel={tInsights('readMore')}
        />
      </div>
    </div>
  );

  return (
    <InsightArticle
      locale={currentLocale}
      routeKey="insightStartSoftwareProject"
      title={t('title')}
      description={t('description')}
      category={t('category')}
      breadcrumbLabelKey="insightStartSoftwareProject"
      ctaArea={ctaArea}
      relatedGuides={relatedGuides}
    >
      <p className="text-lg leading-relaxed text-foreground-muted mb-12">
        {content.intro}
      </p>

      <ArticleSection title={content.problemTitle}>
        <p>{content.problemBody}</p>
      </ArticleSection>

      <ArticleSection title={content.usersTitle}>
        <p>{content.usersBody}</p>
      </ArticleSection>

      <ArticleSection title={content.workflowTitle}>
        <p>{content.workflowBody}</p>
      </ArticleSection>

      <ArticleSection title={content.existingTitle}>
        <p>{content.existingBody}</p>
      </ArticleSection>

      <ArticleSection title={content.prioritiesTitle}>
        <p>{content.prioritiesBody}</p>
      </ArticleSection>

      <ArticleSection title={content.processTitle}>
        <p>{content.processBody}</p>
      </ArticleSection>
    </InsightArticle>
  );
}
