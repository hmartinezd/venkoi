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

- [ ] Configure `venkoi.com`, DNS, and TLS/HTTPS in the production host. Both hostnames serve valid HTTPS, but the primary-domain redirect is reversed; see the 2026-08-11 verification below.
- [ ] Set production `SITE_URL=https://venkoi.com`.
- [x] Create/configure the production Neon database with Neon Auth off.
- [x] Apply migrations `001` → `002` → `003` manually in numeric order.
- [x] Connect server-only `DATABASE_URL` to Vercel Production through Neon and redeploy.
- [x] Verify controlled production Contact and Demo submissions persisted the expected rows.
- [x] Verify Demo persistence stores the stable product slug `zaiko`.
- [x] Adopt the V1 lead-retention baseline: ordinarily up to 24 months from the last meaningful interaction for unconverted Contact, Demo, and Early Access leads.
- [ ] Establish the operational review and deletion/anonymization process for records eligible under the 24-month rule. No automated destructive cleanup exists.
- [x] Configure Resend and verify the approved sending domain.
- [x] Configure `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN`, and `LEADS_NOTIFICATION_EMAIL` in Vercel Production.
- [ ] Configure production `SITE_URL` as intended. (`DATABASE_URL` is done.)
- [x] Deploy the current `main` commit to Vercel Production. GitHub/Vercel deployment status and the live responses identify commit `838599c` as deployed.
- [ ] Verify BotID is active for `POST /api/leads` production traffic.
- [x] Confirm Contact and Demo internal notifications and user acknowledgements in English.
- [ ] Inspect production logs for database, email, and BotID errors after the controlled submissions.
- [ ] Verify sitemap, robots, canonical, hreflang, and social metadata behavior. The HTML/XML output passed, but the hosting redirect and response `Link` headers still expose `www`; see the 2026-08-11 verification below.
- [ ] Verify Vercel Analytics receives production traffic.
- [ ] Verify Vercel Speed Insights receives production traffic.
- [x] Publish localized Privacy Policy and Website Terms routes and localized footer links.
- [ ] Configure and verify `privacy@venkoi.com` mailbox or forwarding outside the repository.
- [ ] Perform the final go/no-go review.

Privacy is published at `/en/privacy` and `/es/privacidad`; Website Terms are published at `/en/terms` and `/es/terminos`. They are crawlable, included in the sitemap at low priority, and linked from the localized footer. They cover the current marketing website and lead flows only. The approved V1 retention baseline is up to 24 months from the last meaningful interaction for unconverted leads, followed by deletion or anonymization unless a documented exception applies. Enforcement is operational and is not automated.

Before authenticated or paid Zaiko functionality launches, perform a separate product legal review covering Product Terms, subscriptions/payments, accounts and customer data, product privacy and retention/deletion, DPAs where appropriate, and product security/legal requirements.

## Production-domain verification — 2026-08-11

Verification was performed against clean local `main` at commit `838599c`, which matched `origin/main`, using safe HTTPS `GET`/`HEAD` requests. No production lead was submitted.

### Verified live

- [x] TLS validation succeeds for both `venkoi.com` and `www.venkoi.com`. Both present valid Let's Encrypt certificates and HTTPS responses include HSTS.
- [x] `/en` and `/es` render successfully with HTTP 200 responses after the current domain redirect.
- [x] `/robots.txt` allows `/`, disallows `/api/`, and advertises `https://venkoi.com/sitemap.xml`.
- [x] `/sitemap.xml` contains 22 intended EN/ES canonical entries, including correct EN, ES, and English `x-default` alternates. Demo is excluded, while the intended public Contact routes remain included. No `www.venkoi.com` or `*.vercel.app` URL appears in its XML.
- [x] Representative EN/ES home, Zaiko, Services, Insights, and insight-article HTML uses `https://venkoi.com` for canonical URLs, EN/ES alternates, English `x-default`, and Open Graph URLs. Pages with generated Open Graph/Twitter images use `https://venkoi.com` image URLs, and sampled image endpoints return HTTP 200 PNG responses.
- [x] Representative production pages emit `index, follow` robots metadata.

### Launch blocker found

