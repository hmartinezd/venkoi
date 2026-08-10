import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

type CapabilityId = 'inventory' | 'purchases' | 'activity' | 'costs';

interface Capability {
  id: CapabilityId;
  eyebrow: string;
  heading: string;
  body: string;
  supporting: string[];
}

interface ZaikoCapabilitiesProps {
  eyebrow: string;
  heading: string;
  body: string;
  capabilities: Capability[];
}

export function ZaikoCapabilities({ eyebrow, heading, body, capabilities }: ZaikoCapabilitiesProps) {
  return (
    <Section variant="surface" spacing="standard" className="border-t border-border">
      <Container className="space-y-12 lg:space-y-16">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{eyebrow}</p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="text-base leading-relaxed text-foreground-muted sm:text-lg">{body}</p>
        </div>

        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-2 lg:gap-y-16">
          {capabilities.map((capability, index) => (
            <article
              key={capability.id}
              id={capability.id}
              className="scroll-mt-36 space-y-5 border-t border-border-strong pt-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tabular-nums text-foreground-muted/70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
                  {capability.eyebrow}
                </span>
              </div>
              <h3 className="text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
                {capability.heading}
              </h3>
              <p className="text-base leading-relaxed text-foreground-muted">{capability.body}</p>
              <ul className="space-y-3 pt-1" role="list">
                {capability.supporting.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm font-medium leading-relaxed text-ink">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-orange/50" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
