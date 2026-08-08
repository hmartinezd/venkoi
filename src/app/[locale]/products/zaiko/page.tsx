import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale as Locale;
  const messages = await import(`@/i18n/messages/${locale}.json`);
  return createMetadata({
    title: `${messages.products.zaikoTitle} | ${messages.seo.title}`,
    description: messages.products.zaikoIntro,
    routeKey: 'productsZaiko',
    locale
  });
}

export default function ZaikoPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('products');
  const locale = params.locale as Locale;

  return (
    <Section className="pt-20 pb-24">
      <Container className="max-w-4xl space-y-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange">{t('zaikoTitle')}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{t('zaikoTitle')}</h1>
          <p className="text-lg leading-8 text-foreground-muted">{t('zaikoIntro')}</p>
        </div>
        <div className="rounded-[28px] border border-border bg-surface p-10">
          <p className="text-base leading-8 text-foreground-muted">{t('placeholder')}</p>
          <div className="mt-8 inline-flex rounded-[14px] border border-border bg-background px-5 py-3 text-sm font-semibold text-ink">
            <Link href={getLocalizedPath('demo', locale)} locale={false} className="transition hover:text-orange">
              {t('placeholder')}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
