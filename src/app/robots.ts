import type { MetadataRoute } from 'next';
import { getSiteOrigin, isProductionEnv } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  const isProd = isProductionEnv();

  if (!isProd) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/'
      }
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/']
    },
    sitemap: `${origin}/sitemap.xml`
  };
}
