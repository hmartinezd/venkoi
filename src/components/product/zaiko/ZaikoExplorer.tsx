'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ZaikoProductVisual, type ZaikoVisualLabels } from './ZaikoProductVisual';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import { type Locale } from '@/i18n/config';
import { buildProductDemoHref } from '@/lib/product-links';
import { FEATURED_PRODUCT } from '@/lib/products';

type ZaikoExplorerArea = 'inventory' | 'purchases' | 'activity' | 'costs';

interface AreaContent {
  label: string;
  eyebrow: string;
  heading: string;
  summary: string;
}

interface ZaikoExplorerProps {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  detailLinkLabel: string;
  demoCtaLabel: string;
  areas: Record<ZaikoExplorerArea, AreaContent>;
  visualLabels: ZaikoVisualLabels;
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
    <Section spacing="spacious" className="border-t border-border bg-background">
      <Container className="space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
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
              className={`px-4 py-2 rounded-full text-sm transition-all border focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 ${
                activeArea === area
                  ? 'bg-orange text-ink border-orange shadow-sm font-bold'
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
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
                  {activeContent.eyebrow}
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {activeContent.heading}
              </h3>
              <p className="text-base text-foreground-muted leading-relaxed sm:text-lg">
                {activeContent.summary}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
              <TrackedButton
                eventName="zaiko_demo_cta"
                properties={{
                  locale,
                  product: FEATURED_PRODUCT.analyticsProduct,
                  source: 'product_explorer'
                }}
                href={buildProductDemoHref(locale, FEATURED_PRODUCT, { source: 'product_explorer' })}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {demoCtaLabel}
              </TrackedButton>
              <a
                href={`#${activeArea}`}
                className="text-sm font-bold text-ink hover:text-orange-text transition-colors flex items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 rounded-sm"
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
