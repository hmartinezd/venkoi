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
  const content = t.raw('content');
  const productValues = { productName: FEATURED_PRODUCT.name };

  const ctaArea = (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <Button
        href={getLocalizedPath('productsZaiko', currentLocale)}
        variant="secondary"
      >
        {t('content.ctaExplore', productValues)}
      </Button>
      <TrackedButton
        href={buildProductDemoHref(currentLocale, FEATURED_PRODUCT)}
        variant="primary"
        eventName="zaiko_demo_cta"
        properties={{
          locale: currentLocale,
          product: FEATURED_PRODUCT.analyticsProduct,
          source: 'insight_restaurant_inventory'
        }}
      >
        {content.ctaDemo}
      </TrackedButton>
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
      ctaArea={ctaArea}
    >
      <p className="text-lg leading-relaxed text-foreground-muted mb-12">
        {content.intro}
      </p>

      <ArticleSection title={content.problemTitle}>
        <p>{content.problemBody}</p>
      </ArticleSection>

      <ArticleSection title={content.purchasesTitle}>
        <p>{content.purchasesBody}</p>
      </ArticleSection>

      <ArticleSection title={content.quantitiesTitle}>
        <p>{content.quantitiesBody}</p>
      </ArticleSection>

      <ArticleSection title={content.activityTitle}>
        <p>{content.activityBody}</p>
      </ArticleSection>

      <ArticleSection title={content.costsTitle}>
        <p>{content.costsBody}</p>
      </ArticleSection>

      <ArticleSection title={content.togetherTitle}>
        <p>{content.togetherBody}</p>
      </ArticleSection>

      <ArticleSection title={t('content.zaikoTitle', productValues)}>
        <p>{t('content.zaikoBody', productValues)}</p>
      </ArticleSection>
    </InsightArticle>
  );
}
