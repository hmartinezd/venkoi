import { expect, test } from '@playwright/test';
import { FEATURED_PRODUCT } from '../../src/lib/products';

for (const locale of ['en', 'es'] as const) {
  test(`product journey works in ${locale}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.startsWith('mobile'), 'Desktop product journey');
    await page.goto(locale === 'en' ? '/en/products/zaiko' : '/es/productos/zaiko');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(FEATURED_PRODUCT.name, { exact: true }).first()).toBeVisible();
    await expect(page.locator('figure').first()).toBeVisible();
    await expect(page.locator('figcaption').first()).toBeVisible();
    const chapterLink = page.locator('a[href="#inventory"]').first();
    await chapterLink.click();
    await expect(page).toHaveURL(/#inventory/);
    const demo = page.getByRole('link', { name: /Request a Demo|Solicitar una demo/i }).first();
    await demo.click();
    await expect(page).toHaveURL(/\/demo\?.*product=.*source=/);
  });
}

test('public Request Access keeps technical early-access intent', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'Desktop access journey');
  await page.goto('/en/products/zaiko');
  const access = page.getByRole('link', { name: 'Request Access' }).first();
  await expect(access).toBeVisible();
  await expect(page.getByText('Early Access', { exact: true })).toHaveCount(0);
  await access.click();
  await expect(page).toHaveURL(/interest=early-access/);
  await expect(page.getByRole('button', { name: 'Request Access' })).toBeVisible();
  await expect(page.getByText(/not guaranteed/i)).toBeVisible();
});

test('related product guide navigates', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'Desktop product journey');
  await page.goto('/en/products/zaiko');
  const related = page.locator('main a[href="/en/insights/restaurant-food-cost"]').first();
  await related.click();
  await expect(page).toHaveURL('/en/insights/restaurant-food-cost');
});
