# Venkoi V1 technical data-handling inventory

> Internal technical/data-governance document. This inventory describes repository-observed implementation facts and recorded operational state. It is not a Privacy Policy, Terms of Service, legal advice, or a claim of regulatory compliance.

## Scope and status labels

- **Observed implementation fact** means the behavior is established by the current repository.
- **Recorded operational decision/fact** means the repository documentation records an owner or production decision already made; it is not independently re-verified by this code audit.
- **Unresolved owner/legal decision** means the repository does not establish the answer.

This inventory covers the V1 Contact and Demo lead flows. It does not infer vendor-side retention, logging, cookies, contracts, or other behavior that cannot be determined from repository code.

## Contact data inventory

The Contact UI submits either `GENERAL_CONTACT` or `CUSTOM_PROJECT`. Blank optional strings are normalized to `null` before persistence.

| Category | Field | Required/current behavior |
| --- | --- | --- |
| Identity/contact | `name` | Required by the Contact UI and server validation; maximum 200 characters. |
| Identity/contact | `email` | Required, trimmed, lowercased, email-validated; maximum 255 characters. |
| Identity/contact | `phone` | Optional; maximum 50 characters. |
| Business/project | `company` | Optional; maximum 200 characters. |
| Business/project | `interest` | Optional; current canonical values are `mobile`, `web`, and `unsure`. Incoming `website` and `web_application` are normalized to `web`. |
| Business/project | `project_stage` | Optional; `idea`, `planning`, `existing_product`, or `needs_improvement`. |
| Business/project | `message` | Required; maximum 5,000 characters. |
| Context | `locale` | `en` or `es`; the form supplies its current locale. |
| Context | `source_path` | Optional submission route. |
| Context | `referrer` | Optional normalized external HTTP(S) referrer. |
| Context | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` | Optional values read from the current submission URL; each maximum 100 characters. |
| Technical/internal | `id` | Server-generated lead ID. |
| Technical/internal | `lead_type` | `GENERAL_CONTACT` or `CUSTOM_PROJECT`. |
| Technical/internal | `status` | Created as `NEW`. |
| Technical/internal | `created_at` | Server-generated ISO timestamp, persisted as `TIMESTAMPTZ`. |

The form also sends a hidden `website` honeypot. It is validation-only: a non-empty value rejects the submission, and it is not part of `LeadRecord` or the database insert.

## Demo data inventory

The Demo UI submits `DEMO`. Blank optional strings are normalized to `null` before persistence.

| Category | Field | Required/current behavior |
| --- | --- | --- |
| Identity/contact | `first_name` | Required; maximum 100 characters. |
| Identity/contact | `last_name` | Required; maximum 100 characters. |
| Identity/contact | `email` | Required, trimmed, lowercased, email-validated; maximum 255 characters. |
| Identity/contact | `phone` | Optional; maximum 50 characters. |
| Restaurant/business | `company` | Required; maximum 200 characters. |
| Restaurant/business | `location_count` | Optional; `1`, `2_5`, `6_20`, or `20_plus`. |
| Restaurant/business | `current_system` | Optional; `none`, `spreadsheet`, `pos_tools`, or `other`. |
| Restaurant/business | `message` | Optional; maximum 5,000 characters. |
| Product/funnel | `product` | Required for Demo and must resolve to a Demo-enabled registry product. The stored stable technical slug is `zaiko`; it is distinct from the registry-driven human-facing display name and must not be renamed by presentation changes. |
| Product/funnel | `early_access_interest` | Boolean free-offer interest flag; defaults to `false`. |
| Context | `locale` | `en` or `es`. |
| Context | `source_path`, `referrer`, UTM fields | Same behavior and limits as Contact. |
| Technical/internal | `id`, `lead_type`, `status`, `created_at` | Server ID; `DEMO`; initial `NEW`; creation timestamp. |

The repository also derives and persists the composite `name` for Demo from first and last name. The `website` honeypot has the same validation-only behavior as Contact.

## Current technical data flow

Observed flow:

`Browser form` → `POST /api/leads` → BotID check, body limits, JSON parsing, Zod validation and honeypot check → Neon PostgreSQL persistence → Resend internal notification and customer acknowledgement attempts.

Persistence is required for API success. Email is attempted after persistence; missing configuration or delivery failure is logged using the internal lead ID and does not turn a persisted submission into failure. Both email deliveries are started together and settled independently.

### External services involved in the current technical data flow

| Service | Repository-observed involvement | Information sent or necessarily exposed by this implementation |
| --- | --- | --- |
| Vercel | Hosts the Next.js application/API according to the documented deployment architecture. | Requests to the site and `/api/leads` necessarily reach the hosting runtime. Exact platform-side request logging, retention, and metadata handling are not determined from repository code. |
| Neon | `@neondatabase/serverless` inserts validated lead records into PostgreSQL using server-only `DATABASE_URL`. | All persisted fields listed below. Vendor-side behavior beyond the SQL operation is not determined from repository code. |
| Resend | Sends two transactional emails after persistence using server-only configuration. | Recipient/sender/reply-to addresses, subject, rendered HTML/text, idempotency key containing the lead ID, and the email content described below. Vendor-side retention and logging are not determined from repository code. |
| Vercel Analytics | `<Analytics />` enables platform analytics and `track()` sends the custom events below. | Custom event name plus the allowlisted non-PII properties below. Other automatic collection or vendor-side behavior is not determined from repository code. |
| Vercel Speed Insights | `<SpeedInsights />` is mounted in the locale layout. | Performance observations are enabled. Exact fields and vendor-side behavior are not determined from repository code. |
| BotID | Client instrumentation protects `POST /api/leads`; the API calls `checkBotId()` before reading the submitted body. | A verification request/decision is involved before lead processing. Exact signals and vendor-side behavior are not determined from repository code. |

## Neon persistence facts

The insert persists: `id`, `lead_type`, `product`, `first_name`, `last_name`, derived `name`, `email`, `phone`, `company`, `location_count`, `current_system`, `interest`, `project_stage`, `message`, `early_access_interest`, `locale`, `source_path`, four UTM fields, `referrer`, `status`, and `created_at`.

The application creates IDs with a `lead_` prefix, time component, and random bytes; creates every record with status `NEW`; and supplies an ISO creation timestamp. The database also defaults `early_access_interest` to false, `status` to `NEW`, and `created_at` to the current timestamp. Migrations make those three columns non-null and constrain lead type, locale, status, location count, current system, interest, and project stage. Email is non-null. Length limits are represented in both validation and applicable `VARCHAR` columns; `message` is `TEXT` with the application enforcing 5,000 characters.

The database permits current canonical interests plus specified historical compatibility values. Application validation emits `mobile`, `web`, or `unsure`. Demo product validation is registry-driven; current production verification records the stable `zaiko` slug, not the display name.

No repository-managed deletion job, anonymization job, or lead administration interface was found. **Recorded operational decision:** unconverted Contact, Demo, and Early Access lead records should ordinarily be retained for up to 24 months from the last meaningful interaction, then deleted or anonymized unless a legitimate legal, security, dispute, or ongoing-business reason requires longer retention. Customer conversion may place the record under a later customer/business-record policy. Automated enforcement is not implemented; an owner-operated review and deletion/anonymization process remains required. No destructive automation or database migration is introduced by this milestone.

## Transactional email exposure

### Internal notification

- Recipient: server-configured `LEADS_NOTIFICATION_EMAIL`.
- Reply-To: the submitted lead email address.
- It always contains lead type. When present, it may contain registry-resolved product display name, free-offer interest, name, email, phone, company, location count, current system, service interest, project stage, message, locale, source path, UTM values, normalized referrer, lead ID, and creation time.
- The subject may contain the lead name/first name/email and a registry-driven product display name. Product presentation is resolved from the stored slug; an unresolved slug is used as fallback text.

### Customer acknowledgement

- Recipient: the submitted lead email address.
- Reply-To: `LEADS_NOTIFICATION_EMAIL`.
- It contains a greeting using first name or composite name (with a localized fallback), confirmation of Contact or Demo receipt, next-step copy, and reply instructions. Demo messages can contain the registry-driven product display name.
- Content is selected from `lead.locale`: English for `en`, Spanish for `es`.
- If the free-offer flag is true, the acknowledgement includes localized offer text. For a registry-resolved product this includes display name and configured free-month count.

The Resend API key is read only on the server and is not placed in email content or logs.

## Analytics event and PII audit

`trackCustomEvent` accepts only `locale`, `product`, `source`, `earlyAccess`, `leadType`, and `interest`, then rebuilds an allowlisted property object before calling Vercel Analytics. Current events are:

| Event | Current properties |
| --- | --- |
| `zaiko_demo_cta`, `zaiko_early_access_cta` | `locale`, technical analytics product identity, CTA `source`, and where applicable `earlyAccess`. |
| `services_cta` | `locale`, CTA `source`, and where applicable service `interest`. |
| `demo_form_start`, `demo_form_submit`, `demo_form_success` | `locale`, stable product slug, `earlyAccess`. |
| `contact_form_start`, `contact_form_submit`, `contact_form_success` | `locale`, `leadType`, service `interest`. |
| `language_switch` | destination `locale`, UI-location `source`. |

No current custom event sends name, first/last name, email, phone, company, message, the complete lead payload, referrer, or UTM values. No new analytics events were added by this audit.

## Logging audit

Lead-path logs use fixed operational text, provider error messages, and/or the stable internal lead ID. They do not intentionally log submitted names, email addresses, phone numbers, companies, messages, or complete payloads. Validation and bot-block responses do not log the submitted body. Database initialization logging is deliberately fixed text so a thrown configuration error cannot print a connection credential. Provider/database messages are not intentionally supplied the raw payload; whether a provider-generated message contains additional details is not determined from repository code.

## Browser storage, cookies, and attribution

No application-authored use of `localStorage`, `sessionStorage`, `document.cookie`, Next `cookies()`, IndexedDB, browser fingerprinting APIs, or persistent attribution storage was found in the current repository. Lead acquisition context is held in an in-memory React ref for the form instance only.

This finding does not establish that external platforms create no cookies or browser storage. Third-party/platform behavior is not determined from repository code.

Attribution contract:

- `source_path` is the form submission route (`window.location.pathname`), without query or fragment.
- `referrer` is a normalized external HTTP(S) `document.referrer`, when available.
- Same-origin Venkoi referrers are discarded.
- External referrer query strings and fragments are discarded; only origin and pathname remain.
- UTM values are read from the current Venkoi URL and stored only in `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content`.
- There is no previous-SPA-page tracking, session journey tracking, fingerprinting, or cross-session attribution.

## Environment and secret contract

| Variable | Repository role |
| --- | --- |
| `DATABASE_URL` | Server-only Neon connection credential/configuration. |
| `RESEND_API_KEY` | Server-only Resend credential. |
| `RESEND_EMAIL_DOMAIN` | Server-only sending-domain configuration. |
| `LEADS_NOTIFICATION_EMAIL` | Server-only operational recipient/reply address. |
| `SITE_URL` | Server-side canonical-origin configuration with a public value; not classified as a secret. |
| `VERCEL_ENV`, `NODE_ENV` | System/runtime variables used to select deployed, preview, or production behavior. |

No sensitive service configuration is exposed through a `NEXT_PUBLIC_*` variable in the current source or `.env.example`. Committed examples do not contain database/API credentials or the operational notification address.

## Recorded production and public-UI status

Repository documentation records Neon Contact and Demo persistence, stable `zaiko` slug persistence, Resend sending, English Contact/Demo internal notification and acknowledgement delivery, and the canonical production-origin code contract as verified. These are recorded operational facts, not re-tested against live services in this audit.

The following remain pending: completion of the `venkoi.com` primary-domain correction, live Analytics traffic, live Speed Insights, live BotID operation, Spanish production email delivery, operational retention enforcement, and final go/no-go.

Spanish production email delivery remains pending manual verification.

The `venkoi.com` cutover correction remains pending because the primary-domain redirect is still reversed, as detailed in the launch runbook.

Localized public Privacy Policy and Website Terms of Use routes exist in English and Spanish and are linked from the footer. The published privacy contact is `privacy@venkoi.com`. The policies cover the current marketing website, Contact, Demo, and Early Access flows; they do not purport to govern future authenticated or paid products. No consent banner or consent-management platform is present or introduced.

Recorded operational decisions for V1: Venkoi does not currently operate a marketing mailing list, sell personal information, or use submitted lead information for third-party targeted advertising. Contact, Demo, and Early Access responses are transactional or direct responses to the submitted request.

## Operational and future product decisions still required

- Configure and verify mailbox or forwarding delivery for `privacy@venkoi.com` outside this repository.
- Establish and execute the operational review that deletes or anonymizes eligible leads under the 24-month rule; automation is intentionally deferred.
- Review any future marketing email system before implementation; none currently exists.
- Review Zaiko separately before authenticated or paid SaaS launch, including Product Terms of Service, subscription/payment terms, account and customer-data rules, product-specific privacy and retention/deletion provisions, data-processing agreements where appropriate, and product security/legal requirements.
- Determine whether vendor agreements or other contractual documentation need separate review.
