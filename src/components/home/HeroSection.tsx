import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';
import { ZaikoProductVisual, type ZaikoVisualLabels } from '@/components/product/zaiko/ZaikoProductVisual';

export function HeroSection({
  locale,
  eyebrow,
  heading,
  body,
  primaryCta,
  secondaryCta,
  visualLabels
}: {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  visualLabels: ZaikoVisualLabels;
}) {
  return (
    <Section variant="light" spacing="hero">
      <Container className="grid gap-12 lg:grid-cols-[55%_45%] lg:items-center">
        <div className="max-w-2xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-[1.1]">
            {heading}
          </h1>
          <p className="text-base leading-relaxed text-foreground-muted sm:text-lg">
            {body}
          </p>

          <div className="pt-4 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <Button href={getLocalizedPath('productsZaiko', locale)} variant="primary">
              {primaryCta}
            </Button>
            <TrackedButton
              href={buildProductDemoHref(locale, FEATURED_PRODUCT, { source: 'home_hero' })}
              variant="secondary"
              eventName="zaiko_demo_cta"
              properties={{ locale, product: FEATURED_PRODUCT.analyticsProduct, source: 'home_hero' }}
            >
              {secondaryCta}
            </TrackedButton>
          </div>

        </div>

        <div className="relative isolate w-full">
          <ZaikoProductVisual type="hero" labels={visualLabels} />
        </div>
      </Container>
    </Section>
  );
}
