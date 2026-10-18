import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

function read(file: string): string {
  return readFileSync(resolve(process.cwd(), file), 'utf8');
}

const retiredIdentity = ['za', 'iko'].join('');
const allowedLegacyFiles = new Set([
  'next.config.mjs',
  'db/migrations/004_migrate_legacy_product_slug.sql'
]);

const result = read('next.config.mjs');
assert.match(result, new RegExp(`source: '/en/products/${retiredIdentity}'[\\s\\S]*destination: '/en/products/serve'[\\s\\S]*permanent: true`));
assert.match(result, new RegExp(`source: '/es/productos/${retiredIdentity}'[\\s\\S]*destination: '/es/productos/serve'[\\s\\S]*permanent: true`));

const migration = read('db/migrations/004_migrate_legacy_product_slug.sql');
assert.match(migration, /UPDATE leads/);
assert.match(migration, /SET product = 'serve'/);
assert.match(migration, new RegExp(`WHERE product = '${retiredIdentity}'`));

const ignoredDirectories = new Set(['.git', '.next', 'node_modules']);
const ignoredFiles = new Set(['package-lock.json']);
const retiredIdentityPattern = new RegExp(`\\b${retiredIdentity}\\b`, 'i');

function scanRepository(root: string): string[] {
  const occurrences: string[] = [];

  function visit(directory: string): void {
    const entries = readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      // Match the previous ripgrep invocation, which did not search hidden workspace files.
      if (entry.name.startsWith('.')) continue;
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
      if (!entry.isDirectory() && ignoredFiles.has(entry.name)) continue;

      const absolutePath = join(directory, entry.name);
      const relativePath = relative(root, absolutePath).split(sep).join('/');
      const pathMatches = retiredIdentityPattern.test(relativePath);
      const contentMatches = entry.isFile() && retiredIdentityPattern.test(readFileSync(absolutePath, 'utf8'));

      if (pathMatches || contentMatches) {
        occurrences.push(relativePath);
      }

      if (entry.isDirectory()) visit(absolutePath);
    }
  }

  visit(root);
  return occurrences;
}

const occurrences = scanRepository(resolve(process.cwd()));
assert.deepEqual(occurrences.filter((file) => !allowedLegacyFiles.has(file)), [], 'Retired product identity must be limited to migration/redirect compatibility files');

console.log('Product identity migration regression checks passed.');
