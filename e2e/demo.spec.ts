import { expect, test } from '@playwright/test';
import { mockLeadSuccess, waitForHydration } from './helpers';

test('Zaiko Early Access demo submits safe semantics to a mocked API', async ({ page }) => {
  let payload: Record<string, unknown> | undefined;
  await mockLeadSuccess(page, (body) => { payload = body; });
  await page.goto('/en/demo?product=zaiko&interest=early-access');
  await waitForHydration(page);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Zaiko');
  const earlyAccess = page.getByLabel(/interested in using Zaiko free/i);
  await expect(earlyAccess).toBeChecked();
  await expect(page.getByText("WHAT WE'LL COVER")).toBeVisible();
  await page.getByLabel('First name').fill('Test');
  await page.getByLabel('Last name').fill('User');
  await page.getByLabel('Work email').fill('test@example.com');
  await page.getByLabel('Restaurant / Business name').fill('Example Company');
  await page.getByRole('button', { name: 'Request a Demo' }).click();
  await expect(page.getByText('Thanks — we received your Early Access request.')).toBeVisible();
  expect(payload).toMatchObject({ lead_type: 'DEMO', product: 'zaiko', first_name: 'Test', last_name: 'User', email: 'test@example.com', company: 'Example Company', locale: 'en', early_access_interest: true });
});
