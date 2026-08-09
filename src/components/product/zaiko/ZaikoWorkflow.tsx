import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ZaikoProductVisual } from './ZaikoProductVisual';

interface ZaikoWorkflowProps {
  eyebrow: string;
  heading: string;
  body: string;
  labels: {
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

export function ZaikoWorkflow({ eyebrow, heading, body, labels }: ZaikoWorkflowProps) {
  return (
    <Section variant="light" className="py-16 md:py-24 border-t border-border">
      <Container className="space-y-12 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
            {heading}
          </h2>
          <p className="text-base text-foreground-muted sm:text-lg leading-relaxed">
            {body}
          </p>
        </div>

        <ZaikoProductVisual type="workflow" labels={labels} />
      </Container>
    </Section>
  );
}
