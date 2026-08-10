import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function read(file: string) {
  return readFileSync(resolve(process.cwd(), file), 'utf8');
}

const home = read('src/app/[locale]/page.tsx');
const expectedOrder = [
  '<HeroSection',
  '<ZaikoFeature',
  '<PhilosophySection',
  '<InsightsPreview',
  '<CompanyContext',
  '<ServicesSection',
  '<FinalCta'
];

let previousIndex = -1;
for (const component of expectedOrder) {
  const index = home.indexOf(component);
  assert.ok(index > previousIndex, `${component} should appear in the intended Homepage sequence`);
  previousIndex = index;
}

assert.ok(!home.includes('ProductsIntro'), 'ProductsIntro should not be rendered or imported by Home');

for (const file of [
  'src/components/home/HeroSection.tsx',
  'src/components/home/ZaikoFeature.tsx',
  'src/components/home/FinalCta.tsx'
]) {
  assert.ok(
    read(file).includes('buildProductDemoHref'),
    `${file} should keep product Demo URLs behind buildProductDemoHref`
  );
}

for (const file of [
  'src/components/home/CompanyContext.tsx',
  'src/components/home/InsightsPreview.tsx',
  'src/components/home/ServicesSection.tsx'
]) {
  assert.ok(!/^\s*(['"])use client\1;/m.test(read(file)), `${file} should remain a Server Component`);
}

console.log('Homepage structure regression checks passed.');
