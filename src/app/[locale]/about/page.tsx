import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import type { Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as Locale;
  const messages = await import(`@/i18n/messages/${locale}.json`);
  return createMetadata({
    title: `${messages.about.title} | ${messages.seo.title}`,
    description: messages.about.intro,
    routeKey: 'about',
    locale
  });
}

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <Section className="pt-20 pb-24">
      <Container className="max-w-4xl space-y-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange">{t('title')}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{t('title')}</h1>
          <p className="text-lg leading-8 text-foreground-muted">{t('intro')}</p>
        </div>
        <div className="rounded-[28px] border border-border bg-surface p-10">
          <p className="text-base leading-8 text-foreground-muted">{t('placeholder')}</p>
        </div>
      </Container>
    </Section>
  );
}
