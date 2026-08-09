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
    <Section variant="dark" className="py-20 md:py-28">
      <Container className="space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            {heading}
          </h2>
          <p className="text-base text-white/70 leading-relaxed">
            {body}
          </p>
          <div className="pt-2">
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
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 01 — Mobile Applications */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8 flex flex-col justify-between space-y-8 hover:border-orange/50 transition">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-lg bg-orange-subtle px-3 py-1 text-xs font-bold text-orange">
                01
              </span>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                {mobileTitle}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {mobileDesc}
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button
                href={getLocalizedPath('servicesMobile', locale)}
                variant="secondary"
                className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={() => trackCustomEvent('services_cta', { locale, source: 'home_mobile_detail', interest: 'mobile' })}
              >
                {learnMore}
              </Button>
            </div>
          </div>

          {/* Card 02 — Websites & Web Applications */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8 flex flex-col justify-between space-y-8 hover:border-orange/50 transition">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-lg bg-orange-subtle px-3 py-1 text-xs font-bold text-orange">
                02
              </span>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                {webTitle}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {webDesc}
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button
                href={getLocalizedPath('servicesWeb', locale)}
                variant="secondary"
                className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={() => trackCustomEvent('services_cta', { locale, source: 'home_web_detail', interest: 'web' })}
              >
                {learnMore}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
