# Milestone 9 — Zaiko Product Story & Conversion Implementation Plan

This milestone enhances the Zaiko product page to better communicate its value proposition, problem space, and Early Access program.

## Proposed Changes

### Translations
#### [MODIFY] [en.json](file:///Users/hector/Projects/venkoi/src/i18n/messages/en.json)
#### [MODIFY] [es.json](file:///Users/hector/Projects/venkoi/src/i18n/messages/es.json)
- Add new `problem` section.
- Add `supporting` points to feature areas.
- Add `audience` section.
- Add `faq` section.
- Add `visuals` labels for conceptual UI.
- Enhance `earlyAccess` details.

---

### Components
#### [MODIFY] [ZaikoProductVisual.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoProductVisual.tsx)
- Update visual types to include conceptual labels (localized).
- Add directional relationships and timeline motifs where appropriate.

#### [MODIFY] [ZaikoFeatureSection.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoFeatureSection.tsx)
- Render the new `supporting` points as a concise list.

#### [NEW] [ZaikoProblemSection.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoProblemSection.tsx)
- A new section explaining the operating problem Zaiko solves.

#### [NEW] [ZaikoAudience.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoAudience.tsx)
- A new section explaining "Who Zaiko is for".

#### [NEW] [ZaikoFaq.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoFaq.tsx)
- A new section using semantic `details`/`summary` for FAQs.

#### [MODIFY] [ZaikoWorkflow.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoWorkflow.tsx)
- Strengthen the narrative of connected inventory parts.

#### [MODIFY] [ZaikoEarlyAccess.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoEarlyAccess.tsx)
- Add the new `details` points.

---

### Page & Logic
#### [MODIFY] [page.tsx](file:///Users/hector/Projects/venkoi/src/app/[locale]/products/zaiko/page.tsx)
- Integrate new sections in the correct order.
- Audit `SoftwareApplication` schema.

#### [MODIFY] [DemoRequestForm.tsx](file:///Users/hector/Projects/venkoi/src/components/forms/DemoRequestForm.tsx)
- Ensure analytics tracking for "early access interest".
- (Already supports preselection via `initialInterest`, but double-check logic).

#### [MODIFY] [ZaikoHero.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoHero.tsx)
#### [MODIFY] [ZaikoEarlyAccess.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoEarlyAccess.tsx)
#### [MODIFY] [ZaikoFinalCta.tsx](file:///Users/hector/Projects/venkoi/src/components/product/zaiko/ZaikoFinalCta.tsx)
- Add explicit event tracking to CTA buttons using `trackCustomEvent`.

## Verification Plan

### Automated Tests
- `npm run lint`
- `npm run typecheck`
- `npm run build`

### Manual Verification
- Verify EN/ES content parity.
- Test `?product=zaiko&interest=early-access` preselection on Demo page.
- Check responsive layout at various breakpoints.
- Accessibility audit of the new FAQ section (keyboard navigation).
- Verify CTA analytics triggers (simulated/code audit).
