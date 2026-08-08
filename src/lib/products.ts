export type ProductStatus = 'available' | 'comingSoon';

export type Product = {
  id: 'zaiko';
  slug: 'zaiko';
  name: string;
  status: ProductStatus;
  shortDescription: string;
  demoEnabled: boolean;
  pricingEnabled: false;
};

export const PRODUCTS: Product[] = [
  {
    id: 'zaiko',
    slug: 'zaiko',
    name: 'Zaiko',
    status: 'available',
    shortDescription: 'Restaurant inventory and operations software built for teams that move fast.',
    demoEnabled: true,
    pricingEnabled: false
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}
