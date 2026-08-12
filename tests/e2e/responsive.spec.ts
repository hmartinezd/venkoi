import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow } from './helpers';

for (const path of ['/en', '/en/products/zaiko', '/en/demo', '/en/insights', '/es/recursos/conteo-fisico-inventario-restaurante']) {
  test(`${path} has no mobile page overflow`, async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile responsive coverage');
    await page.goto(path);
    await expectNoHorizontalOverflow(page);
  });
}

test('long Insight table of contents uses native anchors below the sticky header', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile article coverage');
  await page.goto('/en/insights/restaurant-inventory-counts');
  const toc = page.getByRole('navigation', { name: /guide|contents/i });
  await expect(toc).toBeVisible();
  const link = toc.getByRole('link').first();
  const href = await link.getAttribute('href');
  await link.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  const top = await page.locator(href!).evaluate((element) => element.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(70);
});
