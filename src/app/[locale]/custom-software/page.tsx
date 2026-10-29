import type { Metadata } from 'next';
import { getMessages, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import { notFound } from 'next/navigation';
import { ContactProjectForm } from '@/components/forms/ContactProjectForm';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import { ServiceFaqList } from '@/components/services/ServiceFaqList';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { LocalizedLink } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { FEATURED_PRODUCT } from '@/lib/products';
import { buildServeVisualLabels } from '@/lib/serve-visual-labels';
import { ServeProductVisual } from '@/components/product/serve/ServeProductVisual';
import { createMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{ locale: string }>;
}

function parseLocale(locale: string): Locale {
  if (locales.includes(locale as Locale)) return locale as Locale;
  notFound();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const currentLocale = parseLocale((await params).locale);
  const t = await getTranslations({ locale: currentLocale, namespace: 'customSoftwarePage' });

  return createMetadata({
    title: t('seoTitle'),
    description: t('seoDescription'),
    routeKey: 'customSoftware',
    locale: currentLocale
  });
}

export default async function CustomSoftwarePage({ params }: PageProps) {
  const currentLocale = parseLocale((await params).locale);
  const t = await getTranslations('customSoftwarePage');
  const messages = await getMessages();
  const contactMessages = messages.contactPage as {
    form: AbstractIntlMessages;
    projectTypeIndicator: string;
  };
  const serveVisualLabels = buildServeVisualLabels(await getTranslations('servePage.visuals'));

  const problemItems = [1, 2, 3, 4, 5, 6] as const;
  const capabilityItems = [1, 2, 3, 4] as const;
  const aiUseCaseItems = [1, 2, 3] as const;
  const additionalAiUseCaseItems = [4, 5, 6] as const;
  const processStages = [1, 2, 3, 4] as const;
  const faqItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

  return (
    <>
      <Section variant="light" spacing="hero">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="space-y-7 lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{t('hero.eyebrow')}</p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">{t('hero.heading')}</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-foreground-muted">{t('hero.body')}</p>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
              <TrackedButton href="#custom-software-form" variant="primary" eventName="custom_software_cta" properties={{ locale: currentLocale, source: 'custom_software_hero' }}>{t('hero.primaryCta')}</TrackedButton>
              <Button href="#custom-software-capabilities" variant="secondary">{t('hero.secondaryCta')}</Button>
            </div>
            <p className="max-w-2xl border-l-2 border-orange pl-4 text-sm leading-relaxed text-foreground-muted">{t('hero.trustLine')}</p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[24px] border border-border bg-surface p-6 shadow-card sm:p-8">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-text">{t('hero.panelLabel')}</p>
                <span className="h-3 w-3 rounded-full bg-orange" aria-hidden="true" />
              </div>
              <div className="space-y-3 pt-6">
                {[1, 2, 3].map((item, index) => (
                  <div key={item} className="flex items-start gap-4 rounded-2xl border border-border bg-background p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-subtle text-sm font-bold text-orange-text">0{index + 1}</span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-text">{t(`hero.panel${item}Label`)}</p>
                      <p className="mt-1 text-sm font-semibold leading-relaxed text-ink">{t(`hero.panel${item}`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="custom-software-problems" variant="muted" className="border-y border-border">
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{t('problems.eyebrow')}</p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t('problems.heading')}</h2>
            <p className="text-base leading-relaxed text-foreground-muted">{t('problems.body')}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {problemItems.map((item) => (
              <article key={item} className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                <span className="text-sm font-bold text-orange-text">0{item}</span>
                <p className="mt-5 text-sm font-semibold leading-relaxed text-ink">{t(`problems.item${item}`)}</p>
              </article>
            ))}
          </div>
          <div className="grid gap-6 rounded-2xl border border-orange/30 bg-orange-subtle/40 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-text">{t('fit.eyebrow')}</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink">{t('fit.heading')}</h3>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-ink">
              <p>{t('fit.body')}</p>
              <p className="font-semibold">{t('fit.trust')}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="dark" spacing="spacious">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="space-y-5 lg:col-span-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">{t('proof.eyebrow')}</p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('proof.heading', { productName: FEATURED_PRODUCT.name })}</h2>
            <p className="max-w-3xl text-base leading-relaxed text-white/70">{t('proof.body', { productName: FEATURED_PRODUCT.name })}</p>
            <TrackedButton href={getLocalizedPath('productsServe', currentLocale)} variant="brand" eventName="custom_software_cta" properties={{ locale: currentLocale, source: 'custom_software_proof', product: FEATURED_PRODUCT.analyticsProduct }}>{t('proof.cta', { productName: FEATURED_PRODUCT.name })}</TrackedButton>
          </div>
          <div className="lg:col-span-6">
            <ServeProductVisual type="workflow" labels={serveVisualLabels} />
          </div>
        </Container>
      </Section>

      <Section id="custom-software-capabilities" variant="surface">
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{t('capabilities.eyebrow')}</p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t('capabilities.heading')}</h2>
            <p className="text-base leading-relaxed text-foreground-muted">{t('capabilities.body')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilityItems.map((item) => (
              <article key={item} className="rounded-2xl border border-border bg-background p-6">
                <h3 className="text-lg font-bold text-ink">{t(`capabilities.item${item}Title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{t(`capabilities.item${item}Body`)}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="custom-software-ai" variant="muted" className="border-y border-border">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="space-y-5 lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{t('ai.eyebrow')}</p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t('ai.heading')}</h2>
            <p className="max-w-3xl text-base leading-relaxed text-foreground-muted">{t('ai.body')}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {aiUseCaseItems.map((item) => (
                <article key={item} className="rounded-xl border border-border bg-surface p-4">
                  <h3 className="text-sm font-bold text-ink">{t(`ai.useCase${item}Title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{t(`ai.useCase${item}Body`)}</p>
                </article>
              ))}
            </div>
            <details className="group rounded-xl border border-border bg-surface px-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange [&::-webkit-details-marker]:hidden">
                <span>{t('ai.moreUseCases')}</span>
                <span aria-hidden="true" className="text-xl text-foreground-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="grid gap-3 border-t border-border py-4 sm:grid-cols-3">
                {additionalAiUseCaseItems.map((item) => (
                  <article key={item}>
                    <h3 className="text-sm font-bold text-ink">{t(`ai.useCase${item}Title`)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{t(`ai.useCase${item}Body`)}</p>
                  </article>
                ))}
              </div>
            </details>
            <TrackedButton href="#custom-software-form" variant="secondary" eventName="ai_software_cta" properties={{ locale: currentLocale, source: 'custom_software_ai_section' }}>{t('ai.cta')}</TrackedButton>
          </div>
          <div className="rounded-[24px] border border-border bg-surface p-6 shadow-card sm:p-8 lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-text">{t('ai.workflowLabel')}</p>
            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-subtle text-sm font-bold text-orange-text">0{index + 1}</span>
                  <div className="flex-1 border-b border-border pb-3 last:border-0">
                    <p className="text-sm font-semibold leading-relaxed text-ink">{t(`ai.workflow${step}`)}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-border pt-5 text-sm font-semibold leading-relaxed text-ink">{t('ai.trust')}</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{t('ai.safeguards')}</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{t('ai.automationNote')}</p>
          </div>
        </Container>
      </Section>

      <Section variant="surface">
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{t('process.eyebrow')}</p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t('process.heading')}</h2>
            <p className="text-base leading-relaxed text-foreground-muted">{t('process.body')}</p>
          </div>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processStages.map((stage) => (
              <li key={stage} className="border-t-2 border-orange pt-5">
                <span className="text-4xl font-black text-border-strong">0{stage}</span>
                <h3 className="mt-4 text-lg font-bold text-ink">{t(`process.stage${stage}Title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{t(`process.stage${stage}Body`)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section id="custom-software-form" variant="muted" className="scroll-mt-24 border-y border-border" tabIndex={-1}>
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="space-y-5 lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{t('form.eyebrow')}</p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t('form.heading')}</h2>
            <p className="text-base leading-relaxed text-foreground-muted">{t('form.body')}</p>
            <p className="border-l-2 border-orange pl-4 text-sm leading-relaxed text-foreground-muted">{t('form.note')}</p>
            <p className="text-sm leading-relaxed text-foreground-muted">{t('form.nextSteps')}</p>
            <LocalizedLink href="/privacy" locale={currentLocale} className="inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-orange-text underline decoration-orange/40 underline-offset-4 outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2">
              {t('form.privacyLink')}
            </LocalizedLink>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8 lg:col-span-7">
            <NextIntlClientProvider
              messages={{
                contactPage: {
                  form: contactMessages.form,
                  projectTypeIndicator: contactMessages.projectTypeIndicator
                }
              }}
            >
              <ContactProjectForm
                locale={currentLocale}
                initialType="custom-software"
                analyticsSource="custom_software_landing"
              />
            </NextIntlClientProvider>
          </div>
        </Container>
      </Section>

      <Section variant="surface">
        <Container className="max-w-4xl space-y-8">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t('faq.heading')}</h2>
          <ServiceFaqList items={faqItems.map((item) => ({ question: t(`faq.q${item}`), answer: t(`faq.a${item}`) }))} />
        </Container>
      </Section>
    </>
  );
}
