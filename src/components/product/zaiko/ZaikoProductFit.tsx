import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ZaikoProductVisual, type ZaikoVisualLabels } from './ZaikoProductVisual';

interface ZaikoProductFitProps {
  workflow: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  audience: {
    heading: string;
    body: string;
    items: string[];
  };
  labels: ZaikoVisualLabels;
}

export function ZaikoProductFit({ workflow, audience, labels }: ZaikoProductFitProps) {
  return (
    <Section variant="light" spacing="standard" className="border-t border-border">
      <Container className="grid gap-12 xl:grid-cols-12 xl:items-start xl:gap-16">
        <div className="space-y-8 xl:col-span-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
              {workflow.eyebrow}
            </p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {workflow.heading}
            </h2>
            <p className="text-base leading-relaxed text-foreground-muted sm:text-lg">{workflow.body}</p>
          </div>
          <ZaikoProductVisual type="workflow" labels={labels} />
        </div>

        <aside className="space-y-6 border-t border-border pt-8 xl:col-span-4 xl:border-l xl:border-t-0 xl:pl-10 xl:pt-1">
          <h3 className="text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            {audience.heading}
          </h3>
          <p className="text-base leading-relaxed text-foreground-muted">{audience.body}</p>
          <ul className="space-y-4" role="list">
            {audience.items.map((item, index) => (
              <li key={item} className="flex items-start gap-3 border-t border-border pt-4">
                <span className="text-xs font-bold tabular-nums text-orange-text">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-semibold leading-snug text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </Container>
    </Section>
  );
}
