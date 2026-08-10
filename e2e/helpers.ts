import { expect, type Page } from '@playwright/test';

export function collectPageErrors(page: Page) {
  const errors: Error[] = [];
  page.on('pageerror', (error) => errors.push(error));
  return () => expect(errors, errors.map((error) => error.stack ?? error.message).join('\n')).toEqual([]);
}

export async function assertNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth + 1);
}

export async function waitForHydration(page: Page) {
  await page.waitForTimeout(100);
}

export async function mockLeadSuccess(page: Page, onPayload?: (payload: Record<string, unknown>) => void) {
  await page.route('**/api/leads', async (route) => {
    expect(route.request().method()).toBe('POST');
    onPayload?.(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
}
