import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { InsightCard } from '@/components/insights/InsightCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { locales, type Locale } from '@/i18n/config';
import { createMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
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

  const t = await getTranslations('insightsPage');
  const tArticles = await getTranslations('insightsArticles');

  const articles = [
    {
      routeKey: 'insightRestaurantInventory' as const,
      category: tArticles('restaurantInventory.category'),
      title: tArticles('restaurantInventory.title'),
      description: tArticles('restaurantInventory.description')
    },
    {
      routeKey: 'insightStartSoftwareProject' as const,
      category: tArticles('startSoftwareProject.category'),
      title: tArticles('startSoftwareProject.title'),
      description: tArticles('startSoftwareProject.description')
    },
    {
      routeKey: 'insightWebsiteOrWebApp' as const,
      category: tArticles('websiteOrWebApp.category'),
      title: tArticles('websiteOrWebApp.title'),
      description: tArticles('websiteOrWebApp.description')
    }
  ];

  return (
    <>
      <Section variant="light" spacing="hero">
        <Container className="max-w-4xl space-y-8">
          <Breadcrumbs
            locale={currentLocale}
            items={[
              { labelKey: 'home', routeKey: 'home' },
              { labelKey: 'insights', isCurrent: true }
            ]}
          />

          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
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

      <Section variant="surface" spacing="compact" className="border-t border-border">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12">
            {articles[0] ? (
              <InsightCard
                locale={currentLocale}
                category={articles[0].category}
                title={articles[0].title}
                description={articles[0].description}
                routeKey={articles[0].routeKey}
                readMoreLabel={t('readMore')}
                featured
                headingLevel="h2"
              />
            ) : null}
            <div className="grid gap-6 lg:col-span-5">
              {articles.slice(1).map((article) => (
                <InsightCard
                  key={article.routeKey}
                  locale={currentLocale}
                  category={article.category}
                  title={article.title}
                  description={article.description}
                  routeKey={article.routeKey}
                  readMoreLabel={t('readMore')}
                  headingLevel="h2"
                />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
