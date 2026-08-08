import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';

export function CustomSoftwareSection({
  locale,
  eyebrow,
  heading,
  body,
  cta,
  mobileTitle,
  mobileDesc,
  webTitle,
  webDesc,
  backendTitle,
  backendDesc,
  primaryFocus = 'PRIMARY FOCUS'
}: {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  mobileTitle: string;
  mobileDesc: string;
  webTitle: string;
  webDesc: string;
  backendTitle: string;
  backendDesc: string;
  primaryFocus?: string;
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
            <Button href={getLocalizedPath('contact', locale) + '?type=custom-software'} variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white">
              {cta}
            </Button>
          </div>
        </div>

        {/* Asymmetrical Capability Layout - Mobile First Hierarchy */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Mobile Applications (Large Left Card - Primary Visual Weight) */}
          <div className="lg:col-span-7 rounded-2xl border border-white/15 bg-white/5 p-8 flex flex-col justify-between space-y-8 hover:border-orange/50 transition">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-lg bg-orange-subtle px-3 py-1 text-xs font-bold text-orange">
                <span>01</span>
                <span>{primaryFocus}</span>
              </div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                {mobileTitle}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed max-w-xl">
                {mobileDesc}
              </p>
            </div>

            {/* Mobile Graphic Motif */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-white/80">
                <span className="font-semibold">Mobile Workflows & Applications</span>
                <span className="text-orange text-[11px]">User-Centered</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/10 p-3 text-left space-y-1">
                  <span className="block text-xs font-bold text-white">Customer-Facing</span>
                  <span className="text-[11px] text-white/70 block">Mobile experiences for your clients</span>
                </div>
                <div className="rounded-lg bg-white/10 p-3 text-left space-y-1">
                  <span className="block text-xs font-bold text-white">Internal Tools</span>
                  <span className="text-[11px] text-white/70 block">Field tools built for team workflows</span>
                </div>
              </div>
            </div>
          </div>

          {/* Two Smaller Stacked Cards on Right */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Web Platforms Card */}
            <div className="flex-1 rounded-2xl border border-white/15 bg-white/5 p-6 space-y-3 hover:border-orange/50 transition">
              <span className="text-xs font-bold text-orange tracking-wider uppercase">02 · WEB</span>
              <h4 className="text-xl font-bold text-white">{webTitle}</h4>
              <p className="text-xs text-white/70 leading-relaxed">{webDesc}</p>
            </div>

            {/* Backend & Integrations Card */}
            <div className="flex-1 rounded-2xl border border-white/15 bg-white/5 p-6 space-y-3 hover:border-orange/50 transition">
              <span className="text-xs font-bold text-orange tracking-wider uppercase">03 · BACKEND</span>
              <h4 className="text-xl font-bold text-white">{backendTitle}</h4>
              <p className="text-xs text-white/70 leading-relaxed">{backendDesc}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

