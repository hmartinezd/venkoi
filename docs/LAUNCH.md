# Venkoi Launch Runbook

This runbook is the operational source of truth for Venkoi's external production services. It records completed production lead-persistence work separately from remaining operational work.

## Production lead persistence — done

The Neon production database is configured with Neon Auth off. Migrations `001` → `002` → `003` were applied manually in the Neon SQL Editor. Vercel Production receives `DATABASE_URL` through the Neon integration, and a new production deployment was created after configuration.

Production persistence has been manually verified end to end:

- Contact: `GENERAL_CONTACT`, `product = NULL`, `status = NEW`, `locale = en`, `source_path = /en/contact`.
- Demo: `DEMO`, `product = zaiko`, `early_access_interest = true`, `status = NEW`, `locale = en`, `source_path = /en/demo`.

The Demo row intentionally stores the stable product slug `zaiko`, not the registry-driven public display name. Do not require local `DATABASE_URL` or repeat these production submissions merely to re-prove this completed verification.

## Production email delivery — done

Resend's sending domain and required Vercel variables are configured. Live English Contact and Demo submissions confirmed both internal notifications and customer acknowledgements in production. Automated tests cover English and Spanish templates, but Spanish-language production delivery has not been manually verified.

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
| `RESEND_EMAIL_DOMAIN` | Server-only | Verified sending domain only; the application derives `Venkoi <notifications@{RESEND_EMAIL_DOMAIN}>`. |
| `LEADS_NOTIFICATION_EMAIL` | Server-only | Operational recipient for internal lead notifications. |
| `SITE_URL` | Server use, public value | Canonical public origin; production must be `https://venkoi.com`. |

Keep secrets out of source control and do not expose them through `NEXT_PUBLIC_*`. `VERCEL_ENV` and `NODE_ENV` are runtime/system variables used by the code, not custom secrets. Vercel supplies `VERCEL_ENV`; it does not belong in `.env.example` unless an operator deliberately simulates Vercel behavior locally.

`SITE_URL` defaults to `https://venkoi.com`. It accepts an absolute HTTPS origin only: no credentials, non-root path, query, fragment, whitespace, or control characters. A root trailing slash is normalized away; invalid values safely fall back to the canonical production origin. Preview deployments intentionally continue to emit production-origin canonicals while remaining `noindex`; canonical identity is never derived from request hosts or Vercel deployment hostnames.

## Environment matrix

| Environment | Indexability | `SITE_URL` | Lead persistence | Email | BotID |
| --- | --- | --- | --- | --- | --- |
| Local Development | `noindex`, `nofollow` under normal development runtime | Defaults to production origin; may be set for deliberate local testing | Not expected for ordinary site rendering; requires a safe local/test DB configuration | Not expected; requires safe test Resend configuration | Verification errors warn and processing continues |
| Vercel Preview | `noindex`, `nofollow`; robots disallow crawling | Keep `https://venkoi.com` for canonical URLs | Not required; do not share the Production database automatically. Use a separate Neon branch/database later only if needed | Not expected | Deployed behavior: bots blocked and verification errors fail closed |
| Vercel Production | `index`, `follow`; robots allow public pages and disallow `/api/` | `https://venkoi.com` | Configured and manually verified through Neon | Configured; Contact and Demo internal/customer delivery verified in English | Deployed behavior; continue operational monitoring |

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

The sending domain is verified and Vercel provides `RESEND_API_KEY`, the domain-only `RESEND_EMAIL_DOMAIN`, and the owner-configured `LEADS_NOTIFICATION_EMAIL`. The application derives `Venkoi <notifications@{RESEND_EMAIL_DOMAIN}>`; it rejects schemes, email addresses, and unsafe header content in the domain setting. Templates are source-owned React Email components, not Resend-hosted templates.

The code treats missing or invalid email configuration as a logged skip after persistence. Individual send failures are logged and do not roll back the lead. Live English Contact and Demo submissions have verified both delivery paths; Spanish production delivery remains unverified.

## Lead attribution semantics

`source_path` is the form submission route without a query string. `referrer` is the normalized external HTTP(S) document referrer when available, with query and fragment removed. Same-origin Venkoi referrers are intentionally discarded and must not be interpreted as the previous SPA route. Internal customer-journey tracking is not implemented in V1.

## Production status and remaining launch work

- [ ] Configure `venkoi.com`, DNS, and TLS/HTTPS in the production host.
- [ ] Set production `SITE_URL=https://venkoi.com`.
- [x] Create/configure the production Neon database with Neon Auth off.
- [x] Apply migrations `001` → `002` → `003` manually in numeric order.
- [x] Connect server-only `DATABASE_URL` to Vercel Production through Neon and redeploy.
- [x] Verify controlled production Contact and Demo submissions persisted the expected rows.
- [x] Verify Demo persistence stores the stable product slug `zaiko`.
- [ ] Confirm Neon retention/backups are appropriate for launch.
- [x] Configure Resend and verify the approved sending domain.
- [x] Configure `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN`, and `LEADS_NOTIFICATION_EMAIL` in Vercel Production.
- [ ] Configure production `SITE_URL` as intended. (`DATABASE_URL` is done.)
- [ ] Deploy to Vercel Production after the remaining environment configuration is complete.
- [ ] Verify BotID is active for `POST /api/leads` production traffic.
- [x] Confirm Contact and Demo internal notifications and user acknowledgements in English.
- [ ] Inspect production logs for database, email, and BotID errors after the controlled submissions.
- [ ] Verify sitemap, robots, canonical, hreflang, and social metadata behavior.
- [ ] Verify Vercel Analytics receives production traffic.
- [ ] Verify Vercel Speed Insights receives production traffic.
- [ ] Decide whether Privacy Policy / Terms pages are required for launch and provide approved legal content/routes if needed.
- [ ] Perform the final go/no-go review.

