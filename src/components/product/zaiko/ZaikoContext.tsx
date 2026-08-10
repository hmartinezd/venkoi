import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

interface ZaikoContextProps {
  intro: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  problem: {
    eyebrow: string;
    heading: string;
    body: string;
  };
}

export function ZaikoContext({ intro, problem }: ZaikoContextProps) {
  return (
    <Section variant="surface" spacing="standard" className="border-t border-border">
      <Container className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="space-y-4 lg:col-span-7">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
            {intro.eyebrow}
          </p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {intro.heading}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
            {intro.body}
          </p>
        </div>

        <aside className="space-y-4 border-t border-border pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-1">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
            {problem.eyebrow}
          </p>
          <h3 className="text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            {problem.heading}
          </h3>
          <p className="text-base leading-relaxed text-foreground-muted">
            {problem.body}
          </p>
        </aside>
      </Container>
    </Section>
  );
}