- [ ] Correct the Vercel primary-domain configuration. `https://venkoi.com` currently returns HTTP 308 to the equivalent `https://www.venkoi.com` URL; path and query are preserved, but this is the reverse of the required `www` → apex behavior. `www` serves HTTP 200 instead of redirecting to the apex.
- [ ] Recheck response-level alternate links after correcting the primary domain. HTML canonical/hreflang tags use the apex as required, but responses served from `www` currently include HTTP `Link` alternate headers on the `www` origin. This allows `www` to leak as an alternate identity even though the HTML and sitemap are apex-canonical.
- [ ] Repeat the apex, `www`, metadata-header, social-image, robots, and sitemap checks after the Vercel redirect is corrected. Do not add application middleware for this hosting-level redirect.

### Verified by repository/code

- [x] `.env.example`, `src/lib/site-config.ts`, and SEO regressions define the canonical contract as `SITE_URL=https://venkoi.com`, with the same safe apex fallback.
- [x] Vercel Analytics and Speed Insights components are mounted in the locale layout, so production instrumentation is capable of receiving traffic. Dashboard receipt is not established by source or page markup.
- [x] BotID client instrumentation protects `POST /api/leads`; the API calls `checkBotId()` before reading or validating the request body, blocks identified bots, and fails closed on verification errors in deployed environments.
- [x] Preview behavior remains covered by regression tests: `noindex`, `nofollow`, robots disallow `/`, and canonical/alternate/Open Graph URLs remain on `https://venkoi.com`.

### Owner-side verification still required

- [ ] In Vercel Domains, make `venkoi.com` the primary production domain and configure `www.venkoi.com` to redirect to it, then rerun the blocker checks above.
- [ ] Confirm the Vercel Production environment explicitly sets `SITE_URL=https://venkoi.com`. Live HTML is apex-canonical, but environment configuration itself was not accessible here.
- [ ] Inspect the Vercel Analytics dashboard for real production traffic.
- [ ] Inspect the Vercel Speed Insights dashboard for production observations.
- [ ] Inspect recent production logs for database, Resend, BotID, and unexpected runtime errors without exposing submitted personal information or secrets.
- [ ] Verify BotID operational status in Vercel without abusive or artificial submissions. The live site and repository establish instrumentation, not dashboard/runtime verification.
- [ ] Authenticate to the protected Vercel Preview deployment and verify its live page and `/robots.txt`. The latest recorded Preview redirected unauthenticated requests to Vercel login, so live preview metadata could not be inspected; code regressions passed this contract.
- [ ] Verify Spanish production email delivery when a genuine Spanish flow is available. English Contact and Demo persistence/email remain previously verified and were not repeated for this domain check.
- [ ] Verify the public legal routes after deployment, configure `privacy@venkoi.com`, and establish the manual retention review/deletion or anonymization process.
- [ ] Perform the final go/no-go review only after the reversed domain redirect and response-header leak are corrected and reverified.

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

These are external hosting actions. Items are checked only where live behavior or deployment records established completion:

1. [x] Attach `venkoi.com` to the Vercel Production project.
2. [ ] Configure the exact DNS records Vercel currently requests for this project and domain; do not rely on copied generic A/CNAME values.
3. [x] Wait for Vercel to verify the domain.
4. [x] Confirm TLS is active and the HTTPS certificate is valid.
5. [ ] Set or confirm Production `SITE_URL=https://venkoi.com`.
6. [x] Redeploy after the environment change if Vercel indicates that it is required.
7. [ ] Make `venkoi.com` the primary production domain.
8. [ ] If `www.venkoi.com` is attached, configure it to redirect to `venkoi.com`; keep the apex domain as the sole canonical origin.
9. [x] Confirm old `*.vercel.app` deployment URLs do not appear as canonical, alternate, sitemap, or social metadata URLs in the sampled production output.
10. [ ] Perform the controlled live SEO and platform verification below.

DNS and primary-domain redirects belong to Vercel/domain configuration, not application middleware.

## Live domain, SEO, and platform verification — after cutover

Domain and locales:

- [ ] `https://venkoi.com` loads successfully with a valid HTTPS certificate.
- [ ] Primary-domain behavior is correct, including the `www` → apex redirect if `www.venkoi.com` is attached.
- [x] `/en` and `/es` load successfully after the current reversed domain redirect.

SEO:

- [x] Production `/robots.txt` allows public crawling, disallows `/api/`, and advertises `https://venkoi.com/sitemap.xml`.
- [x] `/sitemap.xml` contains only intended canonical EN/ES public routes, locale alternates, and English `x-default`; Demo remains excluded.
- [x] Representative EN and ES HTML pages use `https://venkoi.com` canonical URLs.
- [x] Representative HTML pages expose correct `hreflang` values for `en` and `es`, with `x-default` pointing to English. Response `Link` headers remain blocked by the `www` issue recorded above.
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
