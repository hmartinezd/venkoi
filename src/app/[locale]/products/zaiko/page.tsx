import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ZaikoProductNav } from '@/components/product/zaiko/ZaikoProductNav';
import { ZaikoHero } from '@/components/product/zaiko/ZaikoHero';
import { ZaikoWorkflowStory, type WorkflowChapter } from '@/components/product/zaiko/ZaikoWorkflowStory';
import { ZaikoProductFit } from '@/components/product/zaiko/ZaikoProductFit';
import { ZaikoEarlyAccess } from '@/components/product/zaiko/ZaikoEarlyAccess';
import { ZaikoFinalCta } from '@/components/product/zaiko/ZaikoFinalCta';
import { ZaikoFaq } from '@/components/product/zaiko/ZaikoFaq';
import { InsightCard } from '@/components/insights/InsightCard';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { createMetadata } from '@/lib/seo';
import { getSiteOrigin } from '@/lib/site-config';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FEATURED_PRODUCT, productPlatformToSchemaOperatingSystem } from '@/lib/products';
import { PRODUCT_NON_CLAIMS, PRODUCT_TRUST_PRINCIPLES } from '@/lib/product-capabilities';
import { areGroupsMarketable, filterMarketableEntries, getWorkflowMarketingState, PRODUCT_STORY_CHAPTERS, PRODUCT_WORKFLOW_STEPS } from '@/lib/product-marketing';
import { buildZaikoVisualLabels } from '@/lib/zaiko-visual-labels';

interface PageProps { params: Promise<{ locale: string }> }
function parseLocale(locale: string): Locale { if (locales.includes(locale as Locale)) return locale as Locale; notFound(); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const currentLocale = parseLocale((await params).locale);
  const t = await getTranslations({ locale: currentLocale, namespace: 'zaikoPage.seo' });
  return createMetadata({ title: t('title', { productName: FEATURED_PRODUCT.name }), description: t('description', { productName: FEATURED_PRODUCT.name }), routeKey: 'productsZaiko', locale: currentLocale });
}

