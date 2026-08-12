import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

const readme = read('README.md');
const launchPath = resolve(root, 'docs/LAUNCH.md');
assert.ok(existsSync(launchPath), 'docs/LAUNCH.md must exist');
const launch = read('docs/LAUNCH.md');
const dataHandlingPath = resolve(root, 'docs/DATA-HANDLING.md');
assert.ok(existsSync(dataHandlingPath), 'docs/DATA-HANDLING.md must exist');
const dataHandling = read('docs/DATA-HANDLING.md');

for (const term of ['Node.js 24', 'Next.js 16', 'React 19']) {
  assert.ok(readme.includes(term), `README must document ${term}`);
}
for (const stale of ['Node.js 20+', 'Next.js 15.5', 'React 18']) {
  assert.ok(!readme.includes(stale), `README must not document stale platform term ${stale}`);
}

assert.match(readme, /npm ci/, 'README clean setup must use npm ci');
assert.match(readme, /\.nvmrc/, 'README must document .nvmrc');
assert.match(readme, /\[launch runbook\]\(docs\/LAUNCH\.md\)/, 'README must link to launch runbook');
assert.match(readme, /npm run quality/, 'README must document npm run quality');
assert.match(readme, /npm run test:regression/, 'README must document npm run test:regression');
assert.match(readme, /Resend production transactional delivery is configured and manually verified/i, 'README must record production email verification');
assert.match(readme, /Spanish production delivery has not been manually verified/i, 'README must qualify Spanish production email verification');
assert.doesNotMatch(readme, /production forms are fully operational/i, 'README must not claim forms are fully operational');
assert.match(readme, /manually verified/i, 'README must record completed production persistence verification');
assert.match(readme, /stable product slug `zaiko`/i, 'README must document rename-safe Demo persistence');
assert.match(readme, /early_access_interest = false[\s\S]*Demo[\s\S]*true[\s\S]*Request Access/i, 'README must document shared Demo and Request Access storage');
assert.match(readme, /technical data-handling inventory/i, 'README must link to the technical data-handling inventory');

