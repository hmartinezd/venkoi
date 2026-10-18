import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import en from '../src/i18n/messages/en.json';
import es from '../src/i18n/messages/es.json';
import sitemap from '../src/app/sitemap';
import { FEATURED_PRODUCT } from '../src/lib/products';

const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');
const page = read('src/app/[locale]/custom-software/page.tsx');
const form = read('src/components/forms/ContactProjectForm.tsx');
const config = read('next.config.mjs');

assert.ok(page.includes("routeKey: 'customSoftware'"), 'Page metadata should use customSoftware route identity');
assert.ok(page.includes('initialType="custom-software"'), 'Landing page should reuse the custom-software form intent');
assert.ok(page.includes('analyticsSource="custom_software_landing"'), 'Landing form should identify its analytics source');
assert.ok(page.includes("getLocalizedPath('productsServe', currentLocale)"), 'Proof CTA should use the product registry route');
assert.ok(page.includes('FEATURED_PRODUCT.name') || page.includes('FEATURED_PRODUCT.analyticsProduct'), 'Page should use the canonical Venkoi Serve registry');
assert.ok(page.includes('custom_software_cta'), 'Landing page should track CTA interactions');
assert.ok(page.includes('custom-software-form'), 'Landing page should expose a focused lead-form destination');
assert.ok(form.includes('source: analyticsSource'), 'Reusable form events should carry optional analytics source context');
assert.ok(!config.includes("source: '/en/custom-software'"), 'Obsolete English custom-software redirect must be removed');
assert.ok(!config.includes("source: '/es/software-a-medida'"), 'Obsolete Spanish custom-software redirect must be removed');

const flattenKeys = (value: unknown, prefix = ''): string[] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return prefix ? [prefix] : [];
  return Object.entries(value).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
};

assert.deepEqual(
  flattenKeys(en.customSoftwarePage).sort(),
  flattenKeys(es.customSoftwarePage).sort(),
  'English and Spanish customSoftwarePage namespaces should have matching keys'
);
assert.ok(en.customSoftwarePage.proof.cta.includes('{productName}'), 'English proof CTA should use the product registry placeholder');
assert.ok(es.customSoftwarePage.proof.cta.includes('{productName}'), 'Spanish proof CTA should use the product registry placeholder');
assert.equal(FEATURED_PRODUCT.name, 'Venkoi Serve', 'Product registry should preserve the public Venkoi Serve name');

const sitemapItems = sitemap();
assert.ok(sitemapItems.some((item) => item.url.endsWith('/en/custom-software')), 'Sitemap should include English landing route');
assert.ok(sitemapItems.some((item) => item.url.endsWith('/es/software-a-medida')), 'Sitemap should include Spanish landing route');

console.log('Custom software landing regression checks passed.');
