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
const analytics = read('src/lib/analytics.ts');
const config = read('next.config.mjs');

assert.ok(page.includes("routeKey: 'customSoftware'"), 'Page metadata should use customSoftware route identity');
assert.ok(page.includes('initialType="custom-software"'), 'Landing page should reuse the custom-software form intent');
assert.ok(page.includes('analyticsSource="custom_software_landing"'), 'Landing form should identify its analytics source');
assert.ok(page.includes("getLocalizedPath('productsServe', currentLocale)"), 'Proof CTA should use the product registry route');
assert.ok(page.includes('FEATURED_PRODUCT.name') || page.includes('FEATURED_PRODUCT.analyticsProduct'), 'Page should use the canonical Venkoi Serve registry');
assert.ok(page.includes('custom_software_cta'), 'Landing page should track CTA interactions');
assert.ok(page.includes('custom-software-form'), 'Landing page should expose a focused lead-form destination');
assert.ok(page.includes("t('ai.eyebrow')") && page.includes("t('ai.trust')"), 'Landing page should include the AI section and trust statement');
assert.ok(page.includes('eventName="ai_software_cta"'), 'AI section should have a dedicated CTA event');
assert.ok(page.includes("source: 'custom_software_ai_section'"), 'AI CTA should identify its landing-page source');
assert.ok(page.includes('href="#custom-software-form"'), 'AI CTA should reuse the existing custom-software form destination');
assert.equal((page.match(/<ContactProjectForm/g) ?? []).length, 1, 'Landing page should keep one shared lead form');
assert.ok(form.includes('source: analyticsSource'), 'Reusable form events should carry optional analytics source context');
assert.ok(analytics.includes("| 'ai_software_cta'"), 'Analytics should allow the AI section CTA event');
for (const forbiddenScript of ['googletagmanager', 'fbq', 'linkedin insight', 'uet']) {
  assert.doesNotMatch(page, new RegExp(forbiddenScript, 'i'), `Landing page must not add ${forbiddenScript} tracking`);
}
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
assert.match(en.customSoftwarePage.capabilities.item8Title, /AI/i, 'English capabilities should include AI-enabled workflows');
assert.match(es.customSoftwarePage.capabilities.item8Title, /IA/i, 'Spanish capabilities should include workflows with IA');
assert.match(en.customSoftwarePage.ai.trust, /Not every problem needs AI/i, 'English AI section should reject one-size-fits-all AI');
assert.match(es.customSoftwarePage.ai.trust, /No todos los problemas necesitan IA/i, 'Spanish AI section should reject one-size-fits-all AI');
assert.match(en.customSoftwarePage.ai.safeguards, /review|data boundaries|validation/i, 'English AI section should mention practical safeguards');
assert.match(es.customSoftwarePage.ai.safeguards, /revisi[oó]n|l[ií]mites.*datos|validaci[oó]n/i, 'Spanish AI section should mention practical safeguards');
assert.doesNotMatch(en.customSoftwarePage.proof.body, /\bAI\b|artificial intelligence/i, 'English Venkoi Serve proof must not claim AI functionality');
assert.doesNotMatch(es.customSoftwarePage.proof.body, /\bIA\b|inteligencia artificial/i, 'Spanish Venkoi Serve proof must not claim AI functionality');
for (const faqKey of ['q8', 'q9', 'q10', 'q11', 'a8', 'a9', 'a10', 'a11']) {
  assert.ok(en.customSoftwarePage.faq[faqKey as keyof typeof en.customSoftwarePage.faq], `English FAQ should include ${faqKey}`);
  assert.ok(es.customSoftwarePage.faq[faqKey as keyof typeof es.customSoftwarePage.faq], `Spanish FAQ should include ${faqKey}`);
}

const sitemapItems = sitemap();
assert.ok(sitemapItems.some((item) => item.url.endsWith('/en/custom-software')), 'Sitemap should include English landing route');
assert.ok(sitemapItems.some((item) => item.url.endsWith('/es/software-a-medida')), 'Sitemap should include Spanish landing route');

console.log('Custom software landing regression checks passed.');
