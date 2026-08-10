import { expect, test } from '@playwright/test';
import { waitForHydration } from './helpers';

test('product explorer, anchors, Early Access, FAQ, and demo CTA work', async ({ page }) => {
  await page.goto('/en/products/zaiko');
  await waitForHydration(page);
  const productNav = page.getByRole('navigation', { name: 'Zaiko navigation' });
  await productNav.getByRole('link', { name: 'Costs' }).click();
  await expect(page).toHaveURL(/#costs$/);
  await expect(page.locator('#costs')).toBeVisible();

  const inventory = page.getByRole('button', { name: 'Inventory' });
  const purchases = page.getByRole('button', { name: 'Purchases' });
  await expect(inventory).toHaveAttribute('aria-pressed', 'true');
  await purchases.click();
  await expect(purchases).toHaveAttribute('aria-pressed', 'true');
  await expect(inventory).toHaveAttribute('aria-pressed', 'false');
  await expect(purchases.locator('xpath=ancestor::section[1]').getByRole('heading', { name: 'Keep purchasing and receiving organized.' })).toBeVisible();

  await expect(page.locator('#early-access')).toBeVisible();
  const faq = page.locator('#faq details').first();
  await faq.locator('summary').click();
  await expect(faq).toHaveAttribute('open', '');
  await page.getByRole('main').getByRole('link', { name: 'Request a Demo' }).first().click();
  await expect(page).toHaveURL('/en/demo?product=zaiko');
});

test('services routes and conversion intents are localized correctly', async ({ page }) => {
  await page.goto('/en/services');
  await page.getByRole('link', { name: 'Explore Mobile Applications' }).click();
  await expect(page).toHaveURL('/en/services/mobile-applications');
  await expect(page.getByRole('main').getByRole('link').filter({ has: page.getByText(/tell us|start/i) }).first()).toHaveAttribute('href', /\/en\/contact\?type=services&interest=mobile/);
  await page.goto('/en/services');
  await page.getByRole('link', { name: 'Explore Websites & Web Applications' }).click();
  await expect(page).toHaveURL('/en/services/websites-web-applications');
  await expect(page.getByRole('main').getByRole('link').filter({ has: page.getByText(/tell us|start/i) }).first()).toHaveAttribute('href', /interest=web/);
  await page.goto('/en/services');
  await expect(page.getByRole('main').getByRole('link', { name: 'Tell us about your idea' })).toHaveCount(2);
});

test('About and Home preserve demo-first and generic-contact choices', async ({ page }) => {
  for (const path of ['/en/about', '/en']) {
    await page.goto(path);
    const main = page.getByRole('main');
    const demo = main.getByRole('link', { name: 'Request a Demo' }).last();
    await expect(demo).toHaveAttribute('href', /\/en\/demo\?product=zaiko/);
    const contact = main.getByRole('link', { name: /Start a Conversation/ }).last();
    await expect(contact).toHaveAttribute('href', '/en/contact');
  }
});

test('insights order, guide anchors, and related articles are correct', async ({ page }) => {
  await page.goto('/en/insights');
  const headings = await page.getByRole('main').getByRole('heading', { level: 2 }).allTextContents();
  expect(headings[0]).toContain('Inventory gets harder');
  await page.goto('/en/insights/restaurant-inventory-information');
  const guide = page.getByRole('navigation', { name: 'In this guide' });
  const links = guide.getByRole('link');
  for (const link of await links.all()) {
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^#/);
    await expect(page.locator(href!)).toHaveCount(1);
  }
  await links.first().click();
  await expect(page).toHaveURL(/#.+/);
  const main = page.getByRole('main');
  await expect(main.locator('a[href="/en/insights/start-a-software-project"]')).toBeVisible();
  await expect(main.locator('a[href="/en/insights/website-or-web-application"]')).toBeVisible();
  await expect(main.locator('a[href="/en/insights/restaurant-inventory-information"]')).toHaveCount(0);
});
