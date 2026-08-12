# Venkoi Launch Runbook

This runbook is the operational source of truth for Venkoi's external production services. It records completed production lead-persistence work separately from remaining operational work.

## Current operational state

| Area | Status | Evidence / remaining action |
| --- | --- | --- |
| Apex domain, `www` redirect, TLS/HSTS | **Production verified** | The 2026-08-11 record below verifies `https://venkoi.com` as the primary identity and a single-hop `www` → apex redirect. |
| Canonical, hreflang, Open Graph, robots, sitemap | **Production verified** | The same production record verifies apex-only output on representative EN/ES routes. |
| Neon persistence | **Production verified** | Controlled English Contact and product submissions persisted expected rows. |
| Resend English delivery | **Production verified** | Internal notifications and customer acknowledgements were received for English Contact and product submissions. |
| Demo / Request Access behavior and email templates | **Repository verified** | Tests cover both intents in English and Spanish. Live Spanish delivery remains an owner check. |
| Analytics instrumentation | **Repository verified** | `<Analytics />` is mounted; dashboard receipt requires owner/platform verification. |
| Speed Insights instrumentation | **Repository verified** | `<SpeedInsights />` is mounted; dashboard observations require owner/platform verification. |
| BotID lead protection | **Repository verified** | The API checks BotID and fails closed on deployed verification errors; live Vercel operation requires owner/platform verification. |
| `privacy@venkoi.com` | **Owner/platform verification required** | Public address is established; mailbox or forwarding delivery is not repository-verifiable. |
| 24-month retention baseline | **Recorded operational decision** | The owner-operated review/deletion or anonymization process remains to be established. |
| Authenticated/paid product legal framework | **Deferred** | Required before authenticated or paid product functionality, not for this marketing-site release. |
| Real Product Media & Functional Proof | **Deferred** | No approved real product screenshots are available; representative visuals remain in place. |

Passing repository checks does not complete owner/platform items. The authoritative remaining action list is in **Final owner go/no-go** below.

## Production lead persistence — done

The Neon production database is configured with Neon Auth off. Migrations `001` → `002` → `003` were applied manually in the Neon SQL Editor. Vercel Production receives `DATABASE_URL` through the Neon integration, and a new production deployment was created after configuration.

Production persistence has been manually verified end to end:

- Contact: `GENERAL_CONTACT`, `product = NULL`, `status = NEW`, `locale = en`, `source_path = /en/contact`.
- Request Access: `DEMO`, `product = zaiko`, `early_access_interest = true`, `status = NEW`, `locale = en`, `source_path = /en/demo`.

The Demo row intentionally stores the stable product slug `zaiko`, not the registry-driven public display name. Do not require local `DATABASE_URL` or repeat these production submissions merely to re-prove this completed verification.

## Production email delivery — done

Resend's sending domain and required Vercel variables are configured. Live English Contact and Request Access submissions confirmed both internal notifications and customer acknowledgements in production. Automated tests cover Standard Demo and Request Access in English and Spanish, but Spanish-language production delivery has not been manually verified.

Contact and Demo UI and validation can work without production services. Validation alone is not lead success: `POST /api/leads` must persist the validated lead to PostgreSQL. A missing, invalid, or unavailable database returns `SUBMISSION_ERROR`. After persistence, unavailable or failed email delivery is logged but the submission remains successful because the lead is safely stored.

The endpoint uses Vercel BotID before processing a request. In environments considered deployed by the code (Vercel preview or production, and non-Vercel `NODE_ENV=production`), a BotID verification error fails closed with `SUBMISSION_ERROR`; an identified bot receives `BOT_BLOCKED`. In local development, a BotID verification error is logged as a warning and processing continues. Verify actual production behavior rather than inferring it from source.

No external error-monitoring or alerting service is present in this repository. Adding one is an optional future operational enhancement; current behavior uses application logs.

## Product configuration

`src/lib/products.ts` is the source of truth. Its stable technical identifiers include `zaiko`, and its `earlyAccess` configuration controls whether the public Request Access option and configured benefit are available. The public display name and free-month duration are registry-driven; re-check the registry rather than treating this summary as a constant. Product identity is not an environment variable.

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
| Vercel Production | `index`, `follow`; robots allow public pages and disallow `/api/` | `https://venkoi.com` | Configured and manually verified through Neon | Configured; Contact and Request Access internal/customer delivery verified in English | Deployed behavior; continue operational monitoring |

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

The code treats missing or invalid email configuration as a logged skip after persistence. Individual send failures are logged and do not roll back the lead. Live English Contact and Request Access submissions have verified both delivery paths; Spanish production delivery remains unverified.

## Lead attribution semantics

`source_path` is the form submission route without a query string. `referrer` is the normalized external HTTP(S) document referrer when available, with query and fragment removed. Same-origin Venkoi referrers are intentionally discarded and must not be interpreted as the previous SPA route. Internal customer-journey tracking is not implemented in V1.

