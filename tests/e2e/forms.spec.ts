import { expect, test } from '@playwright/test';
import { mockLeadSuccess } from './helpers';

async function fillDemo(page: import('@playwright/test').Page) {
  await page.getByLabel('First name').fill('Avery');
  await page.getByLabel('Last name').fill('Tester');
  await page.getByLabel('Work email').fill('avery@example.test');
  await page.getByLabel('Restaurant / Business name').fill('Fictional Bistro');
}

test('Demo validates required fields and invalid email without requests', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'Form behavior is viewport independent');
  let requests = 0;
  await page.route('**/api/leads', (route) => { requests += 1; return route.abort(); });
  await page.goto('/en/demo');
  await page.getByRole('button', { name: 'Request a Demo' }).click();
  await expect(page.getByLabel('First name')).toBeFocused();
  await expect(page.getByLabel('First name')).toHaveAttribute('aria-invalid', 'true');
  expect(requests).toBe(0);
  await page.getByLabel('First name').fill('Avery');
  await page.getByLabel('Last name').fill('Tester');
  await page.getByLabel('Work email').fill('invalid');
  await page.getByLabel('Restaurant / Business name').fill('Fictional Bistro');
  await page.getByRole('button', { name: 'Request a Demo' }).click();
  await expect(page.getByLabel('Work email')).toBeFocused();
  expect(requests).toBe(0);
});

test('Demo submits once with a safe mocked request and focuses success', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'Form behavior is viewport independent');
  let payload: Record<string, unknown> = {};
  const requestCount = await mockLeadSuccess(page, (value) => { payload = value; });
  await page.goto('/en/demo?product=zaiko&source=header');
  await fillDemo(page);
  await page.getByRole('button', { name: 'Request a Demo' }).dblclick();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByRole('status').locator('..')).toBeFocused();
  expect(requestCount()).toBe(1);
  expect(payload).toMatchObject({ lead_type: 'DEMO', product: 'zaiko', locale: 'en', early_access_interest: false });
});

test('Demo application failure preserves a usable form', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'Form behavior is viewport independent');
  await page.route('**/api/leads', (route) => route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ ok: false, code: 'VALIDATION_ERROR' }) }));
  await page.goto('/en/demo');
  await fillDemo(page);
  await page.getByRole('button', { name: 'Request a Demo' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByLabel('First name')).toBeVisible();
});

test('Access Request submits its technical intent', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'Form behavior is viewport independent');
  let payload: Record<string, unknown> = {};
  await mockLeadSuccess(page, (value) => { payload = value; });
  await page.goto('/en/products/zaiko');
  await page.getByRole('link', { name: 'Request Access' }).first().click();
  await fillDemo(page);
  await page.getByRole('button', { name: 'Request Access' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  expect(payload).toMatchObject({ lead_type: 'DEMO', locale: 'en', early_access_interest: true });
});

test('Contact validates and submits custom-project intent', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'Form behavior is viewport independent');
  let payload: Record<string, unknown> = {};
  let requestCount = 0;
  await page.route('**/api/leads', async (route) => { requestCount += 1; payload = route.request().postDataJSON(); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }); });
  await page.goto('/en/contact?type=custom-software');
  await page.getByRole('button', { name: 'Start the Conversation' }).click();
  await expect(page.getByLabel('Name')).toBeFocused();
  expect(requestCount).toBe(0);
  await page.getByLabel('Name').fill('Avery Tester');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('avery@example.test');
  await page.getByLabel('Tell us about your idea or problem').fill('A fictional restaurant workflow project.');
  await page.getByRole('button', { name: 'Start the Conversation' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  expect(requestCount).toBe(1);
  expect(payload).toMatchObject({ lead_type: 'CUSTOM_PROJECT', locale: 'en' });
});
