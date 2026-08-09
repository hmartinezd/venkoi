import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';
import { ZaikoProductVisual } from './ZaikoProductVisual';

interface ZaikoHeroProps {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  microcopy: string;
  noCreditCard: string;
  labels?: {
    inventory: string;
    purchases: string;
    activity: string;
    costs: string;
    onHand: string;
    incoming: string;
    history: string;
    trend: string;
  };
}

export function ZaikoHero({
  locale,
  eyebrow,
  heading,
  body,
  primaryCta,
  secondaryCta,
  microcopy,
  noCreditCard,
  labels
}: ZaikoHeroProps) {
  return (
    <Section variant="light" className="pt-10 pb-16 md:pt-16 md:pb-24 scroll-mt-24" id="overview">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Copy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
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
              href={getLocalizedPath('demo', locale) + '?product=zaiko'}
              variant="primary"
              eventName="zaiko_demo_cta"
              properties={{
                locale,
                product: 'zaiko',
                source: 'zaiko_hero'
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
                source: 'zaiko_hero',
                earlyAccess: true
              }}
            >
              {secondaryCta}
            </TrackedButton>
          </div>

          {/* Microcopy Callouts */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-medium text-foreground-muted">
            <span className="flex items-center gap-1.5 text-ink font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              {microcopy}
            </span>
            <span className="hidden sm:inline-block text-border-strong">•</span>
            <span>{noCreditCard}</span>
          </div>
        </div>

        {/* Right Product Visual */}
        <div className="lg:col-span-6">
          <ZaikoProductVisual type="hero" labels={labels} />
        </div>
      </Container>
    </Section>
  );
}
