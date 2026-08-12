import { test } from '@playwright/test';
import { getLocalizedPath, type RouteKey } from '../../src/i18n/routing';
import { expectHealthyPage } from './helpers';

const routes: RouteKey[] = ['home', 'productsZaiko', 'demo', 'services', 'about', 'contact', 'insights', 'insightRestaurantInventory', 'insightRestaurantInventoryCounts', 'insightRestaurantFoodCost', 'insightRestaurantSupplierPrices'];

for (const locale of ['en', 'es'] as const) {
  for (const route of routes) {
    test(`${locale} ${route} renders`, async ({ page }) => {
      await expectHealthyPage(page, getLocalizedPath(route, locale));
    });
  }
}
