import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export function PhilosophySection({
  eyebrow = 'PRODUCT PHILOSOPHY',
  heading,
  item1Num,
  item1Title,
  item1Desc,
  item2Num,
  item2Title,
  item2Desc,
  item3Num,
  item3Title,
  item3Desc
}: {
  eyebrow?: string;
  heading: string;
  item1Num: string;
  item1Title: string;
  item1Desc: string;
  item2Num: string;
  item2Title: string;
  item2Desc: string;
  item3Num: string;
  item3Title: string;
  item3Desc: string;
}) {
  const items = [
    { num: item1Num, title: item1Title, desc: item1Desc },
    { num: item2Num, title: item2Title, desc: item2Desc },
    { num: item3Num, title: item3Title, desc: item3Desc }
  ];

  return (
    <Section variant="muted" className="py-16 md:py-24 border-y border-border">
      <Container className="space-y-12">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {heading}
          </h2>
        </div>

        {/* 3 Numbered Items Layout with Dividers */}
        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {items.map((it, idx) => (
            <div key={idx} className="space-y-4 border-t border-border pt-6">
              <span className="text-xs font-mono font-bold text-orange tracking-widest block">
                {it.num}
              </span>
              <h3 className="text-xl font-bold text-ink">{it.title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

