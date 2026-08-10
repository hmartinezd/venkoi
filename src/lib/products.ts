export type ProductStatus = 'earlyAccess' | 'available' | 'comingSoon';

export type Product = {
  id: string;
  slug: string;
  name: string;
  routeKey: 'productsZaiko';
  analyticsProduct: 'zaiko';
  status: ProductStatus;
  shortDescription: string;
  demoEnabled: boolean;
  pricingEnabled: boolean;
};

export const FEATURED_PRODUCT = {
  id: 'zaiko',
  slug: 'zaiko',
  name: 'Zaiko',
  routeKey: 'productsZaiko',
  analyticsProduct: 'zaiko',
  status: 'earlyAccess',
  shortDescription: 'Restaurant inventory software for understanding inventory, purchases, activity, and costs.',
  demoEnabled: true,
  pricingEnabled: false
} satisfies Product;

export const PRODUCTS: Product[] = [FEATURED_PRODUCT];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getDemoEnabledProducts(): Product[] {
  return PRODUCTS.filter((product) => product.demoEnabled);
}

export function isDemoEnabledProduct(slug: string): boolean {
  return PRODUCTS.some((product) => product.slug === slug && product.demoEnabled);
}

export function getDefaultDemoProduct(): Product {
  const demoProducts = getDemoEnabledProducts();
  if (demoProducts.length === 0) {
    throw new Error('[Product Registry] No demo-enabled product found in product registry.');
  }
  return demoProducts[0];
}
