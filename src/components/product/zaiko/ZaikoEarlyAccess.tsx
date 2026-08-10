import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import type { Locale } from '@/i18n/config';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';

interface ZaikoEarlyAccessProps {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  details?: string[];
  primaryCta: string;
  secondaryCta: string;
}

export function ZaikoEarlyAccess({
  locale,
  eyebrow,
  heading,
  body,
  details = [],
  primaryCta,
  secondaryCta
}: ZaikoEarlyAccessProps) {
  return (
    <Section variant="dark" className="py-20 md:py-28 scroll-mt-24" id="early-access">
      <Container className="max-w-4xl text-center space-y-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            {eyebrow}
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
            {heading}
          </h2>

          <p className="text-base text-white/80 sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {body}
          </p>
        </div>

        {details.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto text-left">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
                <span className="mt-1 flex-none h-2 w-2 rounded-full bg-orange" />
                <span className="text-sm font-medium text-white/90 leading-snug">
                  {detail}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <TrackedButton
            href={buildProductDemoHref(locale, FEATURED_PRODUCT)}
            variant="primary"
            className="bg-orange text-ink hover:bg-orange/90 w-full sm:w-auto"
            eventName="zaiko_demo_cta"
            properties={{
              locale,
              product: FEATURED_PRODUCT.analyticsProduct,
              source: 'zaiko_early_access'
            }}
          >
            {primaryCta}
          </TrackedButton>
          <TrackedButton
            href={buildProductDemoHref(locale, FEATURED_PRODUCT, { interest: 'early-access' })}
            variant="secondary"
            className="border-white/20 text-white bg-white/5 hover:bg-white/10 hover:border-white/40 w-full sm:w-auto"
            eventName="zaiko_early_access_cta"
            properties={{
              locale,
              product: FEATURED_PRODUCT.analyticsProduct,
              source: 'zaiko_early_access',
              earlyAccess: true
            }}
          >
            {secondaryCta}
          </TrackedButton>
        </div>
      </Container>
    </Section>
  );
}
