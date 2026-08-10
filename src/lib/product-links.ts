import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import type { Product } from '@/lib/products';

type ProductDemoLinkOptions = {
  interest?: 'early-access';
};

export function buildProductDemoHref(
  locale: Locale,
  product: Pick<Product, 'slug'>,
  options: ProductDemoLinkOptions = {}
): string {
  const searchParams = new URLSearchParams({ product: product.slug });

  if (options.interest) {
    searchParams.set('interest', options.interest);
  }

  return `${getLocalizedPath('demo', locale)}?${searchParams.toString()}`;
}
