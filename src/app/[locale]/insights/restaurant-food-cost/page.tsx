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
export async function generateMetadata({ params }: Props): Promise<Metadata> { const locale = localeOf((await params).locale); const t = await getTranslations({ locale, namespace: 'insightsArticles.restaurantFoodCost' }); return createMetadata({ title: t('seoTitle'), description: t('seoDescription'), routeKey: 'insightRestaurantFoodCost', locale, openGraphType: 'article' }); }

export default async function Page({ params }: Props) {
  const locale = localeOf((await params).locale);
  const t = await getTranslations('insightsArticles.restaurantFoodCost.content');
  const productState = getProductSectionMarketingState(['vendor-price-intelligence', 'preparation-costing', 'menu-costing']);
  const sections = [
    { id: 'supplier-package', title: t('packageTitle'), paragraphs: [t('packageBody')] }, { id: 'normalized-cost', title: t('normalizedTitle'), paragraphs: [t('normalizedBody'), t('normalizedBody2')] }, { id: 'preparations', title: t('preparationTitle'), paragraphs: [t('preparationBody')] }, { id: 'yield', title: t('yieldTitle'), paragraphs: [t('yieldBody')] }, { id: 'menu-cost', title: t('menuTitle'), paragraphs: [t('menuBody')] }, { id: 'food-cost-percentage', title: t('percentageTitle'), paragraphs: [t('percentageBody'), t('percentageBody2')] }, { id: 'cost-coverage', title: t('coverageTitle'), paragraphs: [t('coverageBody')] },
    ...(productState ? [{ id: 'product-approach', title: t('productTitle', { productName: FEATURED_PRODUCT.name }), paragraphs: [t(`productAvailability.${productState}`, { productName: FEATURED_PRODUCT.name })] }] : [])
  ];
  return <RestaurantInsightGuide locale={locale} routeKey="insightRestaurantFoodCost" articleKey="restaurantFoodCost" sections={sections} related={['restaurantSupplierPrices', 'restaurantInventory', 'restaurantInventoryCounts']} />;
}
