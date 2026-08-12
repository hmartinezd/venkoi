import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';
import { ZaikoProductVisual, type ZaikoVisualLabels } from '@/components/product/zaiko/ZaikoProductVisual';

export function ZaikoFeature({
  locale,
  eyebrow,
  heading,
  body,
  discoverCta,
  demoCta,
  earlyAccess,
  theme1Title,
  theme1Desc,
  theme2Title,
  theme2Desc,
  theme3Title,
  theme3Desc,
  theme4Title,
  theme4Desc,
  theme5Title,
  theme5Desc,
  productName,
  visualLabels,
  visibleOutcomeKeys
}: {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  discoverCta: string;
  demoCta: string;
  earlyAccess?: { badge: string; badgeText: string };
  theme1Title: string;
  theme1Desc: string;
  theme2Title: string;
  theme2Desc: string;
  theme3Title: string;
  theme3Desc: string;
  theme4Title: string;
  theme4Desc: string;
  theme5Title: string;
  theme5Desc: string;
  productName: string;
  visualLabels: ZaikoVisualLabels;
  visibleOutcomeKeys: readonly string[];
}) {
  const themes = [
    { key: 'invoice', title: theme1Title, desc: theme1Desc },
    { key: 'inventory', title: theme2Title, desc: theme2Desc },
    { key: 'costing', title: theme3Title, desc: theme3Desc },
    { key: 'counts', title: theme4Title, desc: theme4Desc },
    { key: 'owner', title: theme5Title, desc: theme5Desc }
  ].filter(({ key }) => visibleOutcomeKeys.includes(key));

  return (
    <Section variant="surface" spacing="spacious" className="border-y border-border">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Info Column */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
                {eyebrow}
              </span>
              {earlyAccess ? (
                <span className="inline-flex items-center rounded-md bg-orange-subtle px-2.5 py-0.5 text-[11px] font-bold text-orange-text uppercase tracking-wider">
                  {earlyAccess.badge}
                </span>
              ) : null}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight whitespace-pre-line">
              {heading}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              {body}
            </p>
          </div>

          {/* 4 Concise Product Themes Grid */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            {themes.map((t, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-background p-4 space-y-1">
                <p className="text-sm font-bold text-ink flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                  {t.title}
                </p>
                <p className="text-xs text-foreground-muted leading-snug">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Early Access Callout */}
          {earlyAccess ? (
            <div className="rounded-xl border border-orange/30 bg-orange-subtle/50 p-4 flex items-center justify-between gap-4">
              <p className="text-xs font-semibold text-ink">{earlyAccess.badgeText}</p>
              <span className="text-[11px] font-bold text-orange-text uppercase tracking-widest whitespace-nowrap">
                01 / {productName.toUpperCase()}
              </span>
            </div>
          ) : null}

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button href={getLocalizedPath('productsZaiko', locale)} variant="primary">
              {discoverCta}
            </Button>
            <TrackedButton
              href={buildProductDemoHref(locale, FEATURED_PRODUCT, { source: 'home_product' })}
              variant="secondary"
              eventName="zaiko_demo_cta"
              properties={{ locale, product: FEATURED_PRODUCT.analyticsProduct, source: 'home_product' }}
            >
              {demoCta}
            </TrackedButton>
          </div>
        </div>

        <div className="lg:col-span-6">
          <ZaikoProductVisual type="inventory" labels={visualLabels} />
        </div>
      </Container>
    </Section>
  );
}
