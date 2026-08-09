import { getSafeLocalizedIntentQuery } from '../src/lib/navigation-intent';
import { type RouteKey } from '../src/i18n/routing';

console.log('=== RUNNING NAVIGATION INTENT TESTS ===\n');

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

function testIntent(routeKey: RouteKey, params: Record<string, string>, expected: Record<string, string>, testName: string) {
  const searchParams = new URLSearchParams(params);
  const result = getSafeLocalizedIntentQuery(routeKey, searchParams);

  const resultObj = Object.fromEntries(result.entries());
  const match = JSON.stringify(resultObj) === JSON.stringify(expected);

  assert(match, `${testName} (Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(resultObj)})`);
}

// Contact tests
console.log('Testing Contact Intent:');
testIntent('contact', { interest: 'mobile' }, { interest: 'mobile' }, 'Canonical mobile');
testIntent('contact', { interest: 'web' }, { interest: 'web' }, 'Canonical web');
testIntent('contact', { interest: 'unsure' }, { interest: 'unsure' }, 'Canonical unsure');
testIntent('contact', { interest: 'website' }, { interest: 'web' }, 'Alias website -> web');
testIntent('contact', { interest: 'web_application' }, { interest: 'web' }, 'Alias web_application -> web');
testIntent('contact', { interest: 'invalid' }, {}, 'Invalid interest removed');
testIntent('contact', { type: 'services', interest: 'mobile' }, { type: 'services', interest: 'mobile' }, 'Services type preserved');
testIntent('contact', { type: 'custom-software', interest: 'mobile' }, { type: 'services', interest: 'mobile' }, 'Legacy type normalized');
testIntent('contact', { utm_source: 'google' }, {}, 'UTM removed');

// Demo tests
console.log('\nTesting Demo Intent:');
testIntent('demo', { product: 'zaiko' }, { product: 'zaiko' }, 'Product zaiko preserved');
testIntent('demo', { product: 'evil' }, {}, 'Invalid product removed');
testIntent('demo', { product: 'zaiko', interest: 'early-access' }, { product: 'zaiko', interest: 'early-access' }, 'Early access preserved');
testIntent('demo', { product: 'zaiko', interest: 'random' }, { product: 'zaiko' }, 'Invalid interest removed');

// Unknown route
console.log('\nTesting Unknown Route:');
testIntent('home', { interest: 'mobile' }, {}, 'Home drops everything');

console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
}
