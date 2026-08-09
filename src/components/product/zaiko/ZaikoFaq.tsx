import React from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

interface FaqItem {
  q: string;
  a: string;
}

interface ZaikoFaqProps {
  heading: string;
  items: FaqItem[];
}

export function ZaikoFaq({ heading, items }: ZaikoFaqProps) {
  return (
    <Section variant="light" className="py-16 md:py-24 border-t border-border" id="faq">
      <Container className="max-w-3xl space-y-12">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl text-center">
          {heading}
        </h2>

        <div className="space-y-4">
          {items.map((item, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-border bg-surface transition-all duration-200 open:bg-surface-muted open:shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5 text-base font-semibold text-ink list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 rounded-2xl">
                <span>{item.q}</span>
                <span className="ml-4 flex-none text-foreground-muted transition-transform group-open:rotate-180">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-base text-foreground-muted leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
