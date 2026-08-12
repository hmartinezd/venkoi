import { InsightArticle, ArticleSection } from '@/components/insights/InsightArticle';
import { Button } from '@/components/ui/Button';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import { RelatedInsights } from '@/components/insights/RelatedInsights';

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
  const t = await getTranslations({ locale: currentLocale, namespace: 'insightsArticles.restaurantInventory' });

  return createMetadata({
    title: t('seoTitle', { productName: FEATURED_PRODUCT.name }),
    description: t('seoDescription'),
    routeKey: 'insightRestaurantInventory',
    locale: currentLocale,
    openGraphType: 'article'
  });
}

export default async function RestaurantInventoryArticle({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);

  const t = await getTranslations('insightsArticles.restaurantInventory');
  const tArticles = await getTranslations('insightsArticles');
  const tInsights = await getTranslations('insightsPage');
  const content = t.raw('content');
  const productValues = { productName: FEATURED_PRODUCT.name };
  const sections = [
    { id: 'problem', label: content.problemTitle },
    { id: 'purchases', label: content.purchasesTitle },
    { id: 'quantities', label: content.quantitiesTitle },
    { id: 'activity', label: content.activityTitle },
    { id: 'costs', label: content.costsTitle },
    { id: 'together', label: content.togetherTitle },
    { id: 'product-approach', label: t('content.zaikoTitle', productValues) }
  ];

  const ctaArea = (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <TrackedButton
        href={buildProductDemoHref(currentLocale, FEATURED_PRODUCT, { source: 'insight' })}
        variant="primary"
        eventName="zaiko_demo_cta"
        properties={{
          locale: currentLocale,
          product: FEATURED_PRODUCT.analyticsProduct,
          source: 'insight'
        }}
      >
        {content.ctaDemo}
      </TrackedButton>
      <Button
        href={getLocalizedPath('productsZaiko', currentLocale)}
        variant="secondary"
      >
        {t('content.ctaExplore', productValues)}
      </Button>
    </div>
  );

  return (
    <InsightArticle
      locale={currentLocale}
      routeKey="insightRestaurantInventory"
      title={t('title')}
      description={t('description')}
      category={t('category')}
      breadcrumbLabelKey="insightRestaurantInventory"
      sections={sections}
      guideNavigationLabel={tArticles('inThisGuide')}
      backToInsightsLabel={tArticles('backToInsights')}
      ctaArea={ctaArea}
      relatedInsights={(
        <RelatedInsights
          locale={currentLocale}
          heading={tArticles('relatedGuides')}
          readMoreLabel={tInsights('readMore')}
          articles={[
            {
              routeKey: 'insightStartSoftwareProject',
              category: tArticles('startSoftwareProject.category'),
              title: tArticles('startSoftwareProject.title'),
              description: tArticles('startSoftwareProject.description')
            },
            {
              routeKey: 'insightWebsiteOrWebApp',
              category: tArticles('websiteOrWebApp.category'),
              title: tArticles('websiteOrWebApp.title'),
              description: tArticles('websiteOrWebApp.description')
            }
          ]}
        />
      )}
    >
      <p className="text-lg leading-relaxed text-foreground-muted mb-12">
        {content.intro}
      </p>

      <ArticleSection id="problem" title={content.problemTitle}>
        <p>{content.problemBody}</p>
      </ArticleSection>

      <ArticleSection id="purchases" title={content.purchasesTitle}>
        <p>{content.purchasesBody}</p>
      </ArticleSection>

      <ArticleSection id="quantities" title={content.quantitiesTitle}>
        <p>{content.quantitiesBody}</p>
      </ArticleSection>

      <ArticleSection id="activity" title={content.activityTitle}>
        <p>{content.activityBody}</p>
      </ArticleSection>

      <ArticleSection id="costs" title={content.costsTitle}>
        <p>{content.costsBody}</p>
      </ArticleSection>

      <ArticleSection id="together" title={content.togetherTitle}>
        <p>{content.togetherBody}</p>
      </ArticleSection>

      <ArticleSection id="product-approach" title={t('content.zaikoTitle', productValues)}>
        <p>{t('content.zaikoBody', productValues)}</p>
      </ArticleSection>
    </InsightArticle>
  );
}
