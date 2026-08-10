import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const serverComponents = [
  'src/components/home/ServicesSection.tsx',
  'src/components/services/ServiceCta.tsx',
  'src/components/product/zaiko/ZaikoProductNav.tsx',
  'src/components/layout/Footer.tsx'
];

const clientComponents = [
  'src/components/analytics/TrackedButton.tsx',
  'src/components/product/zaiko/ZaikoExplorer.tsx',
  'src/components/layout/Header.tsx',
  'src/components/i18n/LanguageSwitcher.tsx',
  'src/components/forms/DemoRequestForm.tsx',
  'src/components/forms/ContactProjectForm.tsx'
];

function hasClientDirective(file: string) {
  const source = readFileSync(resolve(process.cwd(), file), 'utf8');
  return /^\s*(['"])use client\1;/.test(source);
}

for (const file of serverComponents) {
  assert.equal(hasClientDirective(file), false, `${file} should remain a Server Component`);
}

for (const file of clientComponents) {
  assert.equal(hasClientDirective(file), true, `${file} should remain a Client Component`);
}

console.log('Rendering boundary regression checks passed.');
