import {
  getLocalizedPath,
  getRouteKeyFromPath
} from '../src/i18n/routing';

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
assert(getLocalizedPath('insights', 'en') === '/en/insights', 'Insights EN');
assert(getLocalizedPath('insights', 'es') === '/es/recursos', 'Insights ES');
assert(getLocalizedPath('privacy', 'en') === '/en/privacy', 'Privacy EN');
assert(getLocalizedPath('privacy', 'es') === '/es/privacidad', 'Privacy ES');
assert(getLocalizedPath('terms', 'en') === '/en/terms', 'Terms EN');
assert(getLocalizedPath('terms', 'es') === '/es/terminos', 'Terms ES');
assert(getLocalizedPath('insightRestaurantInventory', 'en') === '/en/insights/restaurant-inventory-information', 'Restaurant Inventory EN');
assert(getLocalizedPath('insightRestaurantInventory', 'es') === '/es/recursos/inventario-restaurante-informacion-dispersa', 'Restaurant Inventory ES');
assert(getLocalizedPath('insightRestaurantInventoryCounts', 'en') === '/en/insights/restaurant-inventory-counts', 'Inventory Counts EN');
assert(getLocalizedPath('insightRestaurantInventoryCounts', 'es') === '/es/recursos/conteo-fisico-inventario-restaurante', 'Inventory Counts ES');
assert(getLocalizedPath('insightRestaurantFoodCost', 'en') === '/en/insights/restaurant-food-cost', 'Food Cost EN');
assert(getLocalizedPath('insightRestaurantFoodCost', 'es') === '/es/recursos/costo-alimentos-restaurante', 'Food Cost ES');
assert(getLocalizedPath('insightRestaurantSupplierPrices', 'en') === '/en/insights/restaurant-supplier-price-changes', 'Supplier Prices EN');
assert(getLocalizedPath('insightRestaurantSupplierPrices', 'es') === '/es/recursos/cambios-precios-proveedores-restaurante', 'Supplier Prices ES');
assert(getLocalizedPath('insightStartSoftwareProject', 'en') === '/en/insights/start-a-software-project', 'Start Project EN');
assert(getLocalizedPath('insightStartSoftwareProject', 'es') === '/es/recursos/como-empezar-un-proyecto-de-software', 'Start Project ES');
assert(getLocalizedPath('insightWebsiteOrWebApp', 'en') === '/en/insights/website-or-web-application', 'Website/WebApp EN');
assert(getLocalizedPath('insightWebsiteOrWebApp', 'es') === '/es/recursos/pagina-web-o-aplicacion-web', 'Website/WebApp ES');

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
assert(getRouteKeyFromPath('/en/insights') === 'insights', 'Path /en/insights -> insights');
assert(getRouteKeyFromPath('/es/recursos') === 'insights', 'Path /es/recursos -> insights');
assert(getRouteKeyFromPath('/en/privacy') === 'privacy', 'Path /en/privacy -> privacy');
assert(getRouteKeyFromPath('/es/privacidad') === 'privacy', 'Path /es/privacidad -> privacy');
assert(getRouteKeyFromPath('/en/terms') === 'terms', 'Path /en/terms -> terms');
assert(getRouteKeyFromPath('/es/terminos') === 'terms', 'Path /es/terminos -> terms');
assert(getRouteKeyFromPath('/en/insights/restaurant-inventory-information') === 'insightRestaurantInventory', 'Path /en/insights/restaurant-inventory-information -> insightRestaurantInventory');
assert(getRouteKeyFromPath('/es/recursos/inventario-restaurante-informacion-dispersa') === 'insightRestaurantInventory', 'Path /es/recursos/inventario-restaurante-informacion-dispersa -> insightRestaurantInventory');
assert(getRouteKeyFromPath('/en/insights/restaurant-inventory-counts') === 'insightRestaurantInventoryCounts', 'Counts EN path');
assert(getRouteKeyFromPath('/es/recursos/conteo-fisico-inventario-restaurante') === 'insightRestaurantInventoryCounts', 'Counts ES path');
assert(getRouteKeyFromPath('/en/insights/restaurant-food-cost') === 'insightRestaurantFoodCost', 'Food cost EN path');
assert(getRouteKeyFromPath('/es/recursos/costo-alimentos-restaurante') === 'insightRestaurantFoodCost', 'Food cost ES path');
assert(getRouteKeyFromPath('/en/insights/restaurant-supplier-price-changes') === 'insightRestaurantSupplierPrices', 'Supplier prices EN path');
assert(getRouteKeyFromPath('/es/recursos/cambios-precios-proveedores-restaurante') === 'insightRestaurantSupplierPrices', 'Supplier prices ES path');
assert(getRouteKeyFromPath('/en/insights/start-a-software-project') === 'insightStartSoftwareProject', 'Path /en/insights/start-a-software-project -> insightStartSoftwareProject');
assert(getRouteKeyFromPath('/es/recursos/como-empezar-un-proyecto-de-software') === 'insightStartSoftwareProject', 'Path /es/recursos/como-empezar-un-proyecto-de-software -> insightStartSoftwareProject');
assert(getRouteKeyFromPath('/en/insights/website-or-web-application') === 'insightWebsiteOrWebApp', 'Path /en/insights/website-or-web-application -> insightWebsiteOrWebApp');
assert(getRouteKeyFromPath('/es/recursos/pagina-web-o-aplicacion-web') === 'insightWebsiteOrWebApp', 'Path /es/recursos/pagina-web-o-aplicacion-web -> insightWebsiteOrWebApp');

// 3. Test internalRoutes mapping
console.log('\nTesting internalRoutes mapping:');
assert(getRouteKeyFromPath('/services/mobile-applications') === 'servicesMobile', 'Internal Path /services/mobile-applications -> servicesMobile');

console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
}
