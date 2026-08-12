import type { Metadata } from 'next';
import { locales, type Locale } from '../src/i18n/config';
import { getLocalizedPath, type RouteKey } from '../src/i18n/routing';
import { createMetadata } from '../src/lib/seo';
import { getSiteOrigin } from '../src/lib/site-config';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FEATURED_PRODUCT, productPlatformToSchemaOperatingSystem } from '../src/lib/products';

const sitemapRouteKeys: RouteKey[] = [
  'home',
  'productsZaiko',
  'services',
  'servicesMobile',
  'servicesWeb',
  'about',
  'contact',
  'privacy',
  'terms',
  'insights',
  'insightRestaurantInventory',
  'insightStartSoftwareProject',
  'insightWebsiteOrWebApp'
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function getProperty(value: unknown, property: string): unknown {
  return isRecord(value) ? value[property] : undefined;
}

function normalizeUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

function getCanonical(metadata: Metadata): string | undefined {
  const canonical = metadata.alternates?.canonical;
  return typeof canonical === 'string' ? canonical : undefined;
}

function getLanguageAlternate(metadata: Metadata, language: Locale | 'x-default'): string | undefined {
  const alternate = metadata.alternates?.languages?.[language];
  return typeof alternate === 'string' ? alternate : undefined;
}

export function testSeoRegression() {
  console.log('=== RUNNING SEO REGRESSION TESTS ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  const origVercelEnv = process.env.VERCEL_ENV;
  const origNodeEnv = process.env.NODE_ENV;
  const origSiteUrl = process.env.SITE_URL;

  const setEnv = (key: string, value: string | undefined) => {
    if (value === undefined) {
      delete (process.env as Record<string, string | undefined>)[key];
    } else {
      (process.env as Record<string, string | undefined>)[key] = value;
    }
  };

  const origin = 'https://venkoi.com';
  const expectedUrl = (routeKey: RouteKey, locale: Locale) =>
    `${origin}${getLocalizedPath(routeKey, locale)}`;

  function assertRouteMetadata(routeKey: RouteKey, locale: Locale, label: string) {
    const metadata = createMetadata({
      title: label,
      description: 'Desc',
      routeKey,
      locale
    });

    assert(
      normalizeUrl(getCanonical(metadata) ?? '') === normalizeUrl(expectedUrl(routeKey, locale)),
      `${label} canonical matches localized route`
    );
    for (const alternateLocale of locales) {
      assert(
        normalizeUrl(getLanguageAlternate(metadata, alternateLocale) ?? '') ===
          normalizeUrl(expectedUrl(routeKey, alternateLocale)),
        `${label} ${alternateLocale.toUpperCase()} alternate matches localized route`
      );
    }
    assert(
      normalizeUrl(getLanguageAlternate(metadata, 'x-default') ?? '') ===
        normalizeUrl(expectedUrl(routeKey, 'en')),
      `${label} x-default matches English localized route`
    );
  }

  try {
    setEnv('SITE_URL', origin);
    assert(getSiteOrigin() === origin, 'SEO suite uses the canonical production origin');

    const metadata = createMetadata({
      title: 'Home',
      description: 'Desc',
      routeKey: 'home',
      locale: 'en'
    });

    assert(getProperty(metadata.openGraph, 'type') === 'website', 'Default metadata uses type: website');
    assert(getProperty(metadata.openGraph, 'siteName') === 'Venkoi', 'OpenGraph siteName is Venkoi');
    assert(getProperty(metadata.twitter, 'card') === 'summary_large_image', 'Twitter card is summary_large_image');

    const productPage = readFileSync(resolve(process.cwd(), 'src/app/[locale]/products/zaiko/page.tsx'), 'utf8');
    assert(productPage.includes("'@type': 'SoftwareApplication'"), 'Product SoftwareApplication JSON-LD remains present');
    assert(productPage.includes('name: FEATURED_PRODUCT.name'), 'Product JSON-LD name remains registry-driven');
    assert(
      productPage.includes("getLocalizedPath('productsZaiko', currentLocale)"),
      'Product JSON-LD URL remains localized and canonical'
    );
    assert(
      productPage.includes('productPlatformToSchemaOperatingSystem(FEATURED_PRODUCT.platform)'),
      'Product JSON-LD derives its platform from the registry'
    );
    const schemaPlatform = productPlatformToSchemaOperatingSystem(FEATURED_PRODUCT.platform);
    assert(schemaPlatform === 'Android', 'Product JSON-LD platform identifies Android');
    assert(schemaPlatform !== 'Web', 'Product JSON-LD platform does not identify Web');
    assert(schemaPlatform !== 'iOS', 'Product JSON-LD platform does not identify iOS');

    const articleMetadata = createMetadata({
      title: 'Article',
      description: 'Desc',
      routeKey: 'insightRestaurantInventory',
      locale: 'en',
      openGraphType: 'article'
    });
    assert(getProperty(articleMetadata.openGraph, 'type') === 'article', 'Explicit openGraphType article works');

    assertRouteMetadata('home', 'en', 'Home EN');
    assertRouteMetadata('home', 'es', 'Home ES');
    assertRouteMetadata('productsZaiko', 'en', 'Zaiko EN');
    assertRouteMetadata('productsZaiko', 'es', 'Zaiko ES');
    assertRouteMetadata('insightRestaurantInventory', 'en', 'Insight article EN');
    assertRouteMetadata('insightRestaurantInventory', 'es', 'Insight article ES');
    assertRouteMetadata('privacy', 'en', 'Privacy EN');
    assertRouteMetadata('privacy', 'es', 'Privacy ES');
    assertRouteMetadata('terms', 'en', 'Terms EN');
    assertRouteMetadata('terms', 'es', 'Terms ES');

    setEnv('VERCEL_ENV', 'production');
    setEnv('NODE_ENV', 'production');
    const prodMetadata = createMetadata({
      title: 'Home',
      description: 'Desc',
      routeKey: 'home',
      locale: 'en'
    });
    assert(getProperty(prodMetadata.robots, 'index') === true, 'Production indexes by default');
    assert(getProperty(prodMetadata.robots, 'follow') === true, 'Production follows by default');
    assert(getCanonical(prodMetadata) === `${origin}/en`, 'Production canonical uses venkoi.com');
    assert(getLanguageAlternate(prodMetadata, 'en') === `${origin}/en`, 'Production EN alternate uses venkoi.com');
    assert(getLanguageAlternate(prodMetadata, 'es') === `${origin}/es`, 'Production ES alternate uses venkoi.com');
    assert(getLanguageAlternate(prodMetadata, 'x-default') === `${origin}/en`, 'Production x-default uses English on venkoi.com');
    assert(getProperty(prodMetadata.openGraph, 'url') === `${origin}/en`, 'Production OpenGraph URL uses venkoi.com');

    const noIndexMetadata = createMetadata({
      title: 'Private',
      description: 'Desc',
      routeKey: 'demo',
      locale: 'en',
      noIndex: true
    });
    assert(getProperty(noIndexMetadata.robots, 'index') === false, 'Explicit noIndex remains effective in production');

    const productionRobots = robots();
    assert(getProperty(productionRobots.rules, 'allow') === '/', 'Production robots allows public crawling');
    assert(
      Array.isArray(getProperty(productionRobots.rules, 'disallow')) &&
        (getProperty(productionRobots.rules, 'disallow') as string[]).includes('/api/'),
      'Production robots disallows /api/'
    );
    assert(productionRobots.sitemap === `${origin}/sitemap.xml`, 'Production robots advertises canonical sitemap');

    setEnv('VERCEL_ENV', 'preview');
    const previewMetadata = createMetadata({
      title: 'Home',
      description: 'Desc',
      routeKey: 'home',
      locale: 'en'
    });
    assert(getProperty(previewMetadata.robots, 'index') === false, 'Preview environment is noindex');
    assert(getProperty(previewMetadata.robots, 'follow') === false, 'Preview environment is nofollow');
    assert(getCanonical(previewMetadata) === `${origin}/en`, 'Preview canonical still uses venkoi.com');
    assert(getLanguageAlternate(previewMetadata, 'en') === `${origin}/en`, 'Preview EN alternate still uses venkoi.com');
    assert(getLanguageAlternate(previewMetadata, 'es') === `${origin}/es`, 'Preview ES alternate still uses venkoi.com');
    assert(getProperty(previewMetadata.openGraph, 'url') === `${origin}/en`, 'Preview OpenGraph URL still uses venkoi.com');

    const previewRobots = robots();
    assert(getProperty(previewRobots.rules, 'disallow') === '/', 'Preview robots disallows crawling');

    const sitemapItems = sitemap();
    assert(Array.isArray(sitemapItems), 'Sitemap returns an array');
    assert(sitemapItems.length === sitemapRouteKeys.length * locales.length, 'Sitemap contains every indexable route and locale');
    assert(sitemapItems.every(item => item.lastModified == null), 'Sitemap items do NOT contain build-time lastModified');
    assert(sitemapItems.every(item => item.url.startsWith(`${origin}/`)), 'Every sitemap URL uses venkoi.com');
    assert(
      sitemapItems.every(item =>
        Object.values(item.alternates?.languages ?? {}).every(
          url => typeof url === 'string' && url.startsWith(`${origin}/`)
        )
      ),
      'Every sitemap alternate uses venkoi.com'
    );
    assert(!JSON.stringify(sitemapItems).includes('vercel.app'), 'Sitemap contains no vercel.app hostname');

    for (const routeKey of sitemapRouteKeys) {
      for (const locale of locales) {
        const url = expectedUrl(routeKey, locale);
        const item = sitemapItems.find(candidate => normalizeUrl(candidate.url) === normalizeUrl(url));
        assert(!!item, `Sitemap contains ${routeKey} ${locale.toUpperCase()}`);
        assert(
          normalizeUrl(item?.alternates?.languages?.en ?? '') === normalizeUrl(expectedUrl(routeKey, 'en')),
          `Sitemap ${routeKey} ${locale.toUpperCase()} English alternate is exact`
        );
        assert(
          normalizeUrl(item?.alternates?.languages?.es ?? '') === normalizeUrl(expectedUrl(routeKey, 'es')),
          `Sitemap ${routeKey} ${locale.toUpperCase()} Spanish alternate is exact`
        );
        assert(
          normalizeUrl(item?.alternates?.languages?.['x-default'] ?? '') === normalizeUrl(expectedUrl(routeKey, 'en')),
          `Sitemap ${routeKey} ${locale.toUpperCase()} x-default is English localized route`
        );
      }
    }

    const demoUrls = locales.map(locale => normalizeUrl(expectedUrl('demo', locale)));
    assert(!sitemapItems.some(item => demoUrls.includes(normalizeUrl(item.url))), 'Demo route is excluded from sitemap');
    const legalItems = sitemapItems.filter(item => ['/en/privacy', '/es/privacidad', '/en/terms', '/es/terminos'].some(path => item.url.endsWith(path)));
    assert(legalItems.length === 4, 'Sitemap includes all localized legal routes');
    assert(legalItems.every(item => item.priority === 0.3), 'Legal sitemap routes use low priority');
  } finally {
    setEnv('VERCEL_ENV', origVercelEnv);
    setEnv('NODE_ENV', origNodeEnv);
    setEnv('SITE_URL', origSiteUrl);
  }

  console.log(`\n=== SEO REGRESSION SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  testSeoRegression();
}
