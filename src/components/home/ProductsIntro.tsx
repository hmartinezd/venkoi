import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export function ProductsIntro({
  eyebrow,
  heading,
  body
}: {
  eyebrow: string;
  heading: string;
  body: string;
}) {
  return (
    <Section variant="light" className="py-10 md:py-14 border-t border-border/60">
      <Container>
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {heading}
          </h2>
          <p className="text-base text-foreground-muted leading-relaxed">
            {body}
          </p>
        </div>
      </Container>
    </Section>
  );
}
