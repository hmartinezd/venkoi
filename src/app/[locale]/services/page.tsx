import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { locales, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
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
  const t = await getTranslations({ locale: currentLocale, namespace: 'servicesPage' });
  const isSpanish = currentLocale === 'es';

  const title = isSpanish
    ? 'Servicios | Apps Móviles y Desarrollo Web | Venkoi'
    : 'Services | Mobile Apps & Web Development | Venkoi';

  const description = isSpanish
    ? 'Venkoi diseña y desarrolla aplicaciones móviles, páginas web y aplicaciones web para empresas y emprendedores en Tampa Bay, South Florida y más allá.'
    : 'Venkoi designs and builds mobile applications, websites, and web applications for businesses, startups, and entrepreneurs in Tampa Bay, South Florida, and beyond.';

  return createMetadata({
    title,
    description,
    routeKey: 'services',
    locale: currentLocale
  });
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('servicesPage');

  return (
    <>
      {/* Hero Section */}
      <Section variant="light" className="pt-14 pb-20 md:pt-20 md:pb-28">
        <Container className="max-w-4xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-tight">
            {t('heading')}
          </h1>
          <p className="text-lg text-foreground-muted leading-relaxed max-w-3xl">
            {t('body')}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <Button href={getLocalizedPath('contact', currentLocale) + '?type=services'} variant="primary">
              {t('primaryCta')}
            </Button>
            <span className="text-xs font-semibold text-foreground-muted flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              {t('secondaryCue')}
            </span>
          </div>
        </Container>
      </Section>

      {/* Service 01 — Mobile Applications */}
      <Section variant="surface" className="py-16 md:py-24 border-y border-border">
        <Container className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center rounded-md bg-orange-subtle px-3 py-1 text-xs font-bold text-orange uppercase tracking-wider">
              {t('mobileEyebrow')}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t('mobileTitle')}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              {t('mobileBody')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-orange">01</span>
              <h3 className="text-lg font-bold text-ink">{t('mobileTheme1')}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {currentLocale === 'es'
                  ? 'Diseñadas para la experiencia de tus clientes finales en plataformas móviles.'
                  : 'Designed specifically for your customers on mobile platforms.'}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-orange">02</span>
              <h3 className="text-lg font-bold text-ink">{t('mobileTheme2')}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {currentLocale === 'es'
                  ? 'Herramientas operativas creadas para los equipos y flujos de trabajo de la empresa.'
                  : 'Operational tools built for team and business workflows.'}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-orange">03</span>
              <h3 className="text-lg font-bold text-ink">{t('mobileTheme3')}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {currentLocale === 'es'
                  ? 'Soluciones preparadas para operar en entornos y procesos reales.'
                  : 'Solutions built to operate effectively in real-world environments.'}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button href={getLocalizedPath('contact', currentLocale) + '?type=services&interest=mobile'} variant="secondary">
              {t('primaryCta')}
            </Button>
          </div>
        </Container>
      </Section>

      {/* Service 02 — Websites & Web Applications */}
      <Section variant="light" className="py-16 md:py-24">
        <Container className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center rounded-md bg-orange-subtle px-3 py-1 text-xs font-bold text-orange uppercase tracking-wider">
              {t('webEyebrow')}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t('webTitle')}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              {t('webBody')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-2">
              <span className="text-xs font-mono font-bold text-orange">01</span>
              <h3 className="text-base font-bold text-ink">{t('webTheme1')}</h3>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-2">
              <span className="text-xs font-mono font-bold text-orange">02</span>
              <h3 className="text-base font-bold text-ink">{t('webTheme2')}</h3>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-2">
              <span className="text-xs font-mono font-bold text-orange">03</span>
              <h3 className="text-base font-bold text-ink">{t('webTheme3')}</h3>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-2">
              <span className="text-xs font-mono font-bold text-orange">04</span>
              <h3 className="text-base font-bold text-ink">{t('webTheme4')}</h3>
            </div>
          </div>

          <div className="pt-2">
            <Button href={getLocalizedPath('contact', currentLocale) + '?type=services&interest=website'} variant="secondary">
              {t('primaryCta')}
            </Button>
          </div>
        </Container>
      </Section>

      {/* Idea / Approach Section */}
      <Section variant="dark" className="py-20 md:py-28 text-center">
        <Container className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
              {t('approachEyebrow')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t('ideaTitle')}
            </h2>
            <p className="text-base text-white/70 leading-relaxed max-w-xl mx-auto">
              {t('ideaBody')}
            </p>
          </div>

          <div className="pt-2">
            <Button href={getLocalizedPath('contact', currentLocale) + '?type=services'} variant="primary" className="bg-orange text-white hover:bg-orange/90">
              {t('ideaCta')}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
