import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import type { Locale } from '@/i18n/config';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';
import { ZaikoProductVisual, type ZaikoVisualLabels } from './ZaikoProductVisual';

interface ZaikoHeroProps {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: string;
  earlyAccess?: { cta: string; microcopy: string; noCreditCard: string };
  labels: ZaikoVisualLabels;
}

export function ZaikoHero({
  locale,
  eyebrow,
  heading,
  body,
  primaryCta,
  earlyAccess,
  labels
}: ZaikoHeroProps) {
  return (
    <Section variant="light" spacing="hero" className="scroll-mt-44 lg:scroll-mt-36" id="overview">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Copy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {eyebrow}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-[1.1] whitespace-pre-line">
            {heading}
          </h1>

          <p className="text-base text-foreground-muted sm:text-lg leading-relaxed max-w-xl">
            {body}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3.5">
            <TrackedButton
              href={buildProductDemoHref(locale, FEATURED_PRODUCT, { source: 'product_hero' })}
              variant="primary"
              eventName="zaiko_demo_cta"
              properties={{
                locale,
                product: FEATURED_PRODUCT.analyticsProduct,
                source: 'product_hero'
              }}
            >
              {primaryCta}
            </TrackedButton>
            {earlyAccess ? (
              <TrackedButton
                href={buildProductDemoHref(locale, FEATURED_PRODUCT, { interest: 'early-access', source: 'product_hero' })}
                variant="secondary"
                eventName="zaiko_early_access_cta"
                properties={{ locale, product: FEATURED_PRODUCT.analyticsProduct, source: 'product_hero', earlyAccess: true }}
              >
                {earlyAccess.cta}
              </TrackedButton>
            ) : null}
          </div>

          {/* Microcopy Callouts */}
          {earlyAccess ? <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-medium text-foreground-muted">
            <span className="flex items-center gap-1.5 text-ink font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              {earlyAccess.microcopy}
            </span>
            <span className="hidden sm:inline-block text-border-strong">•</span>
            <span>{earlyAccess.noCreditCard}</span>
          </div> : null}
        </div>

        {/* Right Product Visual */}
        <div className="lg:col-span-6">
          <ZaikoProductVisual type="hero" labels={labels} />
        </div>
      </Container>
    </Section>
  );
}
