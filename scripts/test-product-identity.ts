import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

const output = execFileSync('rg', ['-l', '-i', '-w', retiredIdentity, '--glob', '!node_modules/**', '--glob', '!.next/**', '--glob', '!.git/**', '--glob', '!package-lock.json', '.'], { encoding: 'utf8' });

const occurrences = output.trim() ? output.trim().split('\n').map((file) => file.replace(/^\.\//, '')) : [];
assert.deepEqual(occurrences.filter((file) => !allowedLegacyFiles.has(file)), [], 'Retired product identity must be limited to migration/redirect compatibility files');

console.log('Product identity migration regression checks passed.');
