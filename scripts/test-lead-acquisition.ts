import assert from 'node:assert/strict';
import { getLeadAcquisitionContext, normalizeExternalReferrer } from '../src/lib/lead-acquisition';

const currentOrigin = 'https://venkoi.vercel.app';

assert.equal(normalizeExternalReferrer('', currentOrigin), '');
assert.equal(normalizeExternalReferrer('not a URL', currentOrigin), '');
assert.equal(normalizeExternalReferrer('mailto:hello@example.com', currentOrigin), '');
assert.equal(normalizeExternalReferrer(' https://venkoi.vercel.app/en/demo?product=serve ', currentOrigin), '');
assert.equal(
  normalizeExternalReferrer(' https://example.com/article?foo=bar#section ', currentOrigin),
  'https://example.com/article'
);

for (const pathname of ['/en/contact', '/en/demo']) {
  const context = getLeadAcquisitionContext({
    href: `https://venkoi.vercel.app${pathname}?utm_source=newsletter&utm_medium=email&utm_campaign=launch&utm_content=hero&utm_term=restaurant%20inventory%20software&gclid=google-click&gbraid=google-branded&wbraid=google-web&unapproved=ignore`,
    pathname,
    referrer: 'https://www.google.com/search?q=restaurant+inventory'
  });
  assert.equal(context.source_path, pathname);
  assert.equal(context.referrer, 'https://www.google.com/search');
  assert.equal(context.utm_source, 'newsletter');
  assert.equal(context.utm_medium, 'email');
  assert.equal(context.utm_campaign, 'launch');
  assert.equal(context.utm_content, 'hero');
  assert.equal(context.utm_term, 'restaurant inventory software');
  assert.equal(context.gclid, 'google-click');
  assert.equal(context.gbraid, 'google-branded');
  assert.equal(context.wbraid, 'google-web');
  assert.equal('unapproved' in context, false);
}

console.log('Lead acquisition regression checks passed.');
