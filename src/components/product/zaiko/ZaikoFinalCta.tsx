import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import type { Locale } from '@/i18n/config';
import { DirectContactChannels } from '@/components/contact/DirectContactChannels';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';

interface ZaikoFinalCtaProps {
  locale: Locale;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  directHeading: string;
  directBody: string;
  whatsappLabel: string;
  whatsappAriaLabel: string;
  whatsappMessage: string;
}

export function ZaikoFinalCta({
  locale,
  heading,
  body,
  primaryCta,
  secondaryCta,
  directHeading,
  directBody,
  whatsappLabel,
  whatsappAriaLabel,
  whatsappMessage
}: ZaikoFinalCtaProps) {
  return (
    <Section variant="light" className="py-16 md:py-24 border-t border-border">
      <Container className="max-w-4xl text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {heading}
        </h2>
        <p className="text-base text-foreground-muted sm:text-lg max-w-xl mx-auto leading-relaxed">
          {body}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <TrackedButton
            href={buildProductDemoHref(locale, FEATURED_PRODUCT)}
            variant="primary"
            eventName="zaiko_demo_cta"
            properties={{
              locale,
              product: FEATURED_PRODUCT.analyticsProduct,
              source: 'zaiko_final_cta'
            }}
          >
            {primaryCta}
          </TrackedButton>
          <TrackedButton
            href={buildProductDemoHref(locale, FEATURED_PRODUCT, { interest: 'early-access' })}
            variant="secondary"
            eventName="zaiko_early_access_cta"
            properties={{
              locale,
              product: FEATURED_PRODUCT.analyticsProduct,
              source: 'zaiko_final_cta',
              earlyAccess: true
            }}
          >
            {secondaryCta}
          </TrackedButton>
        </div>

        <div className="mx-auto mt-8 max-w-xl border-t border-border pt-6">
          <p className="font-bold text-ink">{directHeading}</p>
          <p className="mt-1 text-sm text-foreground-muted">{directBody}</p>
          <DirectContactChannels
            whatsappMessage={whatsappMessage}
            whatsappLabel={whatsappLabel}
            whatsappAriaLabel={whatsappAriaLabel}
            showEmail={false}
            variant="compact"
            className="mt-3 justify-center"
          />
        </div>
      </Container>
    </Section>
  );
}
