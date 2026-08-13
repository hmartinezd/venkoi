import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ZaikoProductVisual, type ZaikoVisualLabels } from './ZaikoProductVisual';

export type WorkflowChapter = {
  id: 'invoice-capture' | 'inventory' | 'food-cost' | 'counts-reorder' | 'owner-view';
  eyebrow: string;
  heading: string;
  body: string;
  points: string[];
  trust?: string;
  visual?: 'purchases' | 'inventory' | 'activity' | 'costs' | 'counts';
};

type Props = {
  workflow: { eyebrow: string; heading: string; body: string; steps: string[]; availability: string };
  chapters: WorkflowChapter[];
  dataSafety?: { eyebrow: string; heading: string; body: string; points: string[] };
  labels: ZaikoVisualLabels;
};

export function ZaikoWorkflowStory({ workflow, chapters, dataSafety, labels }: Props) {
  return (
    <>
      <Section variant="dark" spacing="standard" className="border-t border-white/10">
        <Container className="space-y-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">{workflow.eyebrow}</p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{workflow.heading}</h2>
            <p className="text-base leading-relaxed text-white/75 sm:text-lg">{workflow.body}</p>
            {workflow.availability ? <p className="text-sm font-semibold text-orange">{workflow.availability}</p> : null}
          </div>
          <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5" aria-label={workflow.heading}>
            {workflow.steps.map((step, index) => (
              <li key={step} className="relative rounded-xl border border-white/15 bg-white/5 p-3 text-sm font-semibold text-white">
                <span className="mb-2 block font-mono text-[10px] text-orange">{String(index + 1).padStart(2, '0')}</span>
                {step}
                {index < workflow.steps.length - 1 ? <span aria-hidden="true" className="absolute -bottom-2 left-1/2 text-orange sm:hidden">↓</span> : null}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {chapters.map((chapter, index) => (
        <Section key={chapter.id} id={chapter.id} variant={index % 2 === 0 ? 'light' : 'surface'} spacing="standard" className="scroll-mt-36 border-t border-border">
          <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <article className={`${chapter.visual ? 'lg:col-span-6' : 'lg:col-span-8'} space-y-5`}>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{chapter.eyebrow}</p>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">{chapter.heading}</h2>
              <p className="text-base leading-relaxed text-foreground-muted sm:text-lg">{chapter.body}</p>
              <ul className="grid gap-3 sm:grid-cols-2" role="list">
                {chapter.points.map((point) => <li key={point} className="flex items-start gap-2.5 text-sm font-medium leading-relaxed text-ink"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-orange" />{point}</li>)}
              </ul>
              {chapter.trust ? <p className="border-l-2 border-orange pl-4 text-base font-bold leading-relaxed text-ink">{chapter.trust}</p> : null}
            </article>
            {chapter.visual ? <div className="lg:col-span-6"><ZaikoProductVisual type={chapter.visual} labels={labels} /></div> : null}
          </Container>
        </Section>
      ))}

      {dataSafety ? <Section variant="muted" spacing="compact" className="border-y border-border">
        <Container className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="space-y-3 lg:col-span-5"><p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{dataSafety.eyebrow}</p><h2 className="text-2xl font-bold text-ink sm:text-3xl">{dataSafety.heading}</h2><p className="text-sm leading-relaxed text-foreground-muted">{dataSafety.body}</p></div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7" role="list">{dataSafety.points.map((point) => <li key={point} className="rounded-xl border border-border bg-surface p-4 text-sm font-semibold text-ink">{point}</li>)}</ul>
        </Container>
      </Section> : null}
    </>
  );
}
