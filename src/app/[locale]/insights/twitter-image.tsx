import {
  generateSocialCardResponse,
  socialCardSize,
  socialCardContentType
} from '@/lib/social-card';

export const runtime = 'nodejs';

export const alt = 'Venkoi Insights — Practical guides for better software';
export const size = socialCardSize;
export const contentType = socialCardContentType;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generateSocialCardResponse({ locale, variant: 'insights' });
}
