import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FEATURED_PRODUCT } from '../src/lib/products';
import {
  buildInternalNotificationEmail,
  renderInternalNotificationHtml,
  renderUserAcknowledgementHtml,
  sendInternalNotificationEmail,
  sendLeadEmails,
  sendUserAcknowledgementEmail,
  buildUserAcknowledgementEmail,
  type LeadProductResolver
} from '../src/server/email/lead-emails';
import { buildResendFromAddress, getEmailConfig, normalizeResendEmailDomain, type EmailConfig, type EmailSender } from '../src/server/email/client';
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
assert.match(buildInternalNotificationEmail(lead()).text, /UTM content: hero/);

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

assert.equal(buildResendFromAddress(' send.venkoi.com '), 'Venkoi <notifications@send.venkoi.com>');
assert.equal(normalizeResendEmailDomain('SEND.VENKOI.COM'), 'send.venkoi.com');
for (const invalid of ['', 'https://send.venkoi.com', 'notifications@send.venkoi.com', 'send.venkoi.com\r\nBcc: attacker@example.com', 'localhost', '-bad.example']) {
  assert.equal(buildResendFromAddress(invalid), null, `Invalid domain should be rejected: ${JSON.stringify(invalid)}`);
}

const originalEnv = { ...process.env };
delete process.env.RESEND_API_KEY;
delete process.env.RESEND_EMAIL_DOMAIN;
delete process.env.LEADS_NOTIFICATION_EMAIL;
process.env.RESEND_FROM_EMAIL = 'Venkoi <old@example.com>';
assert.equal(getEmailConfig(), null, 'The obsolete RESEND_FROM_EMAIL variable must not satisfy configuration');
for (const key of ['RESEND_API_KEY', 'RESEND_EMAIL_DOMAIN', 'LEADS_NOTIFICATION_EMAIL', 'RESEND_FROM_EMAIL']) {
  if (originalEnv[key] === undefined) delete process.env[key];
  else process.env[key] = originalEnv[key];
}

async function runAsyncTests() {
const englishHtml = await renderUserAcknowledgementHtml(earlyAccessLead);
assert.match(englishHtml, /<html[^>]+lang="en"/);
assert.match(englishHtml, new RegExp(FEATURED_PRODUCT.name));
assert.match(englishHtml, new RegExp(`free for ${FEATURED_PRODUCT.earlyAccess.freeMonths} months`));
const spanishHtml = await renderUserAcknowledgementHtml({ ...earlyAccessLead, locale: 'es' });
assert.match(spanishHtml, /<html[^>]+lang="es"/);
assert.match(spanishHtml, new RegExp(`gratis durante ${FEATURED_PRODUCT.earlyAccess.freeMonths} meses`));
const internalHtml = await renderInternalNotificationHtml(lead());
assert.match(internalHtml, /Harbor Kitchen/);
assert.match(internalHtml, /lead_email_test/);

type RecordedSend = { payload: Parameters<EmailSender['emails']['send']>[0]; options: Parameters<EmailSender['emails']['send']>[1] };
function fakeConfig(errorForRecipient?: string): { config: EmailConfig; sends: RecordedSend[] } {
  const sends: RecordedSend[] = [];
  return {
    sends,
    config: {
      fromEmail: 'Venkoi <notifications@send.venkoi.com>',
      notificationEmail: 'leads@venkoi.com',
      resend: { emails: { send: async (payload, options) => {
        sends.push({ payload, options });
        return { data: errorForRecipient === payload.to ? null : { id: 'email_test' }, error: errorForRecipient === payload.to ? { message: 'provider detail' } : null };
      } } }
    }
  };
}

const successful = fakeConfig();
await sendInternalNotificationEmail(lead(), successful.config);
await sendUserAcknowledgementEmail(lead(), successful.config);
assert.equal(successful.sends[0].payload.replyTo, 'jamie@example.com');
assert.equal(successful.sends[1].payload.replyTo, 'leads@venkoi.com');
assert.equal(successful.sends[0].options.idempotencyKey, 'venkoi-lead-internal/lead_email_test');
assert.equal(successful.sends[1].options.idempotencyKey, 'venkoi-lead-ack/lead_email_test');
assert.notEqual(successful.sends[0].options.idempotencyKey, successful.sends[1].options.idempotencyKey);
for (const send of successful.sends) {
  assert.ok(send.payload.html);
  assert.ok(send.payload.text);
}

const rejected = fakeConfig('jamie@example.com');
await assert.rejects(() => sendUserAcknowledgementEmail(lead(), rejected.config), /Resend rejected/);
const independent = fakeConfig('jamie@example.com');
const originalError = console.error;
console.error = () => undefined;
await sendLeadEmails(lead(), independent.config);
console.error = originalError;
assert.equal(independent.sends.length, 2, 'Both deliveries should be attempted independently');
assert.ok(independent.sends.some(({ payload }) => payload.to === 'leads@venkoi.com'));

const emailSources = [readFileSync('src/server/email/client.ts', 'utf8'), readFileSync('src/server/email/lead-emails.tsx', 'utf8')].join('\n');
assert.doesNotMatch(emailSources, /NEXT_PUBLIC_(?:RESEND|LEADS)/);

console.log('Lead email regression checks passed.');
}

runAsyncTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
