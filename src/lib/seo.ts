import type { Metadata } from 'next';
import { type Locale, locales } from '@/i18n/config';
import { getLocalizedPath, type RouteKey } from '@/i18n/routing';
import { getSiteOrigin, isProductionEnv } from '@/lib/site-config';

interface CreateMetadataOptions {
  title: string;
  description: string;
  routeKey: RouteKey;
  locale: Locale;
  noIndex?: boolean;
  openGraphType?: 'website' | 'article';
}

export function createMetadata({
  title,
  description,
  routeKey,
  locale,
  noIndex = false,
  openGraphType = 'website'
}: CreateMetadataOptions): Metadata {
  const origin = getSiteOrigin();
  const pathname = getLocalizedPath(routeKey, locale);
  const canonical = `${origin}${pathname}`;
  const enCanonical = `${origin}${getLocalizedPath(routeKey, 'en')}`;

  const languageAlternates = locales.reduce((result, next) => {
    return {
      ...result,
      [next]: `${origin}${getLocalizedPath(routeKey, next)}`
    };
  }, {} as Record<string, string>);

  const alternates = {
    canonical,
    languages: {
      ...languageAlternates,
      'x-default': enCanonical
    }
  };

  const isProd = isProductionEnv();
  const shouldIndex = !noIndex && isProd;

  return {
    title,
    description,
    metadataBase: new URL(origin),
    alternates,
    openGraph: {
      title,
      description,
      type: openGraphType,
      url: canonical,
      siteName: 'Venkoi'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    robots: {
      index: shouldIndex,
      follow: isProd,
      googleBot: {
        index: shouldIndex,
        follow: isProd
      }
    }
  };
}
