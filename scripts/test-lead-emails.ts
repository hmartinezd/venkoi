import assert from 'node:assert/strict';
import { FEATURED_PRODUCT } from '../src/lib/products';
import {
  buildInternalNotificationEmail,
  buildUserAcknowledgementEmail,
  type LeadProductResolver
} from '../src/server/email/lead-emails';
import type { LeadRecord, LeadType } from '../src/server/leads/types';

function lead(overrides: Partial<LeadRecord> = {}): LeadRecord {
  return {
    id: 'lead_email_test',
    lead_type: 'DEMO',
    product: FEATURED_PRODUCT.slug,
    first_name: 'Jamie',
    last_name: 'Rivera',
    name: 'Jamie Rivera',
    email: 'jamie@example.com',
    phone: null,
    company: 'Harbor Kitchen',
    location_count: '2_5',
    current_system: 'spreadsheet',
    interest: null,
    project_stage: null,
    message: 'Please arrange a demo.',
    early_access_interest: false,
    locale: 'en',
    source_path: '/en/demo',
    utm_source: 'newsletter',
    utm_medium: 'email',
    utm_campaign: 'launch',
    utm_content: 'hero',
    referrer: null,
    status: 'NEW',
    created_at: '2026-08-10T00:00:00.000Z',
    ...overrides
  };
}

const english = buildUserAcknowledgementEmail(lead());
assert.match(english.subject, new RegExp(FEATURED_PRODUCT.name));
assert.match(english.text, new RegExp(FEATURED_PRODUCT.name));

const spanish = buildUserAcknowledgementEmail(lead({ locale: 'es' }));
assert.match(spanish.subject, new RegExp(FEATURED_PRODUCT.name));
assert.match(spanish.text, new RegExp(FEATURED_PRODUCT.name));

const earlyAccessLead = lead({ early_access_interest: true });
const earlyAccess = buildUserAcknowledgementEmail(earlyAccessLead);
assert.match(earlyAccess.text, new RegExp(`${FEATURED_PRODUCT.name} free for ${FEATURED_PRODUCT.earlyAccess.freeMonths} months`));
assert.doesNotMatch(earlyAccess.text, /Early Access/i);
const spanishOffer = buildUserAcknowledgementEmail({ ...earlyAccessLead, locale: 'es' });
assert.match(spanishOffer.text, new RegExp(`${FEATURED_PRODUCT.name} gratis durante ${FEATURED_PRODUCT.earlyAccess.freeMonths} meses`));
assert.doesNotMatch(spanishOffer.text, /acceso anticipado/i);
assert.match(buildInternalNotificationEmail(lead()).subject, new RegExp(`${FEATURED_PRODUCT.name} Demo`));
assert.match(
  buildInternalNotificationEmail(earlyAccessLead).subject,
  new RegExp(`${FEATURED_PRODUCT.name} ${FEATURED_PRODUCT.earlyAccess.freeMonths}-Month Free Offer Demo`)
);
assert.match(buildInternalNotificationEmail(lead()).text, /UTM Content: hero/);

const alternateResolver: LeadProductResolver = (slug) =>
  slug === 'rename-test'
    ? { name: 'Rename Test Product', earlyAccess: { enabled: true, freeMonths: 7 } }
    : undefined;
const alternateLead = lead({ product: 'rename-test', early_access_interest: true });
for (const content of [
  buildInternalNotificationEmail(alternateLead, alternateResolver),
  buildUserAcknowledgementEmail(alternateLead, alternateResolver),
  buildUserAcknowledgementEmail({ ...alternateLead, locale: 'es' }, alternateResolver)
]) {
  assert.match(`${content.subject}\n${content.text}`, /Rename Test Product/);
  assert.match(`${content.subject}\n${content.text}`, /7/);
  assert.doesNotMatch(`${content.subject}\n${content.text}`, new RegExp(FEATURED_PRODUCT.name, 'i'));
}

const unknown = buildUserAcknowledgementEmail(lead({ product: 'historical-product', early_access_interest: true }));
assert.match(`${unknown.subject}\n${unknown.text}`, /historical-product/);
assert.doesNotMatch(`${unknown.subject}\n${unknown.text}`, /\b\d+[ -]months?\b/i);
assert.doesNotMatch(`${unknown.subject}\n${unknown.text}`, new RegExp(FEATURED_PRODUCT.name, 'i'));
assert.doesNotThrow(() => buildInternalNotificationEmail(lead({ product: null })));
assert.equal(buildUserAcknowledgementEmail(lead({ product: null })).subject, 'We received your demo request');
assert.equal(buildUserAcknowledgementEmail(lead({ product: null, locale: 'es' })).subject, 'Recibimos tu solicitud de demo');

for (const leadType of ['GENERAL_CONTACT', 'CUSTOM_PROJECT'] satisfies LeadType[]) {
  const generic = buildUserAcknowledgementEmail(lead({ lead_type: leadType, product: null }));
  assert.equal(generic.subject, 'We received your message — Venkoi');
  assert.doesNotMatch(`${generic.subject}\n${generic.text}`, new RegExp(FEATURED_PRODUCT.name, 'i'));
}

console.log('Lead email regression checks passed.');
