'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ZaikoProductVisual } from './ZaikoProductVisual';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import { type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';

type ZaikoExplorerArea = 'inventory' | 'purchases' | 'activity' | 'costs';

interface AreaContent {
  label: string;
  eyebrow: string;
  heading: string;
  body: string;
  supporting: string[];
}

interface ZaikoExplorerProps {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  detailLinkLabel: string;
  demoCtaLabel: string;
  areas: Record<ZaikoExplorerArea, AreaContent>;
  visualLabels: {
    inventory: string;
    purchases: string;
    activity: string;
    costs: string;
    onHand: string;
    incoming: string;
    history: string;
    trend: string;
  };
}

export function ZaikoExplorer({
  locale,
  eyebrow,
  heading,
  body,
  detailLinkLabel,
  demoCtaLabel,
  areas,
  visualLabels
}: ZaikoExplorerProps) {
  const [activeArea, setActiveArea] = useState<ZaikoExplorerArea>('inventory');

  const areaKeys: ZaikoExplorerArea[] = ['inventory', 'purchases', 'activity', 'costs'];
  const activeContent = areas[activeArea];

  return (
    <Section className="py-16 md:py-24 border-t border-border bg-background">
      <Container className="space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
            {heading}
          </h2>
          <p className="text-base text-foreground-muted sm:text-lg leading-relaxed">
            {body}
          </p>
        </div>

        {/* Area Selectors */}
        <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-border pb-6">
          {areaKeys.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setActiveArea(area)}
              aria-pressed={activeArea === area}
              className={`px-4 py-2 rounded-full text-sm transition-all border outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 ${
                activeArea === area
                  ? 'bg-orange text-white border-orange shadow-sm font-bold'
                  : 'bg-surface text-foreground-muted border-border hover:border-orange/50 hover:text-ink font-medium'
              }`}
            >
              {areas[area].label}
            </button>
          ))}
        </div>

        {/* Active Panel */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:min-h-[480px]">
          {/* Content Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange" />
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
                  {activeContent.eyebrow}
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {activeContent.heading}
              </h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                {activeContent.body}
              </p>
            </div>

            <ul className="space-y-3" role="list">
              {activeContent.supporting.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm font-medium text-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-orange/40" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
              <TrackedButton
                eventName="zaiko_demo_cta"
                properties={{
                  locale,
                  product: 'zaiko',
                  source: 'zaiko_explorer'
                }}
                href={getLocalizedPath('demo', locale) + '?product=zaiko'}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {demoCtaLabel}
              </TrackedButton>
              <a
                href={`#${activeArea}`}
                className="text-sm font-bold text-ink hover:text-orange transition-colors flex items-center gap-1 group outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 rounded-sm"
              >
                {detailLinkLabel.replace('{area}', activeContent.label)}
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-7">
            <ZaikoProductVisual type={activeArea} labels={visualLabels} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
