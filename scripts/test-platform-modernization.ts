import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
const localeLayout = readFileSync(path.join(root, 'src/app/[locale]/layout.tsx'), 'utf8');
const leadsRoute = readFileSync(path.join(root, 'src/app/api/leads/route.ts'), 'utf8');
const botIdClient = readFileSync(path.join(root, 'src/instrumentation-client.ts'), 'utf8');

function readSourceTree(directory: string): string {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return [readSourceTree(entryPath)];
      return /\.(?:ts|tsx|js|mjs)$/.test(entry.name) ? [readFileSync(entryPath, 'utf8')] : [];
    })
    .join('\n');
}

const sourceTree = readSourceTree(path.join(root, 'src'));

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
assert.match(packageJson.devDependencies?.['@playwright/test'] ?? '', /^\^?1\./);
assert.match(packageJson.devDependencies?.['@axe-core/playwright'] ?? '', /^\^?4\./);
assert.equal(packageJson.scripts?.['test:e2e'], 'playwright test');
assert.match(packageJson.scripts?.quality ?? '', /test:e2e/);
assert.match(workflow, /playwright install --with-deps chromium/);
assert.equal(existsSync(path.join(root, 'playwright.config.ts')), true);
assert.equal(existsSync(path.join(root, 'tests/e2e')), true);
assert.doesNotMatch(validation, /\.superRefine\(/);
assert.doesNotMatch(validation, /\.strict\(\)/);
assert.doesNotMatch(validation, /\.toLowerCase\(\)\s*\.email\(/);
assert.match(validation, /z\s*\.email\(/);
assert.equal((localeLayout.match(/<Analytics\s*\/>/g) ?? []).length, 1, 'Analytics must be mounted exactly once');
assert.equal((localeLayout.match(/<SpeedInsights\s*\/>/g) ?? []).length, 1, 'Speed Insights must be mounted exactly once');
assert.equal((sourceTree.match(/initBotId\s*\(/g) ?? []).length, 1, 'BotID client initialization must not be duplicated');
assert.match(botIdClient, /path:\s*['"]\/api\/leads['"][\s\S]*method:\s*['"]POST['"]/, 'BotID client must protect POST /api/leads');
assert.match(leadsRoute, /checkBotId\s*\(\s*\)/, 'POST /api/leads must verify BotID server-side');
assert.match(leadsRoute, /if\s*\(isDeployed\)[\s\S]*SUBMISSION_ERROR/, 'deployed BotID verification errors must fail closed');
assert.equal((sourceTree.match(/NEXT_PUBLIC_SITE_URL/g) ?? []).length, 0, 'canonical origin must not require NEXT_PUBLIC_SITE_URL');
assert.equal((sourceTree.match(/VERCEL_(?:BRANCH_)?URL/g) ?? []).length, 0, 'canonical origin must not derive from Vercel deployment hostnames');

console.log('Platform modernization regression checks passed.');
