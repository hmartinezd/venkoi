# Venkoi Launch Runbook

This runbook is the operational source of truth for activating Venkoi's external production services. It documents work to perform and verify; it does not prove that any external resource currently exists.

## Deferred Production Infrastructure

The application is **code-ready**, but the lead pipeline is not **operationally configured** merely because its Neon, Resend, and BotID integrations exist in the repository. Treat production lead submission as a launch blocker until every applicable external checklist item below has been completed.

Contact and Demo UI and validation can work without production services. Validation alone is not lead success: `POST /api/leads` must persist the validated lead to PostgreSQL. A missing, invalid, or unavailable database returns `SUBMISSION_ERROR`. After persistence, unavailable or failed email delivery is logged but the submission remains successful because the lead is safely stored.

The endpoint uses Vercel BotID before processing a request. In environments considered deployed by the code (Vercel preview or production, and non-Vercel `NODE_ENV=production`), a BotID verification error fails closed with `SUBMISSION_ERROR`; an identified bot receives `BOT_BLOCKED`. In local development, a BotID verification error is logged as a warning and processing continues. Verify actual production behavior rather than inferring it from source.

No external error-monitoring or alerting service is present in this repository. Adding one is an optional future operational enhancement; current behavior uses application logs.

## Product configuration

`src/lib/products.ts` is the source of truth. At the time of this runbook, its featured product is Zaiko (`id` and `slug` `zaiko`, `routeKey` `productsZaiko`, analytics identity `zaiko`), with status `available`, Early Access enabled for three free months, Demo enabled, and Pricing disabled. Re-check the registry at launch instead of treating this summary as an operational constant. Product identity is not an environment variable.

## Environment contract

| Variable | Scope | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Server-only | Neon PostgreSQL connection used for required lead persistence. |
| `RESEND_API_KEY` | Server-only secret | Authenticates transactional email delivery. |
| `RESEND_FROM_EMAIL` | Server-only | Verified Resend sender identity. |
| `LEADS_NOTIFICATION_EMAIL` | Server-only | Operational recipient for internal lead notifications. |
| `SITE_URL` | Server use, public value | Canonical public origin; production must be `https://venkoi.com`. |

Keep secrets out of source control and do not expose them through `NEXT_PUBLIC_*`. `VERCEL_ENV` and `NODE_ENV` are runtime/system variables used by the code, not custom secrets. Vercel supplies `VERCEL_ENV`; it does not belong in `.env.example` unless an operator deliberately simulates Vercel behavior locally.

`SITE_URL` defaults to `https://venkoi.com` and trailing slashes are removed. Preview deployments should continue to emit production-origin canonicals, not preview-specific canonical URLs.

## Environment matrix

| Environment | Indexability | `SITE_URL` | Lead persistence | Email | BotID |
| --- | --- | --- | --- | --- | --- |
| Local Development | `noindex`, `nofollow` under normal development runtime | Defaults to production origin; may be set for deliberate local testing | Not expected for ordinary site rendering; requires a safe local/test DB configuration | Not expected; requires safe test Resend configuration | Verification errors warn and processing continues |
| Vercel Preview | `noindex`, `nofollow`; robots disallow crawling | Keep `https://venkoi.com` for canonical URLs | Only expected if preview-safe infrastructure is intentionally configured | Only expected if preview-safe email is intentionally configured | Deployed behavior: bots blocked and verification errors fail closed |
| Vercel Production | `index`, `follow`; robots allow public pages and disallow `/api/` | `https://venkoi.com` | Required for successful form submissions | Expected after persistence once Resend is configured | Deployed behavior; must be verified on live lead POST traffic |

## Database migrations

Apply the SQL migrations deliberately and in numeric order. The application does not auto-migrate during startup or build, and the repository has no migration ledger table or automatic migration-state tracking.

1. `001_create_leads.sql` creates the initial `leads` table, lead fields, defaults, and indexes for creation time, email, and type/status.
2. `002_harden_leads.sql` makes early-access interest, status, and creation time non-null with defaults, then adds checks for lead type, locale, status, location count, current system, service interest, and project stage.
3. `003_update_service_interests.sql` replaces the service-interest check. The database constraint permits `mobile`, `website`, `web_application`, `unsure`, and historical `web`, `custom_business_software`, and `product_development` rows. Current application validation emits canonical `mobile`, `web`, and `unsure`, normalizing incoming `website` and `web_application` to `web` before persistence.

For a fresh database, always run:

```bash
psql "$DATABASE_URL" -f db/migrations/001_create_leads.sql
psql "$DATABASE_URL" -f db/migrations/002_harden_leads.sql
psql "$DATABASE_URL" -f db/migrations/003_update_service_interests.sql
```

