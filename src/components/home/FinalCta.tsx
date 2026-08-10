import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';

export function FinalCta({
  locale,
  heading,
  body,
  demoCta,
  talkCta,
  locationLine
}: {
  locale: Locale;
  heading: string;
  body: string;
  demoCta: string;
  talkCta: string;
  locationLine: string;
}) {
  return (
    <Section variant="dark" spacing="spacious" className="text-center">
      <Container className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="text-base text-white/70 leading-relaxed max-w-xl mx-auto">
            {body}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button href={buildProductDemoHref(locale, FEATURED_PRODUCT)} variant="brand">
            {demoCta}
          </Button>
          <Button href={getLocalizedPath('contact', locale)} variant="inverse">
            {talkCta}
          </Button>
        </div>

        <p className="text-xs text-white/50 pt-6 tracking-wider uppercase font-medium">
          {locationLine}
        </p>
      </Container>
    </Section>
  );
}
