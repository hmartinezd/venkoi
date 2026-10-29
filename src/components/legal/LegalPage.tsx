import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

function sectionId(title: string, index: number): string {
  const slug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `legal-section-${slug || index}`;
}

export function LegalPage({
  eyebrow,
  title,
  introduction,
  effectiveDate,
  contentsLabel,
  sections,
  contactEmail
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  effectiveDate: string;
  contentsLabel: string;
  sections: LegalSection[];
  contactEmail: string;
}) {
  function renderText(text: string) {
    const parts = text.split(contactEmail);
    return parts.map((part, index) => (
      <span key={`${part}-${index}`}>
        {index > 0 ? <a className="font-medium text-orange-text underline underline-offset-4" href={`mailto:${contactEmail}`}>{contactEmail}</a> : null}
        {part}
      </span>
    ));
  }

  return (
    <>
      <Section variant="light" spacing="hero">
        <Container className="max-w-4xl space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{eyebrow}</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">{title}</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-foreground-muted">{introduction}</p>
          <p className="text-sm font-medium text-foreground-muted">{effectiveDate}</p>
        </Container>
      </Section>
      <Section variant="surface" className="border-t border-border">
        <Container className="max-w-4xl space-y-10">
        <nav aria-labelledby="legal-contents-title" className="rounded-2xl border border-border bg-background p-5 sm:p-6">
          <h2 id="legal-contents-title" className="text-xs font-bold uppercase tracking-[0.2em] text-ink">{contentsLabel}</h2>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {sections.map((section, index) => {
              const id = sectionId(section.title, index);
              return (
                <li key={id}>
                  <a href={`#${id}`} className="block rounded-md px-2 py-2 text-sm leading-snug text-foreground-muted outline-none transition hover:text-orange-text focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2">
                    {section.title}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
          {sections.map((section, index) => (
            <section key={section.title} id={sectionId(section.title, index)} className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-base leading-7 text-foreground-muted">{renderText(paragraph)}</p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-foreground-muted">
                  {section.bullets.map((bullet) => <li key={bullet}>{renderText(bullet)}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
        </Container>
      </Section>
    </>
  );
}
