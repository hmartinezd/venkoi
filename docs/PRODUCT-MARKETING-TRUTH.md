# Product marketing truth

This is the concise source of factual context for future website and product-marketing work. It is not final Brand Voice copy or a product engineering specification.

## Company truth

Venkoi is a product-first software company. Its own products define the company. Selected custom mobile, website, and web-application work remains a credible but secondary business line.

## Product truth

The featured product is restaurant inventory and food-cost software for independent restaurant owners, managers, receiving and inventory teams, and operators responsible for food cost—especially small operations moving beyond spreadsheets or disconnected systems.

Its initial platform is Android. It is local-first and focused on a single restaurant / single-location operating model. Internal identity remains `zaiko`; public display naming comes from `FEATURED_PRODUCT.name`.

## First-release scope

The typed source of truth is `src/lib/product-capabilities.ts`. It covers:

- setup and catalog import;
- invoice and purchase capture with reviewable extraction and explicit posting;
- inventory movement, waste, production, adjustments, and physical counts;
- activity as the traceability and trust layer;
- vendor price intelligence with package-aware comparability;
- preparation and menu costing with cost coverage;
- counts, reorder assistance, owner signals, supported CSV exports, and pilot data safety.

Newly modeled capabilities are conservatively marked `launch-release` until release acceptance establishes a stronger availability claim. First-release scope does not itself mean available today.

## Product trust principles

- Invoice detection may detect, extract, match, and suggest. A user reviews, corrects, and explicitly posts; detection never automatically posts a purchase.
- Inventory changes retain their source and remain traceable through activity history.
- Costing exposes full, partial, or uncosted coverage. Missing source costs are not replaced with fabricated precision.
- A physical-count value of zero is different from an uncounted item. Counts are reviewed before posting and create traceable adjustments.
- Reorder assistance can calculate needs, group by supplier, account for packages, and produce a shareable/CSV list. It does not place electronic supplier orders.
- Operational data should be recoverable. Automatic backup is not a current public claim without release acceptance.

## Explicit non-claims

Do not market these as first-release capabilities: POS integration, accounting integration, cloud sync, multi-location or enterprise-chain management, supplier electronic ordering, an iOS or Web application, an advanced AI copilot, autonomous purchasing, or automatic invoice posting.

OCR/document extraction does not justify generic “AI-powered” positioning. Describe the actual reviewable workflow. Do not imply unlike packages are comparable without required conversion data, broad export formats beyond supported CSV workflows, fake predictive analytics, or gross profit inclusive of labor and overhead.
