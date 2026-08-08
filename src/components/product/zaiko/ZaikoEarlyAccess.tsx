import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';

interface ZaikoEarlyAccessProps {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
}

export function ZaikoEarlyAccess({
  locale,
  eyebrow,
  heading,
  body,
  primaryCta,
  secondaryCta
}: ZaikoEarlyAccessProps) {
  return (
    <Section variant="dark" className="py-20 md:py-28 scroll-mt-24" id="early-access">
      <Container className="max-w-4xl text-center space-y-8">
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

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            href={getLocalizedPath('demo', locale) + '?product=zaiko'}
            variant="primary"
            className="bg-orange text-ink hover:bg-orange/90 w-full sm:w-auto"
          >
            {primaryCta}
          </Button>
          <Button
            href={getLocalizedPath('demo', locale) + '?product=zaiko&interest=early-access'}
            variant="secondary"
            className="border-white/20 text-white bg-white/5 hover:bg-white/10 hover:border-white/40 w-full sm:w-auto"
          >
            {secondaryCta}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
