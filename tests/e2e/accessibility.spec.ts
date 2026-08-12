import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const paths = ['/en', '/en/products/zaiko', '/en/demo', '/en/contact', '/en/insights', '/en/insights/restaurant-inventory-counts', '/es', '/es/productos/zaiko', '/es/demo'];

for (const path of paths) {
  test(`${path} has no serious or critical axe violations`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.startsWith('mobile'), 'Representative desktop axe scan');
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const severe = results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
    expect(severe, severe.map(({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(' ')).join(', ')}`).join('\n')).toEqual([]);
  });
}
