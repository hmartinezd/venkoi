import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as {
  engines?: {node?: string};
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
};
const workflow = readFileSync(path.join(root, '.github/workflows/quality.yml'), 'utf8');
const eslintConfig = readFileSync(path.join(root, 'eslint.config.mjs'), 'utf8');
const validation = readFileSync(path.join(root, 'src/server/leads/validation.ts'), 'utf8');

assert.equal(packageJson.engines?.node, '24.x');
assert.match(workflow, /node-version:\s*24/);
assert.match(packageJson.dependencies?.next ?? '', /^\^?16\./);
assert.equal(existsSync(path.join(root, 'src/middleware.ts')), false);
assert.equal(existsSync(path.join(root, 'src/proxy.ts')), true);
assert.doesNotMatch(eslintConfig, /FlatCompat|@eslint\/eslintrc/);
assert.match(eslintConfig, /eslint-config-next\/core-web-vitals/);
assert.match(eslintConfig, /eslint-config-next\/typescript/);
assert.doesNotMatch(eslintConfig, /tseslint\.configs\.base/);
assert.match(eslintConfig, /projectService:\s*true/);
assert.match(eslintConfig, /['"]@typescript-eslint\/no-deprecated['"]:\s*['"]error['"]/);
assert.equal(packageJson.devDependencies?.['@eslint/eslintrc'], undefined);
assert.match(packageJson.devDependencies?.['eslint-config-next'] ?? '', /^\^?16\./);
assert.equal(packageJson.devDependencies?.['@next/eslint-plugin-next'], undefined);
assert.equal(packageJson.devDependencies?.['typescript-eslint'], undefined);
assert.equal(packageJson.devDependencies?.autoprefixer, undefined);
assert.equal(packageJson.devDependencies?.prettier, undefined);
assert.equal(packageJson.devDependencies?.['@playwright/test'], undefined);
assert.equal(packageJson.scripts?.['test:e2e'], undefined);
assert.doesNotMatch(workflow, /playwright|chromium|test:e2e/i);
assert.doesNotMatch(validation, /\.superRefine\(/);
assert.doesNotMatch(validation, /\.strict\(\)/);
assert.doesNotMatch(validation, /\.toLowerCase\(\)\s*\.email\(/);
assert.match(validation, /z\s*\.email\(/);

console.log('Platform modernization regression checks passed.');