assert.match(dataHandling, /Internal technical\/data-governance document/i, 'DATA-HANDLING must be explicitly internal and technical');
assert.match(dataHandling, /not a Privacy Policy/i, 'DATA-HANDLING must not claim to be a legal policy');
assert.match(dataHandling, /Neon[\s\S]*persists?|insert persists/i, 'DATA-HANDLING must document Neon persistence facts');
assert.match(dataHandling, /Resend[\s\S]*internal notification[\s\S]*customer acknowledgement/i, 'DATA-HANDLING must document both Resend email paths');
assert.match(dataHandling, /Same-origin Venkoi referrers are discarded/i, 'DATA-HANDLING must preserve external-referrer semantics');
assert.match(dataHandling, /up to 24 months from the last meaningful interaction/i, 'DATA-HANDLING must document approved retention');
assert.match(dataHandling, /Operational and future product decisions still required/i, 'DATA-HANDLING must identify remaining operational and product work');
assert.match(dataHandling, /Spanish production email delivery[\s\S]*pending/i, 'DATA-HANDLING must preserve pending Spanish production email verification');
assert.match(dataHandling, /https:\/\/venkoi\.com` serves as the primary domain/i, 'DATA-HANDLING must record the verified apex production identity');
assert.doesNotMatch(dataHandling, /cutover correction remains pending|primary-domain redirect is still reversed/i, 'DATA-HANDLING must not preserve stale domain blockers');
assert.match(dataHandling, /Standard Demo[^\n]*early_access_interest = false/i, 'DATA-HANDLING must document Standard Demo storage');
assert.match(dataHandling, /Request Access[^\n]*early_access_interest = true/i, 'DATA-HANDLING must document Request Access storage');
assert.match(dataHandling, /\{product\} Access Request/i, 'DATA-HANDLING must document Access Request notification subjects');
assert.match(dataHandling, /Access request: Yes/i, 'DATA-HANDLING must document the human-readable access field');
assert.match(dataHandling, /does not guarantee acceptance or timing/i, 'DATA-HANDLING must preserve Access Request qualification');

const envLines = read('.env.example').split(/\r?\n/);
const env = new Map<string, string>();
for (const line of envLines) {
  const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
  if (match) env.set(match[1], match[2]);
}
for (const variable of [
  'DATABASE_URL',
  'RESEND_API_KEY',
  'RESEND_EMAIL_DOMAIN',
  'LEADS_NOTIFICATION_EMAIL',
  'SITE_URL'
]) {
  assert.ok(env.has(variable), `.env.example must include ${variable}`);
}
for (const secret of ['DATABASE_URL', 'RESEND_API_KEY', 'LEADS_NOTIFICATION_EMAIL']) {
  assert.equal(env.get(secret), '', `${secret} must not contain a committed credential or operational value`);
}
assert.equal(env.get('RESEND_EMAIL_DOMAIN'), 'send.venkoi.com', 'RESEND_EMAIL_DOMAIN must show domain-only format');
assert.ok(!env.has('RESEND_FROM_EMAIL'), '.env.example must not include the obsolete RESEND_FROM_EMAIL variable');
assert.equal(env.get('SITE_URL'), 'https://venkoi.com', 'SITE_URL must show the canonical public origin');

const migrations = [
  'db/migrations/001_create_leads.sql',
  'db/migrations/002_harden_leads.sql',
  'db/migrations/003_update_service_interests.sql'
];
for (const migration of migrations) assert.ok(existsSync(resolve(root, migration)), `${migration} must exist`);
const migrationPositions = migrations.map((migration) => {
  const segments = migration.split('/');
  return launch.indexOf(segments[segments.length - 1]);
});
assert.ok(migrationPositions.every((position) => position >= 0), 'Runbook must name all migrations');
assert.ok(migrationPositions[0] < migrationPositions[1] && migrationPositions[1] < migrationPositions[2], 'Runbook must present migrations in numeric order');

assert.match(launch, /Production email delivery — done/, 'Runbook must identify completed production email verification');
assert.match(launch, /Production lead persistence — done/, 'Runbook must distinguish completed Neon persistence');
assert.match(launch, /Current operational state/, 'Runbook must summarize the reconciled current state');
assert.match(launch, /Apex domain[^\n]*Production verified/i, 'Runbook must record apex production verification');
assert.match(launch, /Spanish-language production delivery has not been manually verified/i, 'Runbook must distinguish unverified Spanish production delivery');
assert.match(launch, /must not be interpreted as the previous SPA route/i, 'Runbook must document referrer semantics');
assert.match(launch, /product = zaiko/, 'Runbook must record stable product slug verification');
assert.match(launch, /Privacy is published at `\/en\/privacy`[\s\S]*Website Terms are published at `\/en\/terms`/i, 'Runbook must record public legal routes');
assert.match(launch, /privacy@venkoi\.com/, 'Runbook must record owner-side privacy mailbox action');
assert.match(launch, /Domain cutover — historical owner checklist/, 'Runbook must preserve the historical domain-cutover checklist');
assert.match(launch, /Exact record values[^\n]*Vercel's project-specific instructions/i, 'Runbook must defer exact DNS values to Vercel');
assert.match(launch, /Make `venkoi\.com` the primary production domain/, 'Runbook must identify the apex primary domain');
assert.match(launch, /`www\.venkoi\.com` is attached[\s\S]*redirect to `venkoi\.com`/, 'Runbook must document the optional www redirect');
assert.match(launch, /Live domain, SEO, and platform verification — recorded after cutover/, 'Runbook must preserve the dated post-cutover verification');
assert.match(launch, /Final owner go\/no-go/, 'Runbook must provide one authoritative remaining-action checklist');
assert.match(launch, /Confirm Vercel Analytics receives real production traffic/, 'Runbook must require live Analytics verification');
assert.match(launch, /Confirm Vercel Speed Insights receives production observations/, 'Runbook must require live Speed Insights verification');
assert.match(launch, /Confirm BotID is operational in Vercel Production/, 'Runbook must require live BotID verification');
assert.match(launch, /Confirm the Vercel Production environment explicitly sets `SITE_URL=https:\/\/venkoi\.com`/, 'Runbook must distinguish SITE_URL environment inspection from correct live output');
assert.match(launch, /Spanish production email delivery remains pending/, 'Runbook must preserve pending Spanish email status');
assert.match(launch, /During the 2026-08-11 production-domain verification, commit `838599c` was the verified deployment/i, 'Runbook must frame the verified SHA as dated history');
assert.doesNotMatch(launch, /Deploy the current `main` commit/i, 'Historical SHAs must not be described as current deployments');
assert.doesNotMatch(launch, /\b(?:76\.76\.21\.21|cname\.vercel-dns\.com)\b/i, 'Runbook must not hardcode generic DNS records');

const positioning = read('docs/POSITIONING.md');
assert.match(positioning, /product-first software company/i, 'POSITIONING must remain product-first');
assert.match(positioning, /Secondary business line[^\n]*Selected custom/i, 'POSITIONING must keep Services secondary');
assert.match(positioning, /Request a Demo[\s\S]*Request Access/i, 'POSITIONING must document both product conversions');
assert.match(positioning, /distinct intents/i, 'POSITIONING must distinguish Demo from Request Access');
assert.doesNotMatch(positioning, /Early Access offer/i, 'POSITIONING must not use legacy public program branding');

console.log('Documentation regression checks passed.');
