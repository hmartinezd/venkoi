import React from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ZaikoProductVisual } from './ZaikoProductVisual';

interface ZaikoFeatureSectionProps {
  id: 'inventory' | 'purchases' | 'activity' | 'costs';
  eyebrow: string;
  heading: string;
  body: string;
  supporting?: string[];
  reverse?: boolean;
}

export function ZaikoFeatureSection({
  id,
  eyebrow,
  heading,
  body,
  supporting = [],
  reverse = false
}: ZaikoFeatureSectionProps) {
  return (
    <Section variant="surface" className="py-16 md:py-24 border-t border-border scroll-mt-24" id={id}>
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Text Column */}
        <div className={`lg:col-span-6 space-y-6 ${reverse ? 'lg:order-2' : ''}`}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange" />
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
                {eyebrow}
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
              {heading}
            </h2>

            <p className="text-base text-foreground-muted sm:text-lg leading-relaxed max-w-xl">
              {body}
            </p>
          </div>

          {supporting.length > 0 && (
            <div className="pt-2 space-y-3">
              <ul className="grid gap-2 sm:grid-cols-1" role="list">
                {supporting.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm font-medium text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-orange/40" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Visual Column */}
        <div className={`lg:col-span-6 ${reverse ? 'lg:order-1' : ''}`}>
          <ZaikoProductVisual type={id} />
        </div>
      </Container>
    </Section>
  );
}
