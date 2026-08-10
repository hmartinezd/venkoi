import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { InsightCard } from '@/components/insights/InsightCard';
import { type Locale } from '@/i18n/config';
import { LocalizedLink } from '@/i18n/navigation';

interface InsightsPreviewProps {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  readMoreLabel: string;
  articles: Array<{
    routeKey: 'insightRestaurantInventory' | 'insightStartSoftwareProject' | 'insightWebsiteOrWebApp';
    category: string;
    title: string;
    description: string;
  }>;
}

export function InsightsPreview({
  locale,
  eyebrow,
  heading,
  body,
  cta,
  readMoreLabel,
  articles
}: InsightsPreviewProps) {
  const [featuredArticle, ...secondaryArticles] = articles;

  return (
    <Section variant="surface" className="border-t border-border">
      <Container className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {heading}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed max-w-2xl">
              {body}
            </p>
          </div>
          <div className="shrink-0">
            <LocalizedLink
              href="/insights"
              locale={locale}
              className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-ink transition hover:text-orange-text outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm"
            >
              {cta}
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </LocalizedLink>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {featuredArticle ? (
            <InsightCard
              locale={locale}
              category={featuredArticle.category}
              title={featuredArticle.title}
              description={featuredArticle.description}
              routeKey={featuredArticle.routeKey}
              readMoreLabel={readMoreLabel}
              featured
            />
          ) : null}

          <div className="grid gap-6 lg:col-span-5">
            {secondaryArticles.map((article) => (
              <InsightCard
                key={article.routeKey}
                locale={locale}
                category={article.category}
                title={article.title}
                description={article.description}
                routeKey={article.routeKey}
                readMoreLabel={readMoreLabel}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
