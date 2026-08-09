# Milestone 9.1 Implementation Plan — Zaiko Stabilization & Cleanup

This plan addresses localization inconsistencies, missing CTA analytics, and repository hygiene for the Zaiko product page.

## User Review Required

> [!IMPORTANT]
> The sticky product navigation will now receive its labels from the server component (page) instead of determining them internally. This maintains the Server Component architecture while ensuring consistent localization.

## Proposed Changes

### Localization & i18n

#### [MODIFY] [en.json](file:///Users/hector/Projects/venkoi/src/i18n/messages/en.json) & [es.json](file:///Users/hector/Projects/venkoi/src/i18n/messages/es.json)
- Add `zaikoPage.nav.earlyAccess` key to both files.

#### [MODIFY] [ZaikoProductNav.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoProductNav.tsx)
- Add `earlyAccessLabel` prop.
- Remove hardcoded locale conditional for "Early Access".
- Use `TrackedButton` for the "Request a Demo" CTA.

#### [MODIFY] [ZaikoHero.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoHero.tsx)
- Add `labels` prop for `ZaikoProductVisual`.
- Use `TrackedButton` for primary (Demo) and secondary (Early Access) CTAs.

#### [MODIFY] [ZaikoFeatureSection.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoFeatureSection.tsx)
- Add `labels` prop to receive visual labels and pass them to `ZaikoProductVisual`.

#### [MODIFY] [ZaikoEarlyAccess.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoEarlyAccess.tsx)
- Use `TrackedButton` for both CTAs with appropriate `source` and `earlyAccess` properties.

#### [MODIFY] [ZaikoFinalCta.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoFinalCta.tsx)
- Use `TrackedButton` for both CTAs.

#### [MODIFY] [page.tsx](file:///Users/hector/Projects/venkoi/src/app/[locale]/products/zaiko/page.tsx)
- Fetch `earlyAccessLabel` from `tNav`.
- Pass `visualLabels` to `ZaikoHero` and all `ZaikoFeatureSection` instances.
- Pass `earlyAccessLabel` to `ZaikoProductNav`.

---

### Repository Cleanup

#### [MODIFY] [.gitignore](file:///Users/hector/Projects/venkoi/.gitignore)
- Add `.artifacts/` to the ignore list.

#### [DELETE] AI Artifacts
- Remove files under `.artifacts/0e48af28-382a-449e-af00-1a2473a00d48/`.

---

### Analytics Events Summary

| Location | Event | Source | earlyAccess |
| :--- | :--- | :--- | :--- |
| Hero | `zaiko_demo_cta` | `zaiko_hero` | - |
| Hero | `zaiko_early_access_cta` | `zaiko_hero` | `true` |
| Product Nav | `zaiko_demo_cta` | `zaiko_product_nav` | - |
| Early Access | `zaiko_demo_cta` | `zaiko_early_access` | - |
| Early Access | `zaiko_early_access_cta` | `zaiko_early_access` | `true` |
| Final CTA | `zaiko_demo_cta` | `zaiko_final_cta` | - |
| Final CTA | `zaiko_early_access_cta` | `zaiko_final_cta` | `true` |

## Verification Plan

### Automated Tests
- `npm run lint`
- `npm run typecheck`
- `npm run build`

### Manual Verification
- Check `/en/products/zaiko` and `/es/productos/zaiko`.
- Verify visual labels (Inventory, Purchases, etc.) are localized in all sections.
- Verify "Early Access" link in sub-nav is localized.
- Inspect button clicks (conceptually) to ensure `TrackedButton` is used with correct props.
- Verify `.artifacts/` is ignored by Git.
