import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

interface ServiceScopeProps {
  heading: string;
  items: string[];
  supporting: { heading: string; body?: string; items?: string[] };
}

export function ServiceScope({ heading, items, supporting }: ServiceScopeProps) {
  return (
    <Section variant="surface" className="border-y border-border">
      <Container className="space-y-10">
        <h2 className="max-w-3xl text-2xl font-bold text-ink sm:text-3xl">{heading}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-4 rounded-2xl border border-border bg-background p-6">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange" />
              <p className="text-sm font-semibold leading-relaxed text-ink">{item}</p>
            </div>
          ))}
        </div>
        <aside className="grid gap-5 rounded-2xl border border-border bg-surface-muted p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="max-w-2xl space-y-3">
            <h3 className="text-xl font-bold text-ink">{supporting.heading}</h3>
            {supporting.body && <p className="text-sm leading-relaxed text-foreground-muted">{supporting.body}</p>}
          </div>
          {supporting.items && (
            <ul className="flex flex-wrap gap-3" aria-label={supporting.heading}>
              {supporting.items.map((item) => <li key={item} className="rounded-full border border-border-strong bg-background px-5 py-2 text-sm font-bold text-ink">{item}</li>)}
            </ul>
          )}
        </aside>
      </Container>
    </Section>
  );
}