export default async function ZaikoPage({ params }: PageProps) {
  const currentLocale = parseLocale((await params).locale);
  const t = await getTranslations('zaikoPage');
  const tHeader = await getTranslations('header');
  const tArticles = await getTranslations('insightsArticles');
  const tInsights = await getTranslations('insightsPage');
  const values = { productName: FEATURED_PRODUCT.name, freeMonths: FEATURED_PRODUCT.earlyAccess.freeMonths };
  const labels = buildZaikoVisualLabels(await getTranslations('zaikoPage.visuals'));

  // Valid release progression must never fail rendering; only actual trust
  // contradictions remain fatal public-marketing inconsistencies.
  if (PRODUCT_TRUST_PRINCIPLES.invoicePosting.automaticPosting || PRODUCT_TRUST_PRINCIPLES.costing.fabricateMissingCosts || PRODUCT_TRUST_PRINCIPLES.physicalCounts.zeroEqualsUncounted || PRODUCT_TRUST_PRINCIPLES.reorder.supplierElectronicOrdering || !PRODUCT_NON_CLAIMS.includes('supplier-electronic-ordering')) throw new Error('Product marketing truth is inconsistent.');

  const visibleChapterConfig = filterMarketableEntries(PRODUCT_STORY_CHAPTERS);
  const chapters: WorkflowChapter[] = visibleChapterConfig.map(({ id, key, ...rest }) => ({
    id, ...rest,
    eyebrow: t(`story.chapters.${key}.eyebrow`), heading: t(`story.chapters.${key}.heading`), body: t(`story.chapters.${key}.body`, values),
    points: [0, 1, 2, 3].map((index) => t(`story.chapters.${key}.points.${index}`)),
    trust: key === 'invoice' || key === 'costing' || key === 'counts' ? t(`story.chapters.${key}.trust`) : undefined
  }));
  const workflowState = getWorkflowMarketingState();
  const workflowSteps = PRODUCT_WORKFLOW_STEPS
    .filter(({ groups }) => areGroupsMarketable(groups))
    .map(({ key }) => t(`story.workflow.steps.${key}`));
  const dataSafety = areGroupsMarketable(['data-safety']) ? {
    eyebrow: t('story.dataSafety.eyebrow'), heading: t('story.dataSafety.heading'), body: t('story.dataSafety.body'),
    points: [0,1,2,3].map((i) => t(`story.dataSafety.points.${i}`))
  } : undefined;

  const origin = getSiteOrigin();
  const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: FEATURED_PRODUCT.name, url: `${origin}${getLocalizedPath('productsZaiko', currentLocale)}`, applicationCategory: 'BusinessApplication', description: t('seo.description', values), operatingSystem: productPlatformToSchemaOperatingSystem(FEATURED_PRODUCT.platform), author: { '@type': 'Organization', name: 'Venkoi', url: origin } };
  const faqItems = Array.from({ length: 10 }, (_, index) => ({ q: t(`faq.items.${index}.q`, values), a: t(`faq.items.${index}.a`, values) }));

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <ZaikoProductNav locale={currentLocale} productName={FEATURED_PRODUCT.name} subtitle={t('nav.subtitle')} overviewLabel={t('nav.overview')} invoiceLabel={t('nav.invoice')} inventoryLabel={t('nav.inventory')} foodCostLabel={t('nav.foodCost')} countsLabel={t('nav.counts')} ownerLabel={t('nav.owner')} requestDemoLabel={t('nav.requestDemo')} navigationLabel={tHeader('productNavigation', { productName: FEATURED_PRODUCT.name })} visibleChapterIds={chapters.map(({ id }) => id)} />
    <ZaikoHero locale={currentLocale} eyebrow={t('hero.eyebrow', values)} heading={t('hero.heading')} body={t('hero.body', values)} primaryCta={t('hero.primaryCta')} earlyAccess={FEATURED_PRODUCT.earlyAccess.enabled ? { cta: t('hero.secondaryCta', values), microcopy: t('hero.microcopy', values), noCreditCard: t('hero.noCreditCard') } : undefined} labels={labels} />
    {chapters.length > 0 ? <ZaikoWorkflowStory workflow={{ eyebrow: t('story.workflow.eyebrow'), heading: t('story.workflow.heading'), body: t('story.workflow.body'), availability: t(`story.workflow.availability.${workflowState}`), steps: workflowSteps }} chapters={chapters} dataSafety={dataSafety} labels={labels} /> : null}
    <ZaikoProductFit workflow={{ eyebrow: t('workflow.eyebrow'), heading: t('workflow.heading'), body: t('workflow.body') }} audience={{ heading: t('audience.heading'), body: t('audience.body', values), items: [0,1,2,3].map((i) => t(`audience.items.${i}`)) }} labels={labels} />
    {FEATURED_PRODUCT.earlyAccess.enabled ? <ZaikoEarlyAccess locale={currentLocale} eyebrow={t('earlyAccess.eyebrow', values)} heading={t('earlyAccess.heading', values)} body={t('earlyAccess.body', values)} details={[0,1,2,3].map((i) => t(`earlyAccess.details.${i}`, values))} primaryCta={t('earlyAccess.primaryCta')} secondaryCta={t('earlyAccess.secondaryCta', values)} /> : null}
    <ZaikoFaq heading={t('faq.heading', values)} items={faqItems} />
    <Section variant="muted" spacing="compact" className="border-t border-border"><Container className="max-w-4xl space-y-8"><p className="text-center text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{tArticles('relatedGuide')}</p><div className="mx-auto max-w-2xl"><InsightCard locale={currentLocale} category={tArticles('restaurantInventory.category')} title={tArticles('restaurantInventory.title')} description={tArticles('restaurantInventory.description')} routeKey="insightRestaurantInventory" readMoreLabel={tInsights('readMore')} /></div></Container></Section>
    <ZaikoFinalCta locale={currentLocale} heading={t('finalCta.heading')} body={t('finalCta.body', values)} primaryCta={t('finalCta.primaryCta')} earlyAccess={FEATURED_PRODUCT.earlyAccess.enabled ? { cta: t('finalCta.secondaryCta', values) } : undefined} directHeading={t('finalCta.directHeading', values)} directBody={t('finalCta.directBody')} whatsappLabel={t('finalCta.whatsappLabel')} whatsappAriaLabel={t('finalCta.whatsappAriaLabel', values)} whatsappMessage={t('finalCta.whatsappMessage', values)} />
  </>;
}
