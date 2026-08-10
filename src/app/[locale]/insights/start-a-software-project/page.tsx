import { InsightArticle, ArticleSection } from '@/components/insights/InsightArticle';
import { RelatedInsights } from '@/components/insights/RelatedInsights';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
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

  const t = await getTranslations('insightsArticles.startSoftwareProject');
  const tRelated = await getTranslations('insightsArticles');
  const tInsights = await getTranslations('insightsPage');
  const content = t.raw('content');
  const sections = [
    { id: 'problem', label: content.problemTitle },
    { id: 'users', label: content.usersTitle },
    { id: 'workflow', label: content.workflowTitle },
    { id: 'existing-context', label: content.existingTitle },
    { id: 'priorities', label: content.prioritiesTitle },
    { id: 'process', label: content.processTitle }
  ];

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

  return (
    <InsightArticle
      locale={currentLocale}
      routeKey="insightStartSoftwareProject"
      title={t('title')}
      description={t('description')}
      category={t('category')}
      breadcrumbLabelKey="insightStartSoftwareProject"
      sections={sections}
      guideNavigationLabel={tRelated('inThisGuide')}
      backToInsightsLabel={tRelated('backToInsights')}
      ctaArea={ctaArea}
      relatedInsights={(
        <RelatedInsights locale={currentLocale} heading={tRelated('relatedGuides')} readMoreLabel={tInsights('readMore')} articles={[
          { routeKey: 'insightRestaurantInventory', category: tRelated('restaurantInventory.category'), title: tRelated('restaurantInventory.title'), description: tRelated('restaurantInventory.description') },
          { routeKey: 'insightWebsiteOrWebApp', category: tRelated('websiteOrWebApp.category'), title: tRelated('websiteOrWebApp.title'), description: tRelated('websiteOrWebApp.description') }
        ]} />
      )}
    >
      <p className="text-lg leading-relaxed text-foreground-muted mb-12">
        {content.intro}
      </p>

      <ArticleSection id="problem" title={content.problemTitle}>
        <p>{content.problemBody}</p>
      </ArticleSection>

      <ArticleSection id="users" title={content.usersTitle}>
        <p>{content.usersBody}</p>
      </ArticleSection>

      <ArticleSection id="workflow" title={content.workflowTitle}>
        <p>{content.workflowBody}</p>
      </ArticleSection>

      <ArticleSection id="existing-context" title={content.existingTitle}>
        <p>{content.existingBody}</p>
      </ArticleSection>

      <ArticleSection id="priorities" title={content.prioritiesTitle}>
        <p>{content.prioritiesBody}</p>
      </ArticleSection>

      <ArticleSection id="process" title={content.processTitle}>
        <p>{content.processBody}</p>
      </ArticleSection>
    </InsightArticle>
  );
}
