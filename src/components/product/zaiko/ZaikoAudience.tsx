import React from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

interface ZaikoAudienceProps {
  heading: string;
  body: string;
  items: string[];
}

export function ZaikoAudience({ heading, body, items }: ZaikoAudienceProps) {
  return (
    <Section variant="surface" spacing="compact" className="border-t border-border">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
            {heading}
          </h2>
          <p className="text-base text-foreground-muted sm:text-lg leading-relaxed max-w-2xl">
            {body}
          </p>
        </div>

        <div className="lg:col-span-5">
          <ul className="space-y-4" role="list">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-background shadow-sm">
                <span className="flex-none h-6 w-6 rounded-full bg-orange/10 flex items-center justify-center text-orange-text text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-base font-medium text-ink leading-snug">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
