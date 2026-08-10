import {
  generateSocialCardResponse,
  socialCardSize,
  socialCardContentType
} from '@/lib/social-card';
import { FEATURED_PRODUCT } from '@/lib/products';

export const runtime = 'nodejs';

export const alt = `${FEATURED_PRODUCT.name} by Venkoi`;
export const size = socialCardSize;
export const contentType = socialCardContentType;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generateSocialCardResponse({ locale, variant: 'zaiko', productName: FEATURED_PRODUCT.name });
}
