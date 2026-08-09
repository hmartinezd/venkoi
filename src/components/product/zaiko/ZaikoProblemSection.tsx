import React from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

interface ZaikoProblemSectionProps {
  eyebrow: string;
  heading: string;
  body: string;
}

export function ZaikoProblemSection({ eyebrow, heading, body }: ZaikoProblemSectionProps) {
  return (
    <Section variant="light" className="py-16 md:py-24 border-t border-border">
      <Container className="max-w-4xl text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-orange" />
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {eyebrow}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-orange" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight max-w-3xl mx-auto">
          {heading}
        </h2>

        <p className="text-base text-foreground-muted sm:text-lg leading-relaxed max-w-2xl mx-auto">
          {body}
        </p>
      </Container>
    </Section>
  );
}
