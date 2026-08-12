import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import type { Product } from '@/lib/products';

type ProductDemoLinkOptions = {
  interest?: 'early-access';
  source?: DemoConversionSource;
};

export const DEMO_CONVERSION_SOURCES = [
  'header',
  'home_hero',
  'home_product',
  'home_final_cta',
  'product_nav',
  'product_hero',
  'product_explorer',
  'product_early_access',
  'product_final_cta',
  'footer',
  'about',
  'insight',
  'contact_escape'
] as const;

export type DemoConversionSource = (typeof DEMO_CONVERSION_SOURCES)[number];

export function normalizeDemoConversionSource(
  source: string | string[] | null | undefined
): DemoConversionSource | undefined {
  return typeof source === 'string' && DEMO_CONVERSION_SOURCES.includes(source as DemoConversionSource)
    ? source as DemoConversionSource
    : undefined;
}

export function buildProductDemoHref(
  locale: Locale,
  product: Pick<Product, 'slug'>,
  options: ProductDemoLinkOptions = {}
): string {
  const searchParams = new URLSearchParams({ product: product.slug });

  if (options.interest) {
    searchParams.set('interest', options.interest);
  }

  if (options.source) {
    searchParams.set('source', options.source);
  }

  return `${getLocalizedPath('demo', locale)}?${searchParams.toString()}`;
}