Privacy and Terms currently render as non-link footer text; no corresponding routes are established by this milestone. The owner and appropriate legal reviewer must decide whether approved pages are required. That review should consider the actual production use of lead data, Vercel Analytics, and Speed Insights. This runbook does not establish legal or retention policy.

## Manual lead verification matrix

The EN Contact and EN Demo persistence and email paths described above are already verified and do not need to be repeated. Use this matrix for future locale/interest coverage. Database rows and UI success are persistence checks; internal notification and user acknowledgement are separate email checks.

| Flow | Route / intent | Additional check |
| --- | --- | --- |
| EN Demo | `/en/demo?product=zaiko` | Zaiko demo submission |
| ES Demo | `/es/demo?product=zaiko` | Spanish acknowledgement |
| EN Contact | `/en/contact` | Test `mobile`, `web`, and `unsure` service interests |
| ES Contact | `/es/contacto` | Test `mobile`, `web`, and `unsure` service interests |
| Early Access | `?product=zaiko&interest=early-access` on each localized Demo route | Early Access flag persists while registry setting remains enabled |

Use a non-production environment for controlled failure-path testing. Confirm database failure yields submission failure, and email failure after persistence still yields submission success. Do not intentionally break production services.

## Domain cutover — owner checklist

These are external hosting actions and remain pending until the owner performs and verifies them:

1. [ ] Attach `venkoi.com` to the Vercel Production project.
2. [ ] Configure the exact DNS records Vercel currently requests for this project and domain; do not rely on copied generic A/CNAME values.
3. [ ] Wait for Vercel to verify the domain.
4. [ ] Confirm TLS is active and the HTTPS certificate is valid.
5. [ ] Set or confirm Production `SITE_URL=https://venkoi.com`.
6. [ ] Redeploy after the environment change if Vercel indicates that it is required.
7. [ ] Make `venkoi.com` the primary production domain.
8. [ ] If `www.venkoi.com` is attached, configure it to redirect to `venkoi.com`; keep the apex domain as the sole canonical origin.
9. [ ] Confirm old `*.vercel.app` deployment URLs do not appear as canonical, alternate, sitemap, or social metadata URLs.
10. [ ] Perform the controlled live SEO and platform verification below.

DNS and primary-domain redirects belong to Vercel/domain configuration, not application middleware.

## Live domain, SEO, and platform verification — after cutover

Domain and locales:

- [ ] `https://venkoi.com` loads successfully with a valid HTTPS certificate.
- [ ] Primary-domain behavior is correct, including the `www` → apex redirect if `www.venkoi.com` is attached.
- [ ] `/en` and `/es` load successfully.

SEO:

- [ ] Production `/robots.txt` allows public crawling, disallows `/api/`, and advertises `https://venkoi.com/sitemap.xml`.
- [ ] `/sitemap.xml` contains only intended canonical EN/ES public routes, locale alternates, and English `x-default`; Demo remains excluded.
- [ ] Representative EN and ES pages use `https://venkoi.com` canonical URLs.
- [ ] Representative pages expose correct `hreflang` values for `en` and `es`, with `x-default` pointing to English.
- [ ] Representative Open Graph URLs and social image URLs resolve through the canonical production origin.

Preview safety:

- [ ] A representative Vercel Preview remains `noindex`, `nofollow`, and its robots output disallows crawling.
- [ ] That Preview still points canonical, alternate, and Open Graph metadata at `https://venkoi.com`, never its `vercel.app` hostname.

Platform:

- [ ] Vercel Analytics shows real production traffic.
- [ ] Vercel Speed Insights begins receiving production observations.
- [ ] Inspect production logs for BotID, database, and email errors.
- [ ] Verify BotID operationally without intentional abusive or damaging production submissions.

The completed English Contact and Demo persistence/email checks do not need to be repeated solely for domain cutover. Repeat them only if the cutover creates a concrete lead-flow concern. Spanish production email delivery remains pending.

## Code-verifiable prerequisites

Before launch, run the locked install and quality gate on Node.js 24:

```bash
npm ci
npm run quality
```

This verifies lint (including deprecated API detection), type checking, routing/navigation, product configuration, lead/contact behavior, SEO/accessibility, rendering boundaries, page structures, platform modernization, content consistency, and the Next.js production build. Passing code checks does not complete any unchecked external launch item.

## Post-launch check

- [ ] Recheck Contact or Demo only if launch behavior creates a concrete concern; Spanish production email delivery remains pending.
- [ ] Review search indexing signals, sitemap, robots, canonicals, and alternates.
- [ ] Confirm Analytics and Speed Insights traffic.
- [ ] Review application logs for database, email, and BotID errors.
