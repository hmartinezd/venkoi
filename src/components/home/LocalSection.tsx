import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export function LocalSection({
  eyebrow,
  heading,
  body,
  tampaTitle,
  tampaDesc,
  southFloridaTitle,
  southFloridaDesc,
  beyondTitle,
  beyondDesc,
  prominentStatement
}: {
  eyebrow: string;
  heading: string;
  body: string;
  tampaTitle: string;
  tampaDesc: string;
  southFloridaTitle: string;
  southFloridaDesc: string;
  beyondTitle: string;
  beyondDesc: string;
  prominentStatement: string;
}) {
  const regions = [
    { title: tampaTitle, desc: tampaDesc },
    { title: southFloridaTitle, desc: southFloridaDesc },
    { title: beyondTitle, desc: beyondDesc }
  ];

  return (
    <Section variant="light">
      <Container className="space-y-10">
        {/* Intro */}
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {heading}
          </h2>
          <p className="text-base text-foreground-muted leading-relaxed">
            {body}
          </p>
        </div>

        {/* Geographic Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {regions.map((reg, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-6 space-y-2">
              <span className="text-xs font-bold text-orange-text tracking-widest uppercase">
                0{i + 1}
              </span>
              <h3 className="text-lg font-bold text-ink">{reg.title}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">{reg.desc}</p>
            </div>
          ))}
        </div>

        {/* Large Prominent Statement Banner */}
        <div className="rounded-2xl border border-border bg-surface-muted p-6 text-center sm:p-8 lg:p-10">
          <p className="text-2xl font-bold text-ink sm:text-3xl lg:text-4xl max-w-3xl mx-auto leading-tight">
            &ldquo;{prominentStatement}&rdquo;
          </p>
        </div>
      </Container>
    </Section>
  );
}
