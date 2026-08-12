import { expect, type Page } from '@playwright/test';

export function monitorRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    // Vercel's local production server does not serve hosted analytics scripts.
    // Their absence is expected in E2E and analytics delivery is outside this suite's scope.
    if (message.location().url.includes('/_vercel/')) return;
    errors.push(`console.error: ${message.text()}`);
  });
  return () => expect(errors, errors.join('\n')).toEqual([]);
}

export async function expectHealthyPage(page: Page, path: string) {
  // Hosted Vercel analytics endpoints do not exist on the local Next.js server.
  await page.route('**/_vercel/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  const assertNoRuntimeErrors = monitorRuntimeErrors(page);
  const response = await page.goto(path);
  expect(response?.ok(), `${path} should return a successful response`).toBeTruthy();
  await expect(page.locator('h1:visible')).toHaveCount(1);
  await expect(page.getByText(/Internal Server Error|Application error: a client-side exception/i)).toHaveCount(0);
  expect(await page.title()).not.toBe('');
  assertNoRuntimeErrors();
}

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.client + 1);
}

export async function mockLeadSuccess(page: Page, inspect?: (payload: Record<string, unknown>) => void) {
  let requests = 0;
  await page.route('**/api/leads', async (route) => {
    requests += 1;
    inspect?.(route.request().postDataJSON());
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  return () => requests;
}
