# Venkoi

A production-ready Next.js marketing site and digital product platform for Venkoi.

## Stack

- Next.js 15.5 App Router
- TypeScript
- React 18
- Tailwind CSS 4
- next-intl (English & Spanish localization)
- Neon Serverless PostgreSQL
- Resend (Transactional emails)
- Vercel BotID (Bot protection)

## Local Setup

1. Install Node.js 20+ and npm.
2. Run `npm install`.
3. Run `npm run dev`.

## Available Commands

- `npm run dev` - start local development server
- `npm run build` - run lint, typecheck, and Next.js build
- `npm run lint` - run ESLint checks
- `npm run typecheck` - run TypeScript type checking

## Lead Infrastructure Setup

To enable production lead persistence and email notifications:

1. **Neon PostgreSQL Database Setup**:
   - Create a PostgreSQL database on [Neon](https://neon.tech).
   - Copy the serverless database connection URL (`postgresql://...`).
   - Configure `DATABASE_URL` in your Vercel Environment Variables (and `.env.local` for local development).

2. **Database Migration**:
   - Apply the SQL migration in `db/migrations/001_create_leads.sql` to your Neon database via the Neon SQL Console or psql:
     ```bash
     psql "$DATABASE_URL" -f db/migrations/001_create_leads.sql
     ```

3. **Resend Email Service Setup**:
   - Create an account on [Resend](https://resend.com).
   - Verify your Venkoi sending domain (e.g. `venkoi.com`).
   - Create an API key in Resend.
   - Configure `RESEND_API_KEY` in Vercel Environment Variables.
   - Configure `RESEND_FROM_EMAIL` (e.g., `Venkoi <notifications@venkoi.com>`).
   - Configure `LEADS_NOTIFICATION_EMAIL` (the recipient team address for internal lead alerts).

4. **Deployment & Verification**:
   - Redeploy the application on Vercel.
   - Test both English (`/en/demo`, `/en/contact`) and Spanish (`/es/demo`, `/es/contacto`) form submissions.
