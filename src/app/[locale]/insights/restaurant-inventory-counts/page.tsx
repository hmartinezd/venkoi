import { RestaurantInsightGuide } from '@/components/insights/RestaurantInsightGuide';
import { locales, type Locale } from '@/i18n/config';
import { getProductSectionMarketingState } from '@/lib/product-marketing';
import { FEATURED_PRODUCT } from '@/lib/products';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ locale: string }> }
function localeOf(value: string): Locale { if (locales.includes(value as Locale)) return value as Locale; notFound(); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = localeOf((await params).locale);
  const t = await getTranslations({ locale, namespace: 'insightsArticles.restaurantInventoryCounts' });
  return createMetadata({ title: t('seoTitle', { productName: FEATURED_PRODUCT.name }), description: t('seoDescription'), routeKey: 'insightRestaurantInventoryCounts', locale, openGraphType: 'article' });
}

export default async function Page({ params }: Props) {
  const locale = localeOf((await params).locale);
  const t = await getTranslations('insightsArticles.restaurantInventoryCounts.content');
  const productState = getProductSectionMarketingState(['physical-counts']);
  const sections = [
    { id: 'expected', title: t('expectedTitle'), paragraphs: [t('expectedBody'), t('expectedBody2')] },
    { id: 'zero-uncounted', title: t('statesTitle'), paragraphs: [t('statesBody'), t('statesExample')] },
    { id: 'count-units', title: t('unitsTitle'), paragraphs: [t('unitsBody'), t('unitsBody2')] },
    { id: 'progress', title: t('progressTitle'), paragraphs: [t('progressBody')] },
    { id: 'variance', title: t('varianceTitle'), paragraphs: [t('varianceBody'), t('varianceBody2')] },
    { id: 'review', title: t('reviewTitle'), paragraphs: [t('reviewBody')] },
    { id: 'traceability', title: t('traceTitle'), paragraphs: [t('traceBody')] },
    ...(productState ? [{ id: 'product-approach', title: t('productTitle', { productName: FEATURED_PRODUCT.name }), paragraphs: [t(`productAvailability.${productState}`, { productName: FEATURED_PRODUCT.name })] }] : [])
  ];
  return <RestaurantInsightGuide locale={locale} routeKey="insightRestaurantInventoryCounts" articleKey="restaurantInventoryCounts" sections={sections} related={['restaurantInventory', 'restaurantFoodCost']} />;
}
