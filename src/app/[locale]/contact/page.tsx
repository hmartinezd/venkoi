import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ContactProjectForm } from '@/components/forms/ContactProjectForm';
import { DirectContactChannels } from '@/components/contact/DirectContactChannels';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import { normalizeServiceInterest } from '@/lib/services';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parseLocale(locale: string): Locale {
  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  notFound();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  const t = await getTranslations({ locale: currentLocale, namespace: 'contactPage' });
  const seo = await getTranslations({ locale: currentLocale, namespace: 'seo' });
  return createMetadata({
    title: `${t('eyebrow')} | ${seo('title')}`,
    description: t('body'),
    routeKey: 'contact',
    locale: currentLocale
  });
}

export default async function ContactPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { type, interest } = await searchParams;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('contactPage');

  const selectedType = typeof type === 'string' ? type : '';
  const initialInterest = normalizeServiceInterest(interest);

  const isServicesIntent = selectedType === 'services' && initialInterest !== '';

  let eyebrowText = t('eyebrow');
  let headingText = t('heading');
  let bodyText = t('body');

  if (isServicesIntent) {
    eyebrowText = t(`intent.${initialInterest}.eyebrow`);
    headingText = t(`intent.${initialInterest}.heading`);
    bodyText = t(`intent.${initialInterest}.body`);
  }

  return (
    <Section variant="light" spacing="hero">
      <Container className="max-w-4xl space-y-10">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {eyebrowText}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-tight">
            {headingText}
          </h1>
          <p className="text-lg text-foreground-muted leading-relaxed max-w-2xl">
            {bodyText}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange">
                {t('direct.eyebrow')}
              </p>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">{t('direct.heading')}</h2>
              <p className="text-sm leading-relaxed text-foreground-muted">{t('direct.body')}</p>
            </div>
            <DirectContactChannels
              variant="panel"
              whatsappMessage={t('direct.whatsappMessage')}
              whatsappLabel={t('direct.whatsappLabel')}
              whatsappAriaLabel={t('direct.whatsappAriaLabel')}
              emailLabel={t('direct.emailLabel')}
              emailAriaLabel={t('direct.emailAriaLabel')}
              emailSubject={t('direct.emailSubject')}
              showWhatsAppNumber
            />
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-card">
          <ContactProjectForm
            locale={currentLocale}
            initialType={selectedType}
            initialInterest={initialInterest}
          />
        </div>

        {/* What Happens Next & Contextual Details */}
        <div className="grid gap-10 md:grid-cols-2 pt-8">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-ink">{t('nextSteps.heading')}</h2>
              <ol className="space-y-4">
                {[1, 2, 3].map((step) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange/10 text-xs font-bold text-orange">
                      {step}
                    </span>
                    <p className="text-sm text-foreground-muted leading-relaxed">
                      {t(`nextSteps.step${step}`)}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-sm font-medium text-ink border-l-2 border-orange/30 pl-4 py-1 italic">
              {t('nextSteps.differentiator')}
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange">{t('locationEyebrow')}</span>
              <h3 className="text-lg font-bold text-ink">{t('locationBoxTitle')}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{t('locationBoxDesc')}</p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange">{t('inquiriesEyebrow')}</span>
              <h3 className="text-lg font-bold text-ink">{t('emailBoxTitle')}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{t('emailBoxDesc')}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
