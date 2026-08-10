import {
  FEATURED_PRODUCT,
  PRODUCTS,
  getDefaultDemoProduct,
  getProductBySlug
} from '../src/lib/products';

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
assert(FEATURED_PRODUCT.earlyAccess.enabled === true, 'Early Access program is enabled');
assert(FEATURED_PRODUCT.earlyAccess.freeMonths === 3, 'Early Access includes three free months');
assert(FEATURED_PRODUCT.demoEnabled === true, 'Featured product demos are enabled');
assert(FEATURED_PRODUCT.pricingEnabled === false, 'Featured product public pricing is disabled');
assert(PRODUCTS.includes(FEATURED_PRODUCT), 'Product registry contains the explicit featured product');
assert(new Set(PRODUCTS.map(({ id }) => id)).size === PRODUCTS.length, 'Product ids are unique');
assert(new Set(PRODUCTS.map(({ slug }) => slug)).size === PRODUCTS.length, 'Product slugs are unique');
assert(getProductBySlug('zaiko') === FEATURED_PRODUCT, 'Product lookup resolves the featured product');
assert(getDefaultDemoProduct() === FEATURED_PRODUCT, 'Default demo lookup resolves the featured product');

console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);

if (failed > 0) process.exit(1);
