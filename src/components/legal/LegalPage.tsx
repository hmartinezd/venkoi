import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export function LegalPage({
  eyebrow,
  title,
  introduction,
  effectiveDate,
  sections,
  contactEmail
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  effectiveDate: string;
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
          {sections.map((section) => (
            <section key={section.title} className="space-y-4">
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
