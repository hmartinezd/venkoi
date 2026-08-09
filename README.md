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
- `npm run build` - run lint, typecheck, and Next.js production build
- `npm run lint` - run ESLint checks
- `npm run typecheck` - run TypeScript type checking

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
8. **Resend Setup**: Create an account on [Resend](https://resend.com).
9. **Domain Verification**: Verify your sending domain (`venkoi.com`) in Resend DNS settings.
10. **Resend API Key**: Configure `RESEND_API_KEY` in Vercel Environment Variables.
11. **Sender Email**: Set `RESEND_FROM_EMAIL` (e.g. `Venkoi <notifications@venkoi.com>`).
12. **Notification Recipient**: Set `LEADS_NOTIFICATION_EMAIL` for internal team lead alerts.
13. **Vercel Analytics**: Enable Vercel Web Analytics in the Vercel Dashboard project settings.
14. **Speed Insights**: Enable Vercel Speed Insights in the Vercel Dashboard project settings.
15. **Bot Protection**: Verify BotID traffic and rules in Vercel Firewall.
16. **Redeploy**: Trigger a production deployment on Vercel.
17. **Form Testing**: Conduct end-to-end submissions on English (`/en/demo`, `/en/contact`) and Spanish (`/es/demo`, `/es/contacto`) forms.
18. **Verify Emails**: Confirm both internal alert emails and user acknowledgement emails arrive successfully.
19. **Verify Sitemap**: Check `https://venkoi.com/sitemap.xml` returns valid XML.
20. **Verify Robots**: Check `https://venkoi.com/robots.txt` specifies production indexing rules (`Allow: /` in Production, `Disallow: /` in Preview).
21. **Verify Canonical Tags**: Inspect `<link rel="canonical">` and `hreflang` metadata on live HTML pages.
22. **Verify Social Assets**: Test social card sharing previews (OpenGraph & Twitter images) on social platforms or debuggers.
