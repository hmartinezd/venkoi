import { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { type Locale } from '@/i18n/config';
import { type RouteKey } from '@/i18n/routing';
import { getSiteOrigin } from '@/lib/site-config';
import { getLocalizedPath } from '@/i18n/routing';

interface InsightArticleProps {
  locale: Locale;
  routeKey: RouteKey;
  title: string;
  description: string;
  category: string;
  breadcrumbLabelKey: string;
  children: ReactNode;
  ctaArea?: ReactNode;
  relatedGuides?: ReactNode;
}

export function InsightArticle({
  locale,
  routeKey,
  title,
  description,
  category,
  breadcrumbLabelKey,
  children,
  ctaArea,
  relatedGuides
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

      <Section variant="light" className="pt-10 pb-20 md:pt-14 md:pb-28">
        <Container className="max-w-4xl">
          <Breadcrumbs
            locale={locale}
            items={[
              { labelKey: 'home', routeKey: 'home' },
              { labelKey: 'insights', routeKey: 'insights' },
              { labelKey: breadcrumbLabelKey, isCurrent: true }
            ]}
          />

          <article className="space-y-12">
            <header className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
                {category}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight max-w-4xl">
                {title}
              </h1>
              <p className="text-lg text-foreground-muted leading-relaxed max-w-3xl">
                {description}
              </p>
            </header>

            <div className="max-w-3xl">
              {children}
            </div>

            {ctaArea && (
              <footer className="pt-12 border-t border-border">
                {ctaArea}
              </footer>
            )}

            {relatedGuides && (
              <div className="pt-16 border-t border-border">
                {relatedGuides}
              </div>
            )}
          </article>
        </Container>
      </Section>
    </>
  );
}

export function ArticleSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 mb-10 last:mb-0">
      <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="text-base text-foreground-muted leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}