## Established production services

Neon persistence, the Resend sending domain, English transactional delivery, localized legal routes, and the apex-domain SEO identity have recorded production verification. Privacy is published at `/en/privacy` and `/es/privacidad`; Website Terms are published at `/en/terms` and `/es/terminos`. The approved V1 retention baseline is up to 24 months from the last meaningful interaction for unconverted leads, followed by deletion or anonymization unless a documented exception applies. Enforcement is owner-operated and is not automated.

Before authenticated or paid Zaiko functionality launches, perform a separate product legal review covering Product Terms, subscriptions/payments, accounts and customer data, product privacy and retention/deletion, DPAs where appropriate, and product security/legal requirements.

## Production-domain verification — 2026-08-11

During the 2026-08-11 production-domain verification, commit `838599c` was the verified deployment and matched `origin/main`. Verification used safe HTTPS `GET`/`HEAD` requests; no production lead was submitted. This is a dated audit record, not a claim that the SHA is the currently deployed version.

### Verified live

- [x] TLS validation succeeds for both `venkoi.com` and `www.venkoi.com`. Both present valid Let's Encrypt certificates and HTTPS responses include HSTS.
- [x] `/en` and `/es` render successfully with HTTP 200 responses after the current domain redirect.
- [x] `/robots.txt` allows `/`, disallows `/api/`, and advertises `https://venkoi.com/sitemap.xml`.
- [x] `/sitemap.xml` contains 22 intended EN/ES canonical entries, including correct EN, ES, and English `x-default` alternates. Demo is excluded, while the intended public Contact routes remain included. No `www.venkoi.com` or `*.vercel.app` URL appears in its XML.
- [x] Representative EN/ES home, Zaiko, Services, Insights, and insight-article HTML uses `https://venkoi.com` for canonical URLs, EN/ES alternates, English `x-default`, and Open Graph URLs. Pages with generated Open Graph/Twitter images use `https://venkoi.com` image URLs, and sampled image endpoints return HTTP 200 PNG responses.
- [x] Representative production pages emit `index, follow` robots metadata.

### Domain and legal follow-up verification — 2026-08-11

- [x] `https://venkoi.com` serves directly on the apex. The root performs only the expected locale redirect to `/en`; it does not redirect to `www`.
- [x] `https://www.venkoi.com` performs one HTTP 308 redirect to the equivalent apex URL. A sampled Spanish legal path and query string were preserved exactly, and following the redirect completed with HTTP 200 without a loop.
- [x] TLS verification succeeded for apex and `www`, and both responses retained HSTS.
- [x] Representative EN/ES response `Link` headers use only `https://venkoi.com` for EN, ES, and `x-default` alternates. The former `www` alternate-identity leak is resolved.
- [x] Representative HTML canonical, EN/ES alternate, English `x-default`, and Open Graph URLs use the apex. Sampled Open Graph and Twitter image endpoints use the apex and returned HTTP 200 PNG responses. No sampled canonical/alternate output contained `www.venkoi.com` or a `vercel.app` hostname.
- [x] `/en/privacy`, `/es/privacidad`, `/en/terms`, and `/es/terminos` returned HTTP 200 with the expected localized policy, titles, metadata, footer legal links, and `privacy@venkoi.com` contact. Rendered markup includes responsive viewport and breakpoint styles. No placeholder LinkedIn or Instagram link was present. Interactive viewport and language-switch clicks were not exercised because browser control was unavailable; localized destination routes and alternates were verified live.
- [x] The production sitemap contains 26 intended localized URLs, including all four legal URLs with their alternates. Demo remains excluded, and no `www` or `vercel.app` hostname appears.

No application redirect middleware or production code change was needed. The redirect remains correctly owned by Vercel.

### Verified by repository/code

- [x] `.env.example`, `src/lib/site-config.ts`, and SEO regressions define the canonical contract as `SITE_URL=https://venkoi.com`, with the same safe apex fallback.
- [x] Vercel Analytics and Speed Insights components are mounted in the locale layout, so production instrumentation is capable of receiving traffic. Dashboard receipt is not established by source or page markup.
- [x] BotID client instrumentation protects `POST /api/leads`; the API calls `checkBotId()` before reading or validating the request body, blocks identified bots, and fails closed on verification errors in deployed environments.
- [x] Preview behavior remains covered by regression tests: `noindex`, `nofollow`, robots disallow `/`, and canonical/alternate/Open Graph URLs remain on `https://venkoi.com`.

### Limits of that verification event

The audit could not inspect Vercel environment settings or dashboards, protected Preview output, production logs, BotID runtime health, Spanish mailbox delivery, the privacy mailbox, or retention operations. Those are not inferred from correct markup or repository code. Their current actions appear only in **Final owner go/no-go**.

## Manual lead verification matrix

The EN Contact and EN Demo persistence and email paths described above are already verified and do not need to be repeated. Use this matrix for future locale/interest coverage. Database rows and UI success are persistence checks; internal notification and user acknowledgement are separate email checks.

