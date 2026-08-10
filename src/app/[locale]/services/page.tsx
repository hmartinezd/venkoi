import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import { InsightCard } from '@/components/insights/InsightCard';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ServiceOfferings } from '@/components/services/ServiceOfferings';
import { ServiceProcess } from '@/components/services/ServiceProcess';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { createMetadata } from '@/lib/seo';

interface PageProps { params: Promise<{ locale: string }> }
function parseLocale(locale: string): Locale { if (locales.includes(locale as Locale)) return locale as Locale; notFound(); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const currentLocale = parseLocale((await params).locale);
  const t = await getTranslations({ locale: currentLocale, namespace: 'servicesPage' });
  return createMetadata({ title: t('seoTitle'), description: t('seoDescription'), routeKey: 'services', locale: currentLocale });
}

export default async function ServicesPage({ params }: PageProps) {
  const currentLocale = parseLocale((await params).locale);
  const t = await getTranslations('servicesPage');
  const articles = await getTranslations('insightsArticles');
  const insights = await getTranslations('insightsPage');
  const stages = ([1, 2, 3, 4] as const).map((i) => ({ number: t(`howWeWork.stage${i}Num`), title: t(`howWeWork.stage${i}Title`), description: t(`howWeWork.stage${i}Desc`) }));

  return <>
    <Section variant="light" spacing="hero">
      <Container className="max-w-4xl space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{t('eyebrow')}</p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">{t('heading')}</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-foreground-muted">{t('body')}</p>
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
          <TrackedButton href={`${getLocalizedPath('contact', currentLocale)}?type=services`} variant="primary" eventName="services_cta" properties={{ locale: currentLocale, source: 'services_overview_hero' }}>{t('primaryCta')}</TrackedButton>
          <span className="flex items-center gap-2 text-xs font-semibold text-foreground-muted"><span className="h-1.5 w-1.5 rounded-full bg-orange" />{t('secondaryCue')}</span>
        </div>
      </Container>
    </Section>

    <ServiceOfferings locale={currentLocale} offerings={[
      { eyebrow: t('mobileEyebrow'), title: t('mobileTitle'), body: t('mobileBody'), cue: t('mobileSupporting'), cta: t('exploreMobile'), routeKey: 'servicesMobile', source: 'services_overview_mobile' },
      { eyebrow: t('webEyebrow'), title: t('webTitle'), body: t('webBody'), cue: t('webSupporting'), cta: t('exploreWeb'), routeKey: 'servicesWeb', source: 'services_overview_web' }
    ]} />

    <ServiceProcess eyebrow={t('howWeWork.eyebrow')} heading={t('howWeWork.heading')} stages={stages} testingPrinciple={t('howWeWork.testingPrinciple')} />

    <Section variant="light" className="border-t border-border">
      <Container className="space-y-8">
        <div className="max-w-3xl space-y-4"><p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{t('projectFit.eyebrow')}</p><h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t('projectFit.heading')}</h2></div>
        <div className="grid gap-4 sm:grid-cols-3">{([1, 2, 3] as const).map((i) => <div key={i} className="rounded-2xl border border-border bg-surface p-6"><p className="text-sm font-semibold leading-relaxed text-ink">{t(`projectFit.item${i}`)}</p></div>)}</div>
      </Container>
    </Section>

    <Section variant="light" spacing="compact" className="border-t border-border">
      <Container className="space-y-8"><h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{t('relatedGuides')}</h2><div className="grid gap-6 md:grid-cols-2">
        <InsightCard locale={currentLocale} category={articles('startSoftwareProject.category')} title={articles('startSoftwareProject.title')} description={articles('startSoftwareProject.description')} routeKey="insightStartSoftwareProject" readMoreLabel={insights('readMore')} />
        <InsightCard locale={currentLocale} category={articles('websiteOrWebApp.category')} title={articles('websiteOrWebApp.title')} description={articles('websiteOrWebApp.description')} routeKey="insightWebsiteOrWebApp" readMoreLabel={insights('readMore')} />
      </div></Container>
    </Section>

    <Section variant="dark" spacing="spacious" className="text-center">
      <Container className="max-w-3xl space-y-8"><div className="space-y-4"><p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">{t('approachEyebrow')}</p><h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{t('ideaTitle')}</h2><p className="mx-auto max-w-xl text-base leading-relaxed text-white/70">{t('ideaBody')}</p></div><div className="inline-block rounded-full border border-white/20 bg-white/5 px-6 py-2"><p className="text-xs font-medium text-white/90 sm:text-sm">{t('differentiator')}</p></div><div><TrackedButton href={`${getLocalizedPath('contact', currentLocale)}?type=services`} variant="brand" eventName="services_cta" properties={{ locale: currentLocale, source: 'services_overview_footer' }}>{t('ideaCta')}</TrackedButton></div></Container>
    </Section>
  </>;
}
