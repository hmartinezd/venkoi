# Venkoi

A production-ready Next.js foundation for the VENKOI website.

## Purpose

This milestone creates the architecture, internationalization system, responsive shell, and design system foundation for the Venkoi marketing site.

## Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- next-intl
- ESLint

## Local Setup

1. Install Node.js 20+ and npm.
2. Run `npm install`.
3. Run `npm run dev`.

## Available Commands

- `npm run dev` - start local development server
- `npm run build` - build production app
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript checks

## Directory Structure

- `src/app` - app router pages and localized routes
- `src/components` - reusable UI and layout components
- `src/i18n` - locale configuration, route mapping, and navigation structure
- `src/lib` - application utilities, SEO helpers, and product registry
- `src/app/[locale]/page.tsx` - localized homepage entry
- `src/app/[locale]/products/zaiko/page.tsx` - Zaiko placeholder route

## Internationalization

This project uses `next-intl` with locale-prefixed routes under `src/app/[locale]`.

- English: `/en/*`
- Spanish: `/es/*`

Messages are stored in `src/i18n/messages/en.json` and `src/i18n/messages/es.json` and are loaded at the locale layout level.

### Localized Routes

Public paths are mapped in `src/i18n/routing.ts`.
Language switching preserves the equivalent page path whenever possible.

## Product Registry

Product definitions are centralized in `src/lib/products.ts`.
Zaiko is registered as the first product with `pricingEnabled: false`.

## Logo Asset Replacement

The temporary brand wordmark is implemented in `src/components/brand/BrandLogo.tsx`.

To replace it later:

- drop `venkoi-logo-dark.svg`, `venkoi-logo-light.svg`, and `venkoi-mark.svg` into `public/brand/`
- update `BrandLogo` to render the final SVG asset instead of text

## What is intentionally NOT implemented yet

- Full homepage marketing content
- Zaiko pricing, checkout, or subscription flows
- Customer login or authentication
- Contact/demo backend forms
- Fake testimonials, metrics, or customer logos

## Future Milestones

- Milestone 2: Marketing Pages
- Milestone 3: Zaiko Product Experience
- Milestone 4: Lead Infrastructure
- Milestone 5: Production Hardening
