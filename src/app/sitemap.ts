import type { MetadataRoute } from 'next';
import { getSiteOrigin } from '@/lib/site-config';
import { getLocalizedPath, type RouteKey } from '@/i18n/routing';
import { locales } from '@/i18n/config';

const sitemapRoutes: RouteKey[] = [
  'home',
  'productsZaiko',
  'services',
  'about',
  'contact'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  const lastModified = new Date();

  const items: MetadataRoute.Sitemap = [];

  for (const routeKey of sitemapRoutes) {
    for (const locale of locales) {
      const path = getLocalizedPath(routeKey, locale);
      const url = `${origin}${path}`;

      const languages: Record<string, string> = {};
      for (const loc of locales) {
        languages[loc] = `${origin}${getLocalizedPath(routeKey, loc)}`;
      }
      languages['x-default'] = `${origin}${getLocalizedPath(routeKey, 'en')}`;

      items.push({
        url,
        lastModified,
        changeFrequency: routeKey === 'home' ? 'weekly' : 'monthly',
        priority: routeKey === 'home' ? 1.0 : routeKey === 'productsZaiko' ? 0.9 : 0.8,
        alternates: {
          languages
        }
      });
    }
  }

  return items;
}
