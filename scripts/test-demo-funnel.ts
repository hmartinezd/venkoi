import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');
const form = read('src/components/forms/DemoRequestForm.tsx');
const page = read('src/app/[locale]/demo/page.tsx');

assert.match(form, /if \(pending\) return;/, 'pending submissions have a synchronous guard');
assert.match(form, /disabled=\{pending\}/, 'submit is disabled while pending');
assert.match(form, /submitEarlyAccess/, 'Early Access uses an intent-aware submit label');
assert.match(form, /fixedEarlyAccessIntent/, 'URL-selected Early Access cannot contradict page intent');
assert.match(form, /demo_form_start/);
assert.match(form, /demo_form_submit/);
assert.match(form, /demo_form_success/);
assert.equal((form.match(/source: conversionSource/g) ?? []).length, 3, 'controlled source reaches all downstream funnel events');
assert.match(form, /optionalSummary/, 'qualification remains progressive and optional');
assert.match(form, /optionalDetailsRef\.current\.open = true/, 'hidden optional errors open before focus');
assert.match(form, /successActions\.product/);
assert.match(form, /successActions\.guide/);
assert.match(page, /normalizeDemoConversionSource\(source\)/, 'Demo page normalizes source before client analytics');
assert.match(page, /fixedEarlyAccessIntent=\{isEarlyAccess\}/);

console.log('Demo funnel regression tests passed.');
