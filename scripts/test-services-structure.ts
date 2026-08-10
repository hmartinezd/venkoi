import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (file: string): string => readFileSync(resolve(process.cwd(), file), 'utf8');
const overview = read('src/app/[locale]/services/page.tsx');
const mobile = read('src/app/[locale]/services/mobile-applications/page.tsx');
const web = read('src/app/[locale]/services/websites-web-applications/page.tsx');
const processSource = read('src/components/services/ServiceProcess.tsx');

function assertOrder(source: string, components: string[], page: string) {
  let previous = -1;
  for (const component of components) {
    const current = source.indexOf(`<${component}`);
    assert.ok(current > previous, `${page}: ${component} should appear in the intended order`);
    previous = current;
  }
}

assertOrder(overview, ['ServiceOfferings', 'ServiceProcess'], 'Services overview');
for (const marker of ['projectFit.heading', 'relatedGuides', 'services_overview_footer']) assert.ok(overview.includes(marker), `Overview should preserve ${marker}`);
assert.ok(overview.indexOf('<ServiceProcess') < overview.indexOf('projectFit.heading'), 'Process should precede Project Fit');
assert.ok(overview.includes("routeKey: 'servicesMobile'") && overview.includes("routeKey: 'servicesWeb'"), 'Overview should contain exactly the two approved service routes');

const detailOrder = ['ServiceDetailHero', 'ServiceScope', 'ServiceProcess', 'ServiceStartingPoint', 'ServiceDecisionSupport', 'ServiceCta'];
assertOrder(mobile, detailOrder, 'Mobile detail');
assertOrder(web, detailOrder, 'Web detail');

for (const [source, interest, prefix] of [[mobile, 'mobile', 'mobile'], [web, 'web', 'web']] as const) {
  assert.ok(source.includes(`interest="${interest}"`), `${prefix} interest should remain canonical`);
  for (const suffix of ['detail_hero', 'starting_point']) assert.ok(source.includes(`${prefix}_${suffix}`), `${prefix}_${suffix} should remain stable`);
  assert.ok(source.includes(`interest="${interest}"`), `${prefix} footer should derive its analytics source from interest`);
  assert.ok(!source.includes('home.finalCta'), `${prefix} should use service-specific final CTA copy`);
}

assert.ok(!processSource.includes('useTranslations'), 'ServiceProcess should remain translation-decoupled');
for (const file of ['ServiceOfferings', 'ServiceDetailHero', 'ServiceScope', 'ServiceProcess', 'ServiceStartingPoint', 'ServiceDecisionSupport', 'ServiceCta', 'ServiceFaqList']) {
  assert.ok(!/^\s*(['"])use client\1;/m.test(read(`src/components/services/${file}.tsx`)), `${file} should remain a Server Component`);
}
console.log('Services structure regression checks passed.');
