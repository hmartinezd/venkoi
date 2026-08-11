import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

const client = read('src/server/db/client.ts');
const repository = read('src/server/leads/repository.ts');
const validation = read('src/server/leads/validation.ts');
const packageJson = read('package.json');
const workflow = read('.github/workflows/quality.yml');

assert.match(client, /process\.env\.DATABASE_URL/);
assert.doesNotMatch(client, /NEXT_PUBLIC_[A-Z_]*DATABASE|NEXT_PUBLIC_(?:NEON|DB)_URL/);

const publicDatabaseCredential = /NEXT_PUBLIC_[A-Z_]*(?:DATABASE|NEON|DB)[A-Z_]*/;
for (const path of ['src', '.env.example', 'package.json']) {
  const source = path === 'src'
    ? ['src/server/db/client.ts', 'src/server/leads/repository.ts', 'src/app/api/leads/route.ts']
        .map(read)
        .join('\n')
    : read(path);
  assert.doesNotMatch(source, publicDatabaseCredential, `${path} must not expose a public database credential`);
}

assert.match(repository, /product:\s*payload\.product \?\? null/);
assert.match(repository, /\$\{leadRecord\.product\}/);
assert.doesNotMatch(repository, /Product\.name|FEATURED_PRODUCT\.name/);

const migrations = [1, 2, 3].map((number) =>
  `db/migrations/00${number}_${['create_leads', 'harden_leads', 'update_service_interests'][number - 1]}.sql`
);
for (const migration of migrations) assert.ok(existsSync(resolve(root, migration)), `${migration} must exist`);

const migrationSql = migrations.map(read).join('\n');
const insertColumns = repository
  .match(/INSERT INTO leads \(([\s\S]*?)\) VALUES/)?.[1]
  .split(',')
  .map((column) => column.trim()) ?? [];
assert.ok(insertColumns.length > 0, 'Repository INSERT columns must be readable');
for (const column of insertColumns) {
  assert.match(migrationSql, new RegExp(`\\b${column}\\b`), `Migration schema must include ${column}`);
}

for (const interest of ['mobile', 'web', 'unsure']) {
  assert.match(validation, new RegExp(`['"]${interest}['"]`));
  assert.match(migrationSql, new RegExp(`['"]${interest}['"]`));
}

assert.doesNotMatch(packageJson, /migrat|db:verify/i, 'Build, start, and quality scripts must not mutate or require the database');
assert.doesNotMatch(workflow, /DATABASE_URL|NEXT_PUBLIC_(?:DATABASE|NEON|DB)_URL/);

console.log('Database contract regression checks passed.');
