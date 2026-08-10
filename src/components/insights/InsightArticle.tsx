import { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { type Locale } from '@/i18n/config';
import { type RouteKey } from '@/i18n/routing';
import { getSiteOrigin } from '@/lib/site-config';
import { getLocalizedPath } from '@/i18n/routing';
import { LocalizedLink } from '@/i18n/navigation';

export interface InsightArticleSection {
  id: string;
  label: string;
}

interface InsightArticleProps {
  locale: Locale;
  routeKey: RouteKey;
  title: string;
  description: string;
  category: string;
  breadcrumbLabelKey: string;
  children: ReactNode;
  sections: InsightArticleSection[];
  guideNavigationLabel: string;
  backToInsightsLabel: string;
  ctaArea?: ReactNode;
  relatedInsights?: ReactNode;
}

export function InsightArticle({
  locale,
  routeKey,
  title,
  description,
  category,
  breadcrumbLabelKey,
  children,
  sections,
  guideNavigationLabel,
  backToInsightsLabel,
  ctaArea,
  relatedInsights
}: InsightArticleProps) {
  const origin = getSiteOrigin();
  const canonical = `${origin}${getLocalizedPath(routeKey, locale)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    inLanguage: locale,
    author: {
      '@type': 'Organization',
      name: 'Venkoi',
      url: origin
    },
    publisher: {
      '@type': 'Organization',
      name: 'Venkoi',
      url: origin,
      logo: {
        '@type': 'ImageObject',
        url: `${origin}/brand/venkoi-logo-dark.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section variant="light" spacing="hero">
        <Container>
          <Breadcrumbs
            locale={locale}
            items={[
              { labelKey: 'home', routeKey: 'home' },
              { labelKey: 'insights', routeKey: 'insights' },
              { labelKey: breadcrumbLabelKey, isCurrent: true }
            ]}
          />

          <article className="space-y-12 lg:space-y-16">
            <header className="max-w-4xl space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
                {category}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight max-w-4xl">
                {title}
              </h1>
              <p className="text-lg text-foreground-muted leading-relaxed max-w-3xl">
                {description}
              </p>
            </header>

            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
              <nav
                aria-label={guideNavigationLabel}
                className="rounded-2xl border border-border bg-surface p-5 lg:col-span-3 lg:self-start lg:sticky lg:top-24"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink">
                  {guideNavigationLabel}
                </p>
                <ol className="mt-4 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-md px-2 py-2 text-sm leading-snug text-foreground-muted outline-none transition hover:text-orange-text focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                      >
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="max-w-3xl lg:col-span-8 lg:col-start-5">
                {children}
              </div>
            </div>

            {ctaArea && (
              <footer className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                {ctaArea}
              </footer>
            )}

            {relatedInsights && (
              <div className="pt-16 border-t border-border">
                {relatedInsights}
              </div>
            )}

            <LocalizedLink
              href="/insights"
              locale={locale}
              className="inline-flex rounded-sm text-sm font-bold text-ink outline-none transition hover:text-orange-text focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4"
            >
              <span aria-hidden="true" className="mr-2">←</span>
              {backToInsightsLabel}
            </LocalizedLink>
          </article>
        </Container>
      </Section>
    </>
  );
}

export function ArticleSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4 mb-10 last:mb-0">
      <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="text-base text-foreground-muted leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}
