import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

interface FaqItem {
  question: string;
  answer: string;
}

interface ServiceFaqProps {
  heading: string;
  items: FaqItem[];
}

export function ServiceFaq({ heading, items }: ServiceFaqProps) {
  return (
    <Section variant="surface" className="py-16 md:py-24 border-t border-border">
      <Container className="max-w-4xl space-y-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-ink">
          {heading}
        </h2>

        <div className="space-y-4">
          {items.map((item, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-border bg-background overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between p-6 text-base font-bold text-ink hover:text-orange transition-colors list-none outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset">
                <span className="pr-4">{item.question}</span>
                <svg
                  className="h-5 w-5 shrink-0 text-foreground-muted transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-sm leading-relaxed text-foreground-muted">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