| Flow | Route / intent | Additional check |
| --- | --- | --- |
| EN Demo | `/en/demo?product=zaiko` | Zaiko demo submission |
| ES Demo | `/es/demo?product=zaiko` | Spanish acknowledgement |
| EN Contact | `/en/contact` | Test `mobile`, `web`, and `unsure` service interests |
| ES Contact | `/es/contacto` | Test `mobile`, `web`, and `unsure` service interests |
| Request Access | `?product=zaiko&interest=early-access` on each localized Demo route | Request Access intent persists through the technical `early_access_interest` flag while the registry setting remains enabled |

Use a non-production environment for controlled failure-path testing. Confirm database failure yields submission failure, and email failure after persistence still yields submission success. Do not intentionally break production services.

## Domain cutover — historical owner checklist

These are external hosting actions. Items are checked only where live behavior or deployment records established completion:

1. [x] Attach `venkoi.com` to the Vercel Production project.
2. [x] DNS produced the verified apex and `www` behavior. Exact record values were not copied into this repository and should continue to follow Vercel's project-specific instructions.
3. [x] Wait for Vercel to verify the domain.
4. [x] Confirm TLS is active and the HTTPS certificate is valid.
5. [ ] Set or confirm Production `SITE_URL=https://venkoi.com`.
6. [x] Redeploy after the environment change if Vercel indicates that it is required.
7. [x] Make `venkoi.com` the primary production domain, as established by direct apex responses and canonical output.
8. [x] If `www.venkoi.com` is attached, configure it to redirect to `venkoi.com`; live verification establishes the single-hop path/query-preserving redirect.
9. [x] Confirm old `*.vercel.app` deployment URLs do not appear as canonical, alternate, sitemap, or social metadata URLs in the sampled production output.
10. [x] Perform the controlled live domain, legal-route, sitemap, and SEO identity verification below. Dashboard-only platform checks remain pending.

DNS and primary-domain redirects belong to Vercel/domain configuration, not application middleware.

## Live domain, SEO, and platform verification — recorded after cutover

Domain and locales:

- [x] `https://venkoi.com` loads successfully with a valid HTTPS certificate.
- [x] Primary-domain behavior is correct, including the `www` → apex redirect with path/query preservation.
- [x] `/en` and `/es` load successfully directly on the apex origin.

SEO:

- [x] Production `/robots.txt` allows public crawling, disallows `/api/`, and advertises `https://venkoi.com/sitemap.xml`.
- [x] `/sitemap.xml` contains only intended canonical EN/ES public routes, locale alternates, and English `x-default`; Demo remains excluded.
- [x] Representative EN and ES HTML pages use `https://venkoi.com` canonical URLs.
- [x] Representative HTML pages expose correct `hreflang` values for `en` and `es`, with `x-default` pointing to English. Response `Link` headers now use only the apex origin.
- [x] Representative Open Graph URLs and sampled social image URLs resolve through the canonical production origin.

Preview safety was repository-verified, but the protected live Preview could not be inspected without authentication. Platform dashboards and runtime logs were also outside the verification environment. See **Final owner go/no-go** for the current actions.

The completed English Contact and Demo persistence/email checks do not need to be repeated solely for domain cutover. Repeat them only if the cutover creates a concrete lead-flow concern. Spanish production email delivery remains pending.

## Code-verifiable prerequisites

Before launch, run the locked install and quality gate on Node.js 24:

```bash
npm ci
npm run quality
```

This verifies lint (including deprecated API detection), type checking, routing/navigation, product configuration, lead/contact behavior, SEO/accessibility, rendering boundaries, page structures, platform modernization, content consistency, and the Next.js production build. Passing code checks does not complete any unchecked external launch item.

## Final owner go/no-go

Before declaring the marketing/product website operationally closed:

- [ ] Confirm the Vercel Production environment explicitly sets `SITE_URL=https://venkoi.com`; correct live canonical output does not prove the variable itself is configured.
- [ ] Confirm Vercel Analytics receives real production traffic.
- [ ] Confirm Vercel Speed Insights receives production observations.
- [ ] Review recent production logs for database, Resend, BotID, and unexpected runtime errors without exposing personal information or secrets.
- [ ] Confirm BotID is operational in Vercel Production without abusive or artificial submissions.
- [ ] Authenticate to a representative protected Vercel Preview and confirm `noindex`, `nofollow`, crawl-blocking robots output, and apex canonical/alternate/Open Graph metadata.
- [ ] Verify transactional delivery through a genuine Spanish Demo or Request Access flow; deterministic EN/ES tests and live English delivery do not establish this.
- [ ] Configure and verify mailbox or forwarding delivery for `privacy@venkoi.com`.
- [ ] Record and begin the owner-operated review/deletion or anonymization procedure for leads eligible under the 24-month rule.
- [ ] Complete and record the final owner go/no-go decision.
