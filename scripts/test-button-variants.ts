import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (file: string): string => readFileSync(resolve(process.cwd(), file), 'utf8');
const button = read('src/components/ui/Button.tsx');
const trackedButton = read('src/components/analytics/TrackedButton.tsx');

assert.match(button, /export type ButtonVariant = 'primary' \| 'secondary' \| 'brand' \| 'inverse' \| 'text'/);

const brand = button.match(/brand:\s*'([^']+)'/)?.[1] ?? '';
assert.ok(brand.includes('bg-orange'), 'Brand should use the brand-orange background');
assert.ok(brand.includes('text-ink'), 'Brand should use Ink foreground text');
assert.ok(!brand.includes('text-white'), 'Brand must not use white normal text on orange');
assert.ok(!brand.includes('hover:bg-orange/'), 'Brand hover must not reduce orange opacity');

const inverse = button.match(/inverse:\s*'([^']+)'/)?.[1] ?? '';
assert.ok(inverse.includes('text-white'), 'Inverse should use white text on dark surfaces');
assert.ok(inverse.includes('bg-white/10'), 'Inverse should use a restrained translucent surface');
assert.ok(inverse.includes('border-white/20'), 'Inverse should use a restrained light border');

assert.match(trackedButton, /import \{ Button, type ButtonVariant \}/);
assert.match(trackedButton, /variant\?: ButtonVariant/);
assert.doesNotMatch(trackedButton, /variant\?:\s*'primary'/);

for (const [file, expected] of [
  ['src/components/home/FinalCta.tsx', ['variant="brand"', 'variant="inverse"']],
  ['src/app/[locale]/about/page.tsx', ['variant="brand"', 'variant="inverse"']],
  ['src/app/[locale]/services/page.tsx', ['variant="brand"']],
  ['src/components/services/ServiceCta.tsx', ['variant="brand"']]
] as const) {
  const source = read(file);
  for (const marker of expected) assert.ok(source.includes(marker), `${file} should use ${marker}`);
}

function findTsxFiles(directory: string): string[] {
  return readdirSync(resolve(process.cwd(), directory), { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return findTsxFiles(path);
    return entry.isFile() && entry.name.endsWith('.tsx') ? [path] : [];
  });
}

const sourceFiles = findTsxFiles('src');
const dangerousColor = /(?:^|\s)(?:bg-(?:orange|white(?:\/\S+)?|transparent)|text-(?:white|ink)|border-(?:orange|white(?:\/\S+)?))(?:\s|$)/;

for (const file of sourceFiles) {
  const source = read(file);
  const tags = source.match(/<(?:Button|TrackedButton)\b[\s\S]*?>/g) ?? [];
  for (const tag of tags) {
    if (!/variant="(?:primary|secondary)"/.test(tag)) continue;
    const className = tag.match(/className="([^"]*)"/)?.[1];
    if (className) assert.ok(!dangerousColor.test(className), `${file} has a conflicting standard-variant color override`);
  }
}

const packageJson = read('package.json');
assert.ok(!packageJson.includes('tailwind-merge'), 'tailwind-merge must not be introduced');

console.log('Button variant regression checks passed.');
