import { expect, test } from '@playwright/test';
import { assertNoHorizontalOverflow, waitForHydration } from './helpers';

const pages = ['/en', '/en/products/zaiko', '/en/contact', '/en/insights/restaurant-inventory-information'];
const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 }
];

for (const viewport of viewports) {
  for (const path of pages) {
    test(`${viewport.name} ${path} has no horizontal page overflow`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
}

test('mobile product explorer and contact details remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/products/zaiko');
  await waitForHydration(page);
  await page.getByRole('button', { name: 'Activity' }).click();
  await expect(page.getByRole('button', { name: 'Activity' })).toHaveAttribute('aria-pressed', 'true');
  await assertNoHorizontalOverflow(page);
  await page.goto('/en/contact');
  await waitForHydration(page);
  const direct = page.getByRole('heading', { name: 'Prefer to talk directly?' });
  expect(await direct.evaluate((element) => element.compareDocumentPosition(document.querySelector('input[name="name"]')!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
  await page.getByText('Add project details (optional)').click();
  await expect(page.getByLabel('Phone')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start the Conversation' })).toBeVisible();
  await assertNoHorizontalOverflow(page);
});

test('mobile insight guide precedes article sections and related cards stack', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/insights/restaurant-inventory-information');
  const guide = page.getByRole('navigation', { name: 'In this guide' });
  const firstSection = page.getByRole('article').locator('section').first();
  expect(await guide.evaluate((element, section) => element.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING, await firstSection.elementHandle())).toBeTruthy();
  const related = page.getByText('Helpful guides').locator('..');
  await expect(related).toBeVisible();
  await assertNoHorizontalOverflow(page);
});
