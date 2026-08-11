import assert from 'node:assert/strict';
import { getLeadAcquisitionContext, normalizeExternalReferrer } from '../src/lib/lead-acquisition';

const currentOrigin = 'https://venkoi.vercel.app';

assert.equal(normalizeExternalReferrer('', currentOrigin), '');
assert.equal(normalizeExternalReferrer('not a URL', currentOrigin), '');
assert.equal(normalizeExternalReferrer('mailto:hello@example.com', currentOrigin), '');
assert.equal(normalizeExternalReferrer(' https://venkoi.vercel.app/en/demo?product=zaiko ', currentOrigin), '');
assert.equal(
  normalizeExternalReferrer(' https://example.com/article?foo=bar#section ', currentOrigin),
  'https://example.com/article'
);

for (const pathname of ['/en/contact', '/en/demo']) {
  const context = getLeadAcquisitionContext({
    href: `https://venkoi.vercel.app${pathname}?utm_source=newsletter&utm_medium=email&utm_campaign=launch&utm_content=hero`,
    pathname,
    referrer: 'https://www.google.com/search?q=restaurant+inventory'
  });
  assert.equal(context.source_path, pathname);
  assert.equal(context.referrer, 'https://www.google.com/search');
  assert.equal(context.utm_source, 'newsletter');
  assert.equal(context.utm_medium, 'email');
  assert.equal(context.utm_campaign, 'launch');
  assert.equal(context.utm_content, 'hero');
}

console.log('Lead acquisition regression checks passed.');
