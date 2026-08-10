import { expect, test } from '@playwright/test';
import { waitForHydration } from './helpers';

test.describe('desktop navigation and locale intent', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('header links preserve their destinations and order', async ({ page }) => {
    await page.goto('/en');
    await waitForHydration(page);
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav.getByRole('link')).toHaveText(['Zaiko', 'Insights', 'About', 'Services', 'Contact']);
    for (const [name, path] of [['Zaiko', '/en/products/zaiko'], ['Insights', '/en/insights'], ['About', '/en/about'], ['Services', '/en/services'], ['Contact', '/en/contact']] as const) {
      await nav.getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path.replace(/\//g, '\\/')}$`));
      await page.goto('/en');
    }
    await page.locator('header').getByRole('link', { name: 'Request a Demo' }).click();
    await expect(page).toHaveURL(/\/en\/demo\?product=zaiko$/);
  });

  test('skip link targets and focuses main content', async ({ page }) => {
    await page.goto('/en');
    await waitForHydration(page);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page.locator('#content')).toBeFocused();
    await expect(page).toHaveURL(/#content$/);
  });

  test('language switching retains localized paths and safe intent queries', async ({ page }) => {
    const cases = [
      ['/en', '/es'],
      ['/en/services/mobile-applications', '/es/servicios/aplicaciones-moviles'],
      ['/en/insights/restaurant-inventory-information', '/es/recursos/inventario-restaurante-informacion-dispersa'],
      ['/en/contact?type=services&interest=mobile', '/es/contacto?type=services&interest=mobile'],
      ['/en/demo?product=zaiko&interest=early-access', '/es/demo?product=zaiko&interest=early-access']
    ];
    for (const [from, to] of cases) {
      await page.goto(from);
      const switchLink = page.locator('header').getByRole('group', { name: 'Language' }).getByRole('link', { name: 'ES' });
      await expect(switchLink).toBeVisible();
      await expect(switchLink).toHaveAttribute('href', to);
      await switchLink.click();
      await expect(page).toHaveURL(to);
    }
    await page.locator('header').getByRole('group', { name: 'Idioma' }).getByRole('link', { name: 'EN' }).click();
    await expect(page).toHaveURL('/en/demo?product=zaiko&interest=early-access');
  });
});

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('opens, focuses first link, closes with Escape, and returns focus', async ({ page }) => {
    await page.goto('/en');
    await waitForHydration(page);
    const trigger = page.getByRole('button', { name: 'Open menu' });
    await trigger.click();
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav.getByRole('link', { name: /Zaiko/ })).toBeFocused();
    await expect(nav.getByRole('link')).toHaveCount(5);
    await page.keyboard.press('Escape');
    await expect(nav).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('destination click and desktop resize close the drawer', async ({ page }) => {
    await page.goto('/en');
    await waitForHydration(page);
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL('/en/services');
    await waitForHydration(page);
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  });
});
