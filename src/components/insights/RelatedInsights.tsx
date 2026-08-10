import { InsightCard } from '@/components/insights/InsightCard';
import { type Locale } from '@/i18n/config';
import { type RouteKey } from '@/i18n/routing';

export interface RelatedInsight {
  routeKey: RouteKey;
  category: string;
  title: string;
  description: string;
}

interface RelatedInsightsProps {
  locale: Locale;
  heading: string;
  readMoreLabel: string;
  articles: RelatedInsight[];
}

export function RelatedInsights({
  locale,
  heading,
  readMoreLabel,
  articles
}: RelatedInsightsProps) {
  return (
    <section aria-labelledby="related-insights-heading" className="space-y-8">
      <h2 id="related-insights-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {heading}
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
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
    </section>
  );
}