The Neon SQL Editor/Console may be used instead, preserving the same `001` → `002` → `003` order. For an existing database, first determine its actual migration and schema state. Do not assume migration 002 was applied merely because the database exists; apply only the missing migrations in order and verify the resulting table, indexes, defaults, nullability, and named checks against the SQL files.

## Resend setup

Perform this only after database persistence is verified:

1. Create or configure the Resend account.
2. Verify the approved sending domain.
3. Create an API key.
4. Set `RESEND_FROM_EMAIL` to an approved sender (for example only: `Venkoi <notifications@venkoi.com>`).
5. Set `LEADS_NOTIFICATION_EMAIL` to the operational recipient.
6. Test both the internal notification and user acknowledgement.

Do not assume a sender mailbox is approved until Resend confirms it. The code treats missing email configuration as a logged skip after persistence; individual send failures are also logged and do not roll back the lead.

## Required launch order

- [ ] Configure `venkoi.com`, DNS, and TLS/HTTPS in the production host.
- [ ] Set production `SITE_URL=https://venkoi.com`.
- [ ] Create/configure the production Neon database and restrict access appropriately.
- [ ] Determine the database's current migration state.
- [ ] Apply migrations `001` → `002` → `003`, without skipping order.
- [ ] Verify the production schema, indexes, defaults, nullability, and constraints against the migration SQL.
- [ ] Confirm Neon retention/backups are appropriate for launch.
- [ ] Configure Resend and verify the approved sending domain.
- [ ] Create the Resend API key and configure the approved sender and notification recipient.
- [ ] Configure `DATABASE_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEADS_NOTIFICATION_EMAIL`, and `SITE_URL` in Vercel Production only as intended.
- [ ] Deploy to Vercel Production after environment configuration is complete.
- [ ] Verify BotID is active for `POST /api/leads` production traffic.
- [ ] Complete controlled live lead submissions and confirm database rows.
- [ ] Confirm both internal notifications and user acknowledgements.
- [ ] Inspect production logs for database, email, and BotID errors after the controlled submissions.
- [ ] Verify sitemap, robots, canonical, hreflang, and social metadata behavior.
- [ ] Verify Vercel Analytics receives production traffic.
- [ ] Verify Vercel Speed Insights receives production traffic.
- [ ] Decide whether Privacy Policy / Terms pages are required for launch and provide approved legal content/routes if needed.
- [ ] Perform the final go/no-go review.

Privacy and Terms currently render as non-link footer text; no corresponding routes are established by this milestone. The owner and appropriate legal reviewer must decide whether approved pages are required. That review should consider the actual production use of lead data, Vercel Analytics, and Speed Insights. This runbook does not establish legal or retention policy.

## Manual lead verification matrix

Run these checks only after production infrastructure is intentionally configured. For every row, verify a valid submission, the database row, internal notification, user acknowledgement, and success UI.

| Flow | Route / intent | Additional check |
| --- | --- | --- |
| EN Demo | `/en/demo?product=zaiko` | Zaiko demo submission |
| ES Demo | `/es/demo?product=zaiko` | Spanish acknowledgement |
| EN Contact | `/en/contact` | Test `mobile`, `web`, and `unsure` service interests |
| ES Contact | `/es/contacto` | Test `mobile`, `web`, and `unsure` service interests |
| Early Access | `?product=zaiko&interest=early-access` on each localized Demo route | Early Access flag persists while registry setting remains enabled |

Use a non-production environment for controlled failure-path testing. Confirm database failure yields submission failure, and email failure after persistence still yields submission success. Do not intentionally break production services.

## SEO and platform verification

- [ ] Confirm `https://venkoi.com/sitemap.xml` is valid and contains intended EN/ES routes and alternates.
- [ ] Confirm production `robots.txt` allows public pages, disallows `/api/`, and references the sitemap.
- [ ] Confirm a preview deployment remains `noindex`, `nofollow`, with crawling disallowed.
- [ ] Inspect live canonical and `hreflang`/`x-default` URLs and confirm they use `https://venkoi.com`.
- [ ] Verify Open Graph and Twitter metadata/assets on representative EN/ES pages.
- [ ] Confirm Vercel Analytics and Speed Insights receive production traffic after consent/legal decisions are resolved as applicable.

## Code-verifiable prerequisites

Before launch, run the locked install and quality gate on Node.js 24:

```bash
npm ci
npm run quality
```

This verifies lint (including deprecated API detection), type checking, routing/navigation, product configuration, lead/contact behavior, SEO/accessibility, rendering boundaries, page structures, platform modernization, content consistency, and the Next.js production build. Passing code checks does not complete any unchecked external launch item.

## Post-launch check

- [ ] Recheck EN/ES Contact and Demo submissions and delivered emails.
- [ ] Review search indexing signals, sitemap, robots, canonicals, and alternates.
- [ ] Confirm Analytics and Speed Insights traffic.
- [ ] Review application logs for database, email, and BotID errors.
