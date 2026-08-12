import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (file: string): string => readFileSync(resolve(process.cwd(), file), 'utf8');
const index = read('src/app/[locale]/insights/page.tsx');
const shell = read('src/components/insights/InsightArticle.tsx');
const related = read('src/components/insights/RelatedInsights.tsx');
const restaurantGuide = read('src/components/insights/RestaurantInsightGuide.tsx');

const articles = [
  {
    key: 'insightRestaurantInventory',
    file: 'src/app/[locale]/insights/restaurant-inventory-information/page.tsx',
    ids: ['problem', 'purchases', 'quantities', 'activity', 'costs', 'together', 'product-approach'],
    related: ['insightRestaurantInventoryCounts', 'insightRestaurantFoodCost', 'insightRestaurantSupplierPrices'],
    source: 'insight'
  },
  {
    key: 'insightStartSoftwareProject',
    file: 'src/app/[locale]/insights/start-a-software-project/page.tsx',
    ids: ['problem', 'users', 'workflow', 'existing-context', 'priorities', 'process'],
    related: ['insightRestaurantInventory', 'insightWebsiteOrWebApp'],
    source: 'insight_start_software_project'
  },
  {
    key: 'insightWebsiteOrWebApp',
    file: 'src/app/[locale]/insights/website-or-web-application/page.tsx',
    ids: ['website', 'web-application', 'between', 'questions', 'outcome'],
    related: ['insightRestaurantInventory', 'insightStartSoftwareProject'],
    source: 'insight_web_decision'
  }
] as const;

for (const [key, file] of [
  ['insightRestaurantInventoryCounts', 'src/app/[locale]/insights/restaurant-inventory-counts/page.tsx'],
  ['insightRestaurantFoodCost', 'src/app/[locale]/insights/restaurant-food-cost/page.tsx'],
  ['insightRestaurantSupplierPrices', 'src/app/[locale]/insights/restaurant-supplier-price-changes/page.tsx']
] as const) {
  assert.ok(index.includes(`routeKey: '${key}'`), `Index should include ${key}`);
  const source = read(file);
  assert.ok(source.includes('RestaurantInsightGuide'), `${key} should use the shared article architecture`);
  assert.ok(source.includes('product-approach'), `${key} should include a product connection`);
}
assert.ok(restaurantGuide.includes("source: 'insight'") && restaurantGuide.includes('eventName="zaiko_demo_cta"'), 'Restaurant guides should preserve Demo analytics');
assert.ok(index.indexOf('restaurantArticles') < index.indexOf('softwareArticles'), 'Restaurant operations should lead the landing page');

const featuredPosition = index.indexOf('featured');
assert.ok(featuredPosition > index.indexOf('articles[0]'), 'The first index article should be featured');
assert.ok(index.indexOf("routeKey: 'insightRestaurantInventory'") < index.indexOf("routeKey: 'insightStartSoftwareProject'"), 'Restaurant Inventory should remain first');
for (const article of articles) assert.ok(index.includes(`routeKey: '${article.key}'`), `Index should preserve ${article.key}`);

for (const article of articles) {
  const source = read(article.file);
  assert.equal(new Set(article.ids).size, article.ids.length, `${article.key} section IDs should be unique`);
  for (const id of article.ids) {
    assert.ok(source.includes(`{ id: '${id}', label:`), `${article.key} TOC should contain ${id}`);
    assert.ok(source.includes(`<ArticleSection id="${id}"`), `${article.key} should render section ${id}`);
  }
  assert.ok(source.includes('<RelatedInsights'), `${article.key} should use shared related Insights`);
  const relatedList = source.slice(source.indexOf('articles={['), source.indexOf(']} />', source.indexOf('articles={[')));
  assert.ok(!relatedList.includes(`routeKey: '${article.key}'`), `${article.key} should not relate to itself`);
  for (const routeKey of article.related) assert.ok(source.includes(`routeKey: '${routeKey}'`), `${article.key} should relate to ${routeKey}`);
  assert.ok(source.includes(`source: '${article.source}'`), `${article.key} analytics source should remain stable`);
}

const restaurant = read(articles[0].file);
assert.ok(restaurant.indexOf('<TrackedButton') < restaurant.indexOf('<Button'), 'Restaurant Demo should precede Explore Product in DOM order');
assert.ok(restaurant.includes('eventName="zaiko_demo_cta"'), 'Restaurant Demo analytics event should remain stable');
assert.ok(shell.includes('href={`#${section.id}`}') && shell.includes('scroll-mt-24'), 'TOC anchors and header offset should remain connected');
assert.ok(!/^\s*(['"])use client\1;/m.test(shell), 'InsightArticle should remain a Server Component');
assert.ok(!/^\s*(['"])use client\1;/m.test(related), 'RelatedInsights should remain a Server Component');

console.log('Insights structure regression checks passed.');
