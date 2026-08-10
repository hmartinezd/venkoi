import {
  FEATURED_PRODUCT,
  PRODUCTS,
  getDefaultDemoProduct,
  getProductBySlug
} from '../src/lib/products';

function testProducts() {
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

  assert(Boolean(FEATURED_PRODUCT), 'featured product exists');
  assert(FEATURED_PRODUCT.id === 'zaiko', 'featured product id remains zaiko');
  assert(FEATURED_PRODUCT.slug === 'zaiko', 'featured product slug remains zaiko');
  assert(FEATURED_PRODUCT.routeKey === 'productsZaiko', 'featured product route key remains productsZaiko');
  assert(FEATURED_PRODUCT.analyticsProduct === 'zaiko', 'featured product analytics id remains zaiko');
  assert(FEATURED_PRODUCT.demoEnabled === true, 'featured product keeps demos enabled');
  assert(FEATURED_PRODUCT.pricingEnabled === false, 'featured product keeps pricing disabled');
  assert(PRODUCTS.includes(FEATURED_PRODUCT), 'products registry contains the featured product object');
  assert(new Set(PRODUCTS.map((product) => product.id)).size === PRODUCTS.length, 'product ids are unique');
  assert(new Set(PRODUCTS.map((product) => product.slug)).size === PRODUCTS.length, 'product slugs are unique');
  assert(getProductBySlug('zaiko') === FEATURED_PRODUCT, 'zaiko slug resolves to the featured product');
  assert(getDefaultDemoProduct() === FEATURED_PRODUCT, 'default demo resolves to the featured product');

  console.log(`\n=== PRODUCT REGISTRY SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

testProducts();
