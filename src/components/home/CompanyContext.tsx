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
  p2: string;
  p3: string;
  cta: string;
  localEyebrow: string;
  localHeading: string;
  localBody: string;
  tampaTitle: string;
  tampaDesc: string;
  southFloridaTitle: string;
  southFloridaDesc: string;
  beyondTitle: string;
  beyondDesc: string;
  prominentStatement: string;
};

export function CompanyContext({
  locale,
  eyebrow,
  heading,
  p1,
  p2,
  p3,
  cta,
  localEyebrow,
  localHeading,
  localBody,
  tampaTitle,
  tampaDesc,
  southFloridaTitle,
  southFloridaDesc,
  beyondTitle,
  beyondDesc,
  prominentStatement
}: CompanyContextProps) {
  const regions = [
    { title: tampaTitle, description: tampaDesc },
    { title: southFloridaTitle, description: southFloridaDesc },
    { title: beyondTitle, description: beyondDesc }
  ];

  return (
    <Section variant="light">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-7 lg:col-span-7">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>

          <div className="max-w-2xl space-y-4 text-base leading-relaxed text-foreground-muted">
            <p>{p1}</p>
            <p>{p2}</p>
            <p>{p3}</p>
          </div>

          <Button href={getLocalizedPath('about', locale)} variant="secondary">
            {cta}
          </Button>
        </div>

        <div className="space-y-6 border-t border-border pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {localEyebrow}
            </p>
            <h3 className="text-xl font-bold leading-tight text-ink sm:text-2xl">
              {localHeading}
            </h3>
            <p className="text-sm leading-relaxed text-foreground-muted">
              {localBody}
            </p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {regions.map((region, index) => (
              <div key={region.title} className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink">
                  <span className="mr-2 font-mono text-orange-text">0{index + 1}</span>
                  {region.title}
                </p>
                <p className="text-xs leading-relaxed text-foreground-muted">
                  {region.description}
                </p>
              </div>
            ))}
          </div>

          <p className="border-l-2 border-orange pl-4 text-lg font-bold leading-snug text-ink sm:text-xl">
            {prominentStatement}
          </p>
        </div>
      </Container>
    </Section>
  );
}
