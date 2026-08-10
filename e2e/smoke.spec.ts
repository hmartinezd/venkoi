import { expect, test } from '@playwright/test';
import { collectPageErrors } from './helpers';

const routes = [
  '/en', '/en/products/zaiko', '/en/services', '/en/services/mobile-applications',
  '/en/services/websites-web-applications', '/en/about', '/en/contact', '/en/demo', '/en/insights',
  '/en/insights/restaurant-inventory-information', '/en/insights/start-a-software-project',
  '/en/insights/website-or-web-application', '/es', '/es/productos/zaiko', '/es/servicios',
  '/es/servicios/aplicaciones-moviles', '/es/servicios/paginas-web-aplicaciones-web', '/es/nosotros',
  '/es/contacto', '/es/demo', '/es/recursos', '/es/recursos/inventario-restaurante-informacion-dispersa',
  '/es/recursos/como-empezar-un-proyecto-de-software', '/es/recursos/pagina-web-o-aplicacion-web'
];

for (const route of routes) {
  test(`${route} renders its public shell`, async ({ page }) => {
    const assertNoPageErrors = collectPageErrors(page);
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/page not found|página no encontrada/i)).toHaveCount(0);
    assertNoPageErrors();
  });
}
