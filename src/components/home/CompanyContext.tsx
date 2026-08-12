import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';

type CompanyContextProps = {
  locale: Locale;
  eyebrow: string;
  heading: string;
  p1: string;
  location: string;
  cta: string;
};

export function CompanyContext({
  locale,
  eyebrow,
  heading,
  p1,
  location,
  cta,
}: CompanyContextProps) {
  return (
    <Section variant="light">
      <Container className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="space-y-6 lg:col-span-8">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>

          <div className="max-w-2xl text-base leading-relaxed text-foreground-muted">
            <p>{p1}</p>
          </div>
        </div>

        <div className="space-y-6 border-t border-border pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="border-l-2 border-orange pl-4 text-lg font-bold leading-snug text-ink sm:text-xl">
            {location}
          </p>
          <Button href={getLocalizedPath('about', locale)} variant="secondary">
            {cta}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
