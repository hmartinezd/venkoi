import type { Metadata } from 'next';
import { Locale, locales } from '@/i18n/config';
import { getLocalizedPath, localizedRoutes } from '@/i18n/routing';

export function createMetadata({ title, description, routeKey, locale }: { title: string; description: string; routeKey: keyof typeof localizedRoutes; locale: Locale; }): Metadata {
  const origin = 'https://venkoi.com';
  const pathname = getLocalizedPath(routeKey, locale);
  const canonical = `${origin}${pathname}`;
  const alternates = {
    canonical,
    languages: locales.reduce((result, next) => {
      return {
        ...result,
        [next]: `${origin}${getLocalizedPath(routeKey, next)}`
      };
    }, {} as Record<string, string>)
  };

  return {
    title,
    description,
    metadataBase: new URL(origin),
    alternates,
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    robots: {
      index: true,
      follow: true
    }
  };
}
