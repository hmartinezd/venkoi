# Venkoi

A Next.js marketing site and digital product platform for Venkoi prepared for production deployment.

## Stack

- Next.js 15.5 App Router
- TypeScript
- React 18
- Tailwind CSS 4
- next-intl (English & Spanish localization)
- Neon Serverless PostgreSQL
- Resend (Transactional emails)
- Vercel BotID (Bot protection)
- Vercel Web Analytics & Speed Insights

## Local Setup

1. Install Node.js 20+ and npm.
2. Run `npm install`.
3. Run `npm run dev`.

## Available Commands

- `npm run dev` - start local development server
- `npm run quality` - run full quality gate: lint, typecheck, regression tests, and production build
- `npm run test:regression` - run all local-safe regression scripts
- `npm run build` - run lint, typecheck, and Next.js production build
- `npm run lint` - run ESLint checks
- `npm run typecheck` - run TypeScript type checking

## Quality Gate & Regression Harness

The repository includes a technical quality gate that runs on every Pull Request and push to `main` via GitHub Actions.

### Regression Suite
- **Routing**: Validates localized path generation and route key detection.
- **Navigation Intent**: Ensures search parameter normalization for contact and demo intents.
- **Site Config**: Verifies environment-specific behavior (Production vs Preview vs Development).
- **Lead Flow**: Validates lead validation logic and ensures safe failure semantics when the database is unavailable.

Before merging to `main`, ensure `npm run quality` passes locally. This command performs a complete verification including the production build.

> **CI Status**: Once the Quality workflow has proven stable, the repository owner may optionally require its status check as a branch protection rule before merging.

## Lead Infrastructure & Database Migrations Setup

To enable lead persistence and email notifications:

### New Database Setup

If setting up a fresh Neon PostgreSQL instance:

1. Create a PostgreSQL database on [Neon](https://neon.tech).
2. Copy the serverless database connection URL (`postgresql://...`).
3. Configure `DATABASE_URL` in your environment variables.
4. Execute migration scripts in sequence using `psql` or the Neon SQL Console:
   ```bash
   psql "$DATABASE_URL" -f db/migrations/001_create_leads.sql
   psql "$DATABASE_URL" -f db/migrations/002_harden_leads.sql
   psql "$DATABASE_URL" -f db/migrations/003_update_service_interests.sql
   ```

### Existing Database Upgrade

If upgrading an existing database at migration 002, apply migration 003:
```bash
psql "$DATABASE_URL" -f db/migrations/003_update_service_interests.sql
```

> **Canonical Interest Values & Normalization**: The application emits canonical service interest values (`mobile`, `web`, `unsure`). Older incoming query or payload values (`website`, `web_application`) are automatically normalized to `web` at the server validation boundary before database persistence.

## Environment & SEO Indexing Architecture

- **Vercel Production** (`VERCEL_ENV=production`): Fully indexable (`Allow: /` in `robots.txt`, `index, follow` metadata).
- **Vercel Preview** (`VERCEL_ENV=preview`): Non-indexable (`Disallow: /` in `robots.txt`, `noindex, nofollow` metadata), even when running Next.js in production mode (`NODE_ENV=production`).
- **Canonical Origin**: `SITE_URL` (defaults to `https://venkoi.com`) remains the production canonical domain across all environments, ensuring preview deployments point canonical tags to the production domain without creating duplicate content issues on `*.vercel.app`.

## Production Launch Setup Checklist

Follow these step-by-step instructions when launching to production:

1. **Custom Domain**: Configure your production custom domain (`venkoi.com`) in Vercel Project Settings.
2. **Site Origin**: Configure `SITE_URL=https://venkoi.com` in Vercel Environment Variables.
3. **Database Connection**: Create a Neon PostgreSQL instance and retrieve the serverless connection string.
4. **Database URL**: Set `DATABASE_URL` in Vercel Environment Variables.
5. **Apply Migration 001**: Execute `db/migrations/001_create_leads.sql`.
6. **Apply Migration 002**: Execute `db/migrations/002_harden_leads.sql`.
7. **Apply Migration 003**: Execute `db/migrations/003_update_service_interests.sql`.
8. **Verify Schema**: Confirm tables and constraints (`chk_leads_lead_type`, `chk_leads_interest`, `chk_leads_locale`, etc.) exist in Neon.
9. **Resend Setup**: Create an account on [Resend](https://resend.com).
10. **Domain Verification**: Verify your sending domain (`venkoi.com`) in Resend DNS settings.
11. **Resend API Key**: Configure `RESEND_API_KEY` in Vercel Environment Variables.
12. **Sender Email**: Set `RESEND_FROM_EMAIL` (e.g. `Venkoi <notifications@venkoi.com>`).
13. **Notification Recipient**: Set `LEADS_NOTIFICATION_EMAIL` for internal team lead alerts.
14. **Vercel Analytics**: Enable Vercel Web Analytics in the Vercel Dashboard project settings.
15. **Speed Insights**: Enable Vercel Speed Insights in the Vercel Dashboard project settings.
16. **Bot Protection**: Verify BotID traffic and rules in Vercel Firewall.
17. **Redeploy**: Trigger a production deployment on Vercel.
18. **Form Testing**: Conduct end-to-end submissions on English (`/en/demo`, `/en/contact`) and Spanish (`/es/demo`, `/es/contacto`) forms.
19. **Verify Emails**: Confirm both internal alert emails and user acknowledgement emails arrive successfully.
20. **Verify Sitemap**: Check `https://venkoi.com/sitemap.xml` returns valid XML.
21. **Verify Robots**: Check `https://venkoi.com/robots.txt` specifies production indexing rules (`Allow: /` in Production, `Disallow: /` in Preview).
22. **Verify Canonical Tags**: Inspect `<link rel="canonical">` and `hreflang` metadata on live HTML pages.
23. **Verify Social Assets**: Test social card sharing previews (OpenGraph & Twitter images) on social platforms or debuggers.
