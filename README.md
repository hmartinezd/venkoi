# Venkoi

The Venkoi marketing and product website. Production Contact and Demo persistence is backed by Neon PostgreSQL; transactional email delivery remains a separate operational step.

## Stack

- Node.js 24 (see `.nvmrc`)
- Next.js 16 App Router, with Server Components by default
- React 19 and TypeScript 5
- Tailwind CSS 4
- next-intl 4 for English and Spanish localization through `src/proxy.ts`
- Zod 4 and ESLint 10
- Neon Serverless PostgreSQL and Resend for the lead pipeline
- Vercel deployment, BotID, Analytics, and Speed Insights

## Local setup

The marketing site renders locally without production lead-service secrets.

1. Use Node.js 24; `.nvmrc` is the preferred local runtime indicator.
2. Install the committed dependency graph with `npm ci`.
3. Only when testing local lead infrastructure, copy `.env.example` to `.env.local` and supply appropriate local/test configuration.
4. Run `npm run dev`.

## Lead infrastructure status

Production Contact and Demo persistence is operationally configured and manually verified: Vercel Production receives the server-only `DATABASE_URL` through the Neon integration, migrations `001` → `002` → `003` are applied, and controlled production submissions produced the expected Neon rows. Demo persistence stores the stable product slug `zaiko`, independently of its registry-driven public display name.

**Deferred Production Infrastructure:** Resend production email delivery is not active yet. Missing or failed email delivery remains secondary to successful persistence and does not discard an already stored lead.

Database persistence is required for a successful submission. A database failure produces `SUBMISSION_ERROR`. If persistence succeeds but email delivery is unavailable or fails, the submission remains successful because the lead has already been stored; the email issue is logged.

See the [launch runbook](docs/LAUNCH.md) for the environment contract, migration sequence, service configuration, and manual production verification.

## Important commands

- `npm run dev` — start the local development server
- `npm run lint` — run ESLint, including deprecated API detection
- `npm run typecheck` — run TypeScript checking
- `npm run test:regression` — run the combined regression suite
- `npm run quality` — run lint, typecheck, the regression suite, and a Next production build
- `npm run build:next` — run the Next.js production build

`package.json` is the source of truth for focused test commands.

## Quality architecture

The regression suite covers these stable areas without duplicating every individual script here:

- Routing & Navigation
- Product Configuration
- Lead & Contact Flow
- SEO & Accessibility
- Rendering Boundaries
- Page Structure
- Platform Modernization
- Insights & Content Consistency, including English/Spanish parity

The GitHub Actions `Quality` workflow runs `npm ci` and `npm run quality` with Node.js 24 on pushes to `main` and pull requests targeting `main`. Run `npm run quality` locally before merging.
