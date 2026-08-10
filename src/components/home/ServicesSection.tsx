'use client';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';
import { trackCustomEvent } from '@/lib/analytics';

export function ServicesSection({
  locale,
  eyebrow,
  heading,
  body,
  cta,
  learnMore,
  mobileTitle,
  mobileDesc,
  webTitle,
  webDesc
}: {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  learnMore: string;
  mobileTitle: string;
  mobileDesc: string;
  webTitle: string;
  webDesc: string;
}) {
  return (
    <Section variant="dark" spacing="compact">
      <Container className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        {/* Section Header */}
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">
            {eyebrow}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl leading-tight">
            {heading}
          </h2>
          <p className="text-base text-white/70 leading-relaxed">
            {body}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button href={getLocalizedPath('services', locale)} variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              {learnMore}
            </Button>
            <Button
              href={getLocalizedPath('contact', locale) + '?type=services'}
              variant="secondary"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white"
              onClick={() => trackCustomEvent('services_cta', { locale, source: 'home' })}
            >
              {cta}
            </Button>
          </div>
        </div>

        {/* Balanced Two-Capability Layout */}
        <div className="grid gap-3">
          {/* Card 01 — Mobile Applications */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-5 space-y-2">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-lg bg-orange-subtle px-3 py-1 text-xs font-bold text-orange-text">
                01
              </span>
              <h3 className="text-base font-bold text-white">
                {mobileTitle}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {mobileDesc}
              </p>
            </div>
          </div>

          {/* Card 02 — Websites & Web Applications */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-5 space-y-2">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-lg bg-orange-subtle px-3 py-1 text-xs font-bold text-orange-text">
                02
              </span>
              <h3 className="text-base font-bold text-white">
                {webTitle}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {webDesc}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
