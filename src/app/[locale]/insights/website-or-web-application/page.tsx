import { InsightArticle, ArticleSection } from '@/components/insights/InsightArticle';
import { InsightCard } from '@/components/insights/InsightCard';
import { Button } from '@/components/ui/Button';
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
  const t = await getTranslations({ locale: currentLocale, namespace: 'insightsArticles.websiteOrWebApp' });

  return createMetadata({
    title: t('seoTitle'),
    description: t('seoDescription'),
    routeKey: 'insightWebsiteOrWebApp',
    locale: currentLocale,
    openGraphType: 'article'
  });
}

export default async function WebsiteOrWebAppArticle({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);

  const t = await getTranslations('insightsArticles.websiteOrWebApp');
  const tRelated = await getTranslations('insightsArticles');
  const tInsights = await getTranslations('insightsPage');
  const content = t.raw('content');

  const ctaArea = (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <TrackedButton
        href={getLocalizedPath('contact', currentLocale) + '?type=services&interest=web'}
        variant="primary"
        eventName="services_cta"
        properties={{
          locale: currentLocale,
          source: 'insight_web_decision',
          interest: 'web'
        }}
      >
        {content.cta}
      </TrackedButton>
      <Button
        href={getLocalizedPath('servicesWeb', currentLocale)}
        variant="secondary"
      >
        {content.secondaryCta}
      </Button>
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
          category={tRelated('startSoftwareProject.category')}
          title={tRelated('startSoftwareProject.title')}
          description={tRelated('startSoftwareProject.description')}
          routeKey="insightStartSoftwareProject"
          readMoreLabel={tInsights('readMore')}
        />
      </div>
    </div>
  );

  return (
    <InsightArticle
      locale={currentLocale}
      routeKey="insightWebsiteOrWebApp"
      title={t('title')}
      description={t('description')}
      category={t('category')}
      breadcrumbLabelKey="insightWebsiteOrWebApp"
      ctaArea={ctaArea}
      relatedGuides={relatedGuides}
    >
      <p className="text-lg leading-relaxed text-foreground-muted mb-12">
        {content.intro}
      </p>

      <ArticleSection title={content.websiteTitle}>
        <p>{content.websiteBody}</p>
      </ArticleSection>

      <ArticleSection title={content.webappTitle}>
        <p>{content.webappBody}</p>
      </ArticleSection>

      <ArticleSection title={content.betweenTitle}>
        <p>{content.betweenBody}</p>
      </ArticleSection>

      <ArticleSection title={content.questionsTitle}>
        <p>{content.questionsBody}</p>
      </ArticleSection>

      <ArticleSection title={content.outcomeTitle}>
        <p>{content.outcomeBody}</p>
      </ArticleSection>
    </InsightArticle>
  );
}
