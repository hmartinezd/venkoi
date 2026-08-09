import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { InsightCard } from '@/components/insights/InsightCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { locales, type Locale } from '@/i18n/config';
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
  const t = await getTranslations({ locale: currentLocale, namespace: 'insightsPage' });

  return createMetadata({
    title: t('seoTitle'),
    description: t('seoDescription'),
    routeKey: 'insights',
    locale: currentLocale
  });
}

export default async function InsightsPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);
  setRequestLocale(currentLocale);

  const t = await getTranslations('insightsPage');
  const tArticles = await getTranslations('insightsArticles');

  const articles = [
    {
      routeKey: 'insightRestaurantInventory' as const,
      data: tArticles('restaurantInventory') as any
    },
    {
      routeKey: 'insightStartSoftwareProject' as const,
      data: tArticles('startSoftwareProject') as any
    },
    {
      routeKey: 'insightWebsiteOrWebApp' as const,
      data: tArticles('websiteOrWebApp') as any
    }
  ];

  return (
    <>
      <Section variant="light" className="pt-10 pb-16 md:pt-14 md:pb-24">
        <Container className="max-w-4xl space-y-8">
          <Breadcrumbs
            locale={currentLocale}
            items={[
              { labelKey: 'home', routeKey: 'home' },
              { labelKey: 'insights', isCurrent: true }
            ]}
          />

          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
              {t('eyebrow')}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-tight">
              {t('heading')}
            </h1>
            <p className="text-lg text-foreground-muted leading-relaxed max-w-3xl">
              {t('body')}
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="surface" className="py-16 md:py-24 border-t border-border">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <InsightCard
                key={article.routeKey}
                locale={currentLocale}
                category={article.data.category}
                title={article.data.title}
                description={article.data.description}
                routeKey={article.routeKey}
                readMoreLabel={t('readMore')}
              />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
