import { TrackedButton } from '@/components/analytics/TrackedButton';
import { ArticleSection, InsightArticle } from '@/components/insights/InsightArticle';
import { RelatedInsights } from '@/components/insights/RelatedInsights';
import { Button } from '@/components/ui/Button';
import { type Locale } from '@/i18n/config';
import { getLocalizedPath, type RouteKey } from '@/i18n/routing';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';
import { getTranslations } from 'next-intl/server';

type ArticleKey = 'restaurantInventoryCounts' | 'restaurantFoodCost' | 'restaurantSupplierPrices';
interface SectionDefinition { id: string; title: string; paragraphs: string[] }
type RelatedArticleKey = ArticleKey | 'restaurantInventory';
interface Props { locale: Locale; routeKey: RouteKey; articleKey: ArticleKey; sections: SectionDefinition[]; related: RelatedArticleKey[] }

const routeByArticle = {
  restaurantInventory: 'insightRestaurantInventory',
  restaurantInventoryCounts: 'insightRestaurantInventoryCounts',
  restaurantFoodCost: 'insightRestaurantFoodCost',
  restaurantSupplierPrices: 'insightRestaurantSupplierPrices'
} as const;

export async function RestaurantInsightGuide({ locale, routeKey, articleKey, sections, related }: Props) {
  const t = await getTranslations(`insightsArticles.${articleKey}`);
  const tArticles = await getTranslations('insightsArticles');
  const tInsights = await getTranslations('insightsPage');
  const values = { productName: FEATURED_PRODUCT.name };
  return <InsightArticle locale={locale} routeKey={routeKey} title={t('title')} description={t('description')} category={t('category')} breadcrumbLabelKey={routeKey} sections={sections.map(({ id, title }) => ({ id, label: title }))} guideNavigationLabel={tArticles('inThisGuide')} backToInsightsLabel={tArticles('backToInsights')}
    ctaArea={<div className="flex flex-col gap-4 sm:flex-row"><TrackedButton href={buildProductDemoHref(locale, FEATURED_PRODUCT, { source: 'insight' })} variant="primary" eventName="zaiko_demo_cta" properties={{ locale, product: FEATURED_PRODUCT.analyticsProduct, source: 'insight' }}>{t('content.ctaDemo')}</TrackedButton><Button href={getLocalizedPath('productsZaiko', locale)} variant="secondary">{t('content.ctaExplore', values)}</Button></div>}
    relatedInsights={<RelatedInsights locale={locale} heading={tArticles('relatedGuides')} readMoreLabel={tInsights('readMore')} articles={related.map((key) => ({ routeKey: routeByArticle[key], category: tArticles(`${key}.category`), title: tArticles(`${key}.title`), description: tArticles(`${key}.description`) }))} />}>
    <p className="mb-12 text-lg leading-relaxed text-foreground-muted">{t('content.intro')}</p>
    {sections.map((section) => <ArticleSection key={section.id} id={section.id} title={section.title}>{section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</ArticleSection>)}
  </InsightArticle>;
}
