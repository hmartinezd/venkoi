import { createMetadata } from '../src/lib/seo';
import sitemap from '../src/app/sitemap';

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

  const setEnv = (key: string, value: string | undefined) => {
    if (value === undefined) {
      delete (process.env as Record<string, string | undefined>)[key];
    } else {
      (process.env as Record<string, string | undefined>)[key] = value;
    }
  };

  try {
    // 1. Metadata Generation - Default (Website)
    const metadata = createMetadata({
      title: 'Home',
      description: 'Desc',
      routeKey: 'home',
      locale: 'en'
    });

    assert((metadata.openGraph as any)?.type === 'website', 'Default metadata uses type: website');
    assert(metadata.openGraph?.siteName === 'Venkoi', 'OpenGraph siteName is Venkoi');
    assert((metadata.twitter as any)?.card === 'summary_large_image', 'Twitter card is summary_large_image');

    // 2. Metadata Generation - Article
    const articleMetadata = createMetadata({
      title: 'Article',
      description: 'Desc',
      routeKey: 'insightRestaurantInventory',
      locale: 'en',
      openGraphType: 'article'
    });
    assert((articleMetadata.openGraph as any)?.type === 'article', 'Explicit openGraphType article works');

    // 3. Localization and Canonical
    const esMetadata = createMetadata({
      title: 'Inicio',
      description: 'Desc',
      routeKey: 'home',
      locale: 'es'
    });

    const canonical = (esMetadata.alternates as any)?.canonical;
    assert(canonical.endsWith('/es'), 'Spanish canonical URL ends with /es');

    const languages = (esMetadata.alternates as any)?.languages;
    assert(languages['en'].endsWith('/'), 'English alternate URL is present');
    assert(languages['es'].endsWith('/es'), 'Spanish alternate URL is present');
    assert(languages['x-default'].endsWith('/'), 'x-default points to English root');

    // 4. Indexing behavior - Production
    setEnv('VERCEL_ENV', 'production');
    setEnv('NODE_ENV', 'production');
    const prodMetadata = createMetadata({
      title: 'Home',
      description: 'Desc',
      routeKey: 'home',
      locale: 'en'
    });
    assert((prodMetadata.robots as any)?.index === true, 'Production indexes by default');

    // 5. Indexing behavior - Preview (should be noindex)
    setEnv('VERCEL_ENV', 'preview');
    const previewMetadata = createMetadata({
      title: 'Home',
      description: 'Desc',
      routeKey: 'home',
      locale: 'en'
    });
    assert((previewMetadata.robots as any)?.index === false, 'Preview environment is noindex');

    // 6. Sitemap Verification
    const sitemapItems = sitemap();
    assert(Array.isArray(sitemapItems), 'Sitemap returns an array');

    const enHome = sitemapItems.find(item => item.url.endsWith('venkoi.com/'));
    const esHome = sitemapItems.find(item => item.url.endsWith('venkoi.com/es'));

    assert(!!enHome, 'English home route present in sitemap');
    assert(!!esHome, 'Spanish home route present in sitemap');

    if (enHome) {
      // Verify lack of build-time lastModified
      const allItemsHaveNoLastModified = sitemapItems.every(item => !(item as any).lastModified);
      assert(allItemsHaveNoLastModified, 'Sitemap items do NOT contain build-time lastModified property');

      // Verify alternate languages in sitemap
      assert(!!enHome.alternates?.languages?.en, 'Sitemap alternates contain English');
      assert(!!enHome.alternates?.languages?.es, 'Sitemap alternates contain Spanish');
      assert(!!enHome.alternates?.languages?.['x-default'] && enHome.alternates.languages['x-default'].endsWith('/'), 'Sitemap alternates x-default is English root');
    }

    // Verify Demo is excluded
    const demoInSitemap = sitemapItems.find(item => item.url.includes('/demo'));
    assert(!demoInSitemap, 'Demo route is excluded from sitemap');

  } finally {
    setEnv('VERCEL_ENV', origVercelEnv);
    setEnv('NODE_ENV', origNodeEnv);
  }

  console.log(`\n=== SEO REGRESSION SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  testSeoRegression();
}
