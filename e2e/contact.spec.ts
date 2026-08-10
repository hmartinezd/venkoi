import { expect, test } from '@playwright/test';
import { mockLeadSuccess, waitForHydration } from './helpers';

async function fillRequiredContact(page: import('@playwright/test').Page) {
  await page.getByLabel('Name').fill('Test User');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('test@example.com');
  await page.getByLabel('Tell us about your idea or problem').fill('Venkoi E2E test message');
}

test('generic contact keeps optional fields collapsed and exposes direct links', async ({ page }) => {
  await page.goto('/en/contact');
  await waitForHydration(page);
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible();
  await expect(page.getByLabel('Tell us about your idea or problem')).toBeVisible();
  const details = page.locator('details').filter({ hasText: 'Add project details' });
  await expect(details).not.toHaveAttribute('open', '');
  await expect(page.getByLabel('Phone')).not.toBeVisible();
  await details.getByText('Add project details (optional)').click();
  await expect(page.getByLabel('Phone')).toBeVisible();
  await expect(page.getByLabel('Company')).toBeVisible();
  await expect(page.getByLabel('What are you interested in?')).toBeVisible();
  await expect(page.getByLabel('Project stage')).toBeVisible();
  await expect(page.locator('#content').getByRole('link', { name: 'Chat with Venkoi on WhatsApp' })).toHaveAttribute('href', /^https:\/\/wa\.me\//);
  await expect(page.getByRole('link', { name: 'Email Venkoi' }).first()).toHaveAttribute('href', /^mailto:/);
});

test('service intent survives collapsed details and mocked success payload', async ({ page }) => {
  let payload: Record<string, unknown> | undefined;
  await mockLeadSuccess(page, (body) => { payload = body; });
  await page.goto('/en/contact?type=services&interest=mobile');
  await waitForHydration(page);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('mobile app');
  await expect(page.locator('span').getByText('Mobile application', { exact: true })).toBeVisible();
  await fillRequiredContact(page);
  await page.getByRole('button', { name: 'Start the Conversation' }).click();
  const success = page.getByText('Thanks — we received your message.');
  await expect(success).toBeVisible();
  await expect(page.locator('div[tabindex="-1"]').filter({ hasText: 'Thanks — we received your message.' })).toBeFocused();
  expect(payload).toMatchObject({
    lead_type: 'CUSTOM_PROJECT', name: 'Test User', email: 'test@example.com',
    message: 'Venkoi E2E test message', locale: 'en', interest: 'mobile'
  });
});

test('optional values are submitted through the mocked endpoint', async ({ page }) => {
  let payload: Record<string, unknown> | undefined;
  await mockLeadSuccess(page, (body) => { payload = body; });
  await page.goto('/en/contact');
  await waitForHydration(page);
  await fillRequiredContact(page);
  await page.getByText('Add project details (optional)').click();
  await page.getByLabel('Phone').fill('555-0100');
  await page.getByLabel('Company').fill('Example Company');
  await page.getByLabel('What are you interested in?').selectOption('web');
  await page.getByLabel('Project stage').selectOption('planning');
  await page.getByRole('button', { name: 'Start the Conversation' }).click();
  await expect(page.getByText('Thanks — we received your message.')).toBeVisible();
  expect(payload).toMatchObject({ phone: '555-0100', company: 'Example Company', interest: 'web', project_stage: 'planning' });
});

test('a hidden optional server error opens details and focuses the field', async ({ page }) => {
  await page.route('**/api/leads', (route) => route.fulfill({
    status: 400, contentType: 'application/json',
    body: JSON.stringify({ ok: false, code: 'VALIDATION_ERROR', fieldErrors: { interest: 'INVALID_OPTION' } })
  }));
  await page.goto('/en/contact');
  await waitForHydration(page);
  await fillRequiredContact(page);
  await page.getByRole('button', { name: 'Start the Conversation' }).click();
  await expect(page.getByLabel('What are you interested in?')).toBeVisible();
  await expect(page.getByLabel('What are you interested in?')).toBeFocused();
});
