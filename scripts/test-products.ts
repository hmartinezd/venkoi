import {
  FEATURED_PRODUCT,
  PRODUCTS,
  getDefaultDemoProduct,
  getProductBySlug,
  isEarlyAccessInterest,
  productPlatformToSchemaOperatingSystem,
  resolveDemoProduct,
  type Product
} from '../src/lib/products';
import { buildProductDemoHref, normalizeDemoConversionSource } from '../src/lib/product-links';

console.log('=== RUNNING PRODUCT REGISTRY TESTS ===\n');

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

assert(Boolean(FEATURED_PRODUCT), 'Featured product exists');
assert(FEATURED_PRODUCT.id === 'zaiko', 'Featured product id remains zaiko');
assert(FEATURED_PRODUCT.slug === 'zaiko', 'Featured product slug remains zaiko');
assert(FEATURED_PRODUCT.routeKey === 'productsZaiko', 'Featured product route key remains stable');
assert(FEATURED_PRODUCT.analyticsProduct === 'zaiko', 'Featured analytics product remains zaiko');
assert(FEATURED_PRODUCT.status === 'available', 'Featured product is available');
assert(FEATURED_PRODUCT.platform === 'android', 'Featured product platform is Android');
assert(FEATURED_PRODUCT.operatingModel === 'local-first', 'Featured product operating model is local-first');
assert(
  /restaurant inventory and food-cost/i.test(FEATURED_PRODUCT.shortDescription),
  'Short description identifies restaurant inventory and food-cost scope'
);
assert(
  /purchases|vendor price intelligence|recipe and menu costing|physical counts|reorder decisions/i.test(FEATURED_PRODUCT.shortDescription),
  'Short description represents the richer connected workflow'
);
assert(productPlatformToSchemaOperatingSystem(FEATURED_PRODUCT.platform) === 'Android', 'Schema platform mapping identifies Android');
assert(FEATURED_PRODUCT.earlyAccess.enabled === true, 'Early Access program is enabled');
assert(FEATURED_PRODUCT.earlyAccess.freeMonths === 3, 'Early Access includes three free months');
assert(FEATURED_PRODUCT.demoEnabled === true, 'Featured product demos are enabled');
assert(FEATURED_PRODUCT.pricingEnabled === false, 'Featured product public pricing is disabled');
assert(PRODUCTS.includes(FEATURED_PRODUCT), 'Product registry contains the explicit featured product');
assert(new Set(PRODUCTS.map(({ id }) => id)).size === PRODUCTS.length, 'Product ids are unique');
assert(new Set(PRODUCTS.map(({ slug }) => slug)).size === PRODUCTS.length, 'Product slugs are unique');
assert(getProductBySlug('zaiko') === FEATURED_PRODUCT, 'Product lookup resolves the featured product');
assert(getDefaultDemoProduct() === FEATURED_PRODUCT, 'Default demo lookup resolves the featured product');
assert(buildProductDemoHref('en', FEATURED_PRODUCT) === '/en/demo?product=zaiko', 'EN product demo URL is canonical');
assert(buildProductDemoHref('es', FEATURED_PRODUCT) === '/es/demo?product=zaiko', 'ES product demo URL is canonical');
assert(
  buildProductDemoHref('en', FEATURED_PRODUCT, { interest: 'early-access' }) ===
    '/en/demo?product=zaiko&interest=early-access',
  'Early Access URL includes product and interest context'
);
assert(
  buildProductDemoHref('en', FEATURED_PRODUCT, { source: 'product_hero' }) ===
    '/en/demo?product=zaiko&source=product_hero',
  'Demo URL carries a controlled conversion source'
);
assert(normalizeDemoConversionSource('product_hero') === 'product_hero', 'Approved conversion source is accepted');
assert(normalizeDemoConversionSource('customer@example.com') === undefined, 'Arbitrary conversion source is rejected');
assert(
  buildProductDemoHref('en', { slug: FEATURED_PRODUCT.slug }) === '/en/demo?product=zaiko',
  'Demo URLs consume the stable product slug rather than the display name'
);
assert(resolveDemoProduct('zaiko') === FEATURED_PRODUCT, 'Valid demo query resolves the featured product');
assert(resolveDemoProduct(undefined) === FEATURED_PRODUCT, 'Missing demo query resolves the default product');
assert(resolveDemoProduct('invalid') === FEATURED_PRODUCT, 'Invalid demo query resolves the default product');
assert(isEarlyAccessInterest(FEATURED_PRODUCT, 'early-access'), 'Enabled Early Access interest is accepted');

const earlyAccessDisabledProduct: Product = {
  ...FEATURED_PRODUCT,
  earlyAccess: { ...FEATURED_PRODUCT.earlyAccess, enabled: false }
};
assert(
  !isEarlyAccessInterest(earlyAccessDisabledProduct, 'early-access'),
  'Disabled Early Access falls back to standard demo mode'
);

console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);

if (failed > 0) process.exit(1);
