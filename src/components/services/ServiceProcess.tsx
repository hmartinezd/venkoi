import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export interface ServiceProcessStage { number: string; title: string; description: string }
interface ServiceProcessProps {
  eyebrow: string;
  heading: string;
  stages: ServiceProcessStage[];
  testingPrinciple: string;
}

export function ServiceProcess({ eyebrow, heading, stages, testingPrinciple }: ServiceProcessProps) {
  return (
    <Section className="bg-surface-muted/50 border-y border-border/50">
      <Container>
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold tracking-widest text-orange-text uppercase block mb-4">
            {eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-6">
            {heading}
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage) => (
            <div key={stage.number} className="relative group">
              <div className="text-5xl font-black text-border/30 mb-4 group-hover:text-orange/20 transition-colors">
                {stage.number}
              </div>
              <h3 className="text-lg font-bold text-ink mb-3">{stage.title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">
                {stage.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-border/60 pt-8"><p className="text-sm font-medium italic text-ink">&quot;{testingPrinciple}&quot;</p></div>
      </Container>
    </Section>
  );
}
