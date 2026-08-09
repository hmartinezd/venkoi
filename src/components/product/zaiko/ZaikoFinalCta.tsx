import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';

interface ZaikoFinalCtaProps {
  locale: Locale;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
}

export function ZaikoFinalCta({
  locale,
  heading,
  body,
  primaryCta,
  secondaryCta
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
            href={getLocalizedPath('demo', locale) + '?product=zaiko'}
            variant="primary"
            eventName="zaiko_demo_cta"
            properties={{
              locale,
              product: 'zaiko',
              source: 'zaiko_final_cta'
            }}
          >
            {primaryCta}
          </TrackedButton>
          <TrackedButton
            href={getLocalizedPath('demo', locale) + '?product=zaiko&interest=early-access'}
            variant="secondary"
            eventName="zaiko_early_access_cta"
            properties={{
              locale,
              product: 'zaiko',
              source: 'zaiko_final_cta',
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
