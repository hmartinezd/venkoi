import {
  getLocalizedPath,
  getRouteKeyFromPath,
  internalRoutes,
  type RouteKey
} from '../src/i18n/routing';
import { locales, type Locale } from '../src/i18n/config';

console.log('=== RUNNING ROUTING REGRESSION TESTS ===\n');

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

// 1. Test getLocalizedPath
console.log('Testing getLocalizedPath:');
assert(getLocalizedPath('home', 'en') === '/en', 'Home EN');
assert(getLocalizedPath('home', 'es') === '/es', 'Home ES');
assert(getLocalizedPath('servicesMobile', 'en') === '/en/services/mobile-applications', 'Mobile Services EN');
assert(getLocalizedPath('servicesMobile', 'es') === '/es/servicios/aplicaciones-moviles', 'Mobile Services ES');
assert(getLocalizedPath('servicesWeb', 'en') === '/en/services/websites-web-applications', 'Web Services EN');
assert(getLocalizedPath('servicesWeb', 'es') === '/es/servicios/paginas-web-aplicaciones-web', 'Web Services ES');

// 2. Test getRouteKeyFromPath
console.log('\nTesting getRouteKeyFromPath:');
assert(getRouteKeyFromPath('/en') === 'home', 'Path /en -> home');
assert(getRouteKeyFromPath('/es/') === 'home', 'Path /es/ -> home');
assert(getRouteKeyFromPath('/en/services') === 'services', 'Path /en/services -> services');
assert(getRouteKeyFromPath('/es/servicios') === 'services', 'Path /es/servicios -> services');
assert(getRouteKeyFromPath('/en/services/mobile-applications') === 'servicesMobile', 'Path /en/services/mobile-applications -> servicesMobile');
assert(getRouteKeyFromPath('/es/servicios/aplicaciones-moviles') === 'servicesMobile', 'Path /es/servicios/aplicaciones-moviles -> servicesMobile');
assert(getRouteKeyFromPath('/en/services/websites-web-applications') === 'servicesWeb', 'Path /en/services/websites-web-applications -> servicesWeb');
assert(getRouteKeyFromPath('/es/servicios/paginas-web-aplicaciones-web') === 'servicesWeb', 'Path /es/servicios/paginas-web-aplicaciones-web -> servicesWeb');

// 3. Test internalRoutes mapping
console.log('\nTesting internalRoutes mapping:');
assert(getRouteKeyFromPath('/services/mobile-applications') === 'servicesMobile', 'Internal Path /services/mobile-applications -> servicesMobile');

console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
}
