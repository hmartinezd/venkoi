import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const collectFiles = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const absolute = resolve(directory, entry.name);
  return entry.isDirectory() ? collectFiles(absolute) : [absolute];
});

const sourceFiles = collectFiles(resolve(root, 'src')).filter((path) => /\.(?:ts|tsx)$/.test(path));
const source = sourceFiles.map((path) => readFileSync(path, 'utf8')).join('\n');
assert.doesNotMatch(source, /NEXT_PUBLIC_(?:DATABASE_URL|RESEND_API_KEY|LEADS_NOTIFICATION_EMAIL)/, 'server-only lead credentials must not use NEXT_PUBLIC_*');

const acquisitionSources = [
  'src/lib/lead-acquisition.ts',
  'src/components/forms/ContactProjectForm.tsx',
  'src/components/forms/DemoRequestForm.tsx'
].map(read).join('\n');
assert.doesNotMatch(acquisitionSources, /localStorage|sessionStorage|document\.cookie|\bcookies\s*\(|indexedDB/i, 'lead acquisition must not persist attribution in browser storage');

const analytics = read('src/lib/analytics.ts');
for (const pii of ['name', 'first_name', 'last_name', 'email', 'phone', 'company', 'message']) {
  assert.doesNotMatch(analytics, new RegExp(`^\\s*${pii}\\??:`, 'm'), `analytics property type must not allow ${pii}`);
}
assert.match(analytics, /const safeProps/, 'analytics wrapper must rebuild an allowlisted property object');

const leadRuntime = [
  'src/app/api/leads/route.ts',
  'src/server/db/client.ts',
  'src/server/leads/repository.ts',
  'src/server/leads/service.ts',
  'src/server/email/lead-emails.tsx'
].map(read).join('\n');
assert.doesNotMatch(leadRuntime, /console\.(?:log|warn|error)\([^\n]*(?:rawPayload|payload|bodyText|leadRecord)/, 'lead runtime must not intentionally dump submitted payloads');
assert.doesNotMatch(read('src/server/db/client.ts'), /console\.error\([^\n]*,\s*(?:error|err)\s*\)/, 'database initialization must not print a raw error that could contain credentials');

for (const route of ['privacy', 'terms']) {
  const routeDirectories = collectFiles(resolve(root, 'src/app')).filter((path) => relative(resolve(root, 'src/app'), path).split('/').includes(route));
  assert.equal(routeDirectories.length, 0, `${route} route must not be created before approved content`);
}
const footer = read('src/components/layout/Footer.tsx');
assert.doesNotMatch(footer, /href=[^\n]*(?:privacy|terms)/i, 'footer legal labels must not link to nonexistent routes');

const dataHandlingPath = resolve(root, 'docs/DATA-HANDLING.md');
assert.ok(existsSync(dataHandlingPath) && statSync(dataHandlingPath).isFile(), 'technical data-handling document must exist');
const dataHandling = read('docs/DATA-HANDLING.md');
assert.match(dataHandling, /Internal technical\/data-governance document/i, 'data-handling document must identify its internal technical purpose');
assert.match(dataHandling, /not a Privacy Policy/i, 'data-handling document must not present itself as a legal policy');
assert.match(dataHandling, /Retention period is an unresolved operational\/legal decision/i, 'retention must remain explicitly unresolved');
assert.doesNotMatch(dataHandling, /\b(?:30|60|90|180|365) days?\b|\b(?:1|2|3|5|7) years?\b/i, 'data-handling document must not invent a retention duration');

console.log('Data-governance regression checks passed.');
