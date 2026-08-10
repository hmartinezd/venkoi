import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';

export function AboutPreview({
  locale,
  eyebrow,
  heading,
  p1,
  p2,
  p3,
  cta
}: {
  locale: Locale;
  eyebrow: string;
  heading: string;
  p1: string;
  p2: string;
  p3: string;
  cta: string;
}) {
  return (
    <Section variant="light">
      <Container className="max-w-4xl space-y-6 md:space-y-8">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 space-y-5 text-base text-foreground-muted leading-relaxed">
          <p>{p1}</p>
          <p>{p2}</p>
          <p>{p3}</p>

          <div className="pt-4 border-t border-border">
            <Button href={getLocalizedPath('about', locale)} variant="secondary">
              {cta}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
