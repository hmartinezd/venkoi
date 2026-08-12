import { expect, test } from '@playwright/test';
import { getLocalizedPath } from '../../src/i18n/routing';
import { FEATURED_PRODUCT } from '../../src/lib/products';

test('homepage keeps product and custom-project funnels distinct', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'Desktop funnel coverage');
  await page.goto('/en');
  const main = page.locator('main');
  await expect(main.getByText(FEATURED_PRODUCT.name).first()).toBeVisible();
  const productTop = await main.getByRole('link', { name: new RegExp(`Explore ${FEATURED_PRODUCT.name}`) }).first().evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
  const servicesTop = await main.locator('a[href="/en/services"]').first().evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
  expect(productTop).toBeLessThan(servicesTop);
  await main.getByRole('link', { name: new RegExp(`Explore ${FEATURED_PRODUCT.name}`) }).first().click();
  await expect(page).toHaveURL(getLocalizedPath('productsZaiko', 'en'));
  await page.goto('/en');
  await main.getByRole('link', { name: /Request a Demo/i }).first().click();
  await expect(page).toHaveURL(/\/en\/demo\?.*product=.*source=/);
  await page.goto('/en');
  await main.getByRole('link', { name: /Tell us about your idea/i }).first().click();
  await expect(page).toHaveURL(/\/en\/contact\?.*type=(?:custom-software|services)/);
});

test('desktop header navigation and skip link work by keyboard', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'Desktop navigation coverage');
  await page.goto('/en');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('navigation', { name: /main/i }).getByRole('link', { name: 'Insights' }).click();
  await expect(page).toHaveURL('/en/insights');
});

test('mobile menu exposes state and navigates', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile navigation coverage');
  await page.goto('/en');
  const toggle = page.locator('button[aria-controls="mobile-navigation"]');
  await expect(toggle).toHaveAccessibleName(/open menu/i);
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const drawer = page.locator('#mobile-navigation');
  await expect(drawer).toBeVisible();
  await drawer.getByRole('link', { name: 'Insights' }).click();
  await expect(page).toHaveURL('/en/insights');
});

for (const route of ['home', 'productsZaiko', 'insightRestaurantInventory', 'insightRestaurantFoodCost'] as const) {
  test(`locale switch preserves ${route}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.startsWith('mobile'), 'One locale switcher is sufficient');
    await page.goto(getLocalizedPath(route, 'en'));
    await page.getByRole('group', { name: /language/i }).first().getByRole('link', { name: 'ES' }).click();
    await expect(page).toHaveURL(getLocalizedPath(route, 'es'));
    await page.getByRole('group', { name: /idioma/i }).first().getByRole('link', { name: 'EN' }).click();
    await expect(page).toHaveURL(getLocalizedPath(route, 'en'));
  });
}
