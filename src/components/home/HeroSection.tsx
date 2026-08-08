import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';

export function HeroSection({
  locale,
  eyebrow,
  heading,
  body,
  primaryCta,
  secondaryCta,
  location
}: {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  location: string;
}) {
  return (
    <Section variant="light" className="pt-12 pb-20 md:pt-16 md:pb-28">
      <Container className="grid gap-12 lg:grid-cols-[55%_45%] lg:items-center">
        <div className="max-w-2xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl leading-[1.1]">
            {heading}
          </h1>
          <p className="text-base leading-relaxed text-foreground-muted sm:text-lg">
            {body}
          </p>

          <div className="pt-4 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <Button href={getLocalizedPath('productsZaiko', locale)} variant="primary">
              {primaryCta}
            </Button>
            <Button href={getLocalizedPath('customSoftware', locale)} variant="secondary">
              {secondaryCta}
            </Button>
          </div>

          <div className="pt-6 border-t border-border/80">
            <p className="text-xs font-medium text-foreground-muted flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-orange animate-pulse" />
              {location}
            </p>
          </div>
        </div>

        {/* Abstract Brand Composition Right Visual */}
        <div className="relative isolate w-full">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-card space-y-6">
            {/* Header bar */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-orange" />
                <span className="text-xs font-bold tracking-widest text-ink">VENKOI ARCHITECTURE</span>
              </div>
              <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider bg-surface-muted px-2.5 py-1 rounded-md">
                SYSTEM V2
              </span>
            </div>

            {/* Main Visual Panels */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Product Component Box */}
              <div className="rounded-2xl border border-border bg-surface-muted p-5 space-y-3 transition hover:border-border-strong">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">Zaiko Engine</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full rounded-full bg-border" />
                  <div className="h-2.5 w-3/4 rounded-full bg-orange/40" />
                </div>
                <p className="text-[11px] text-foreground-muted pt-2">Operational Inventory Logic</p>
              </div>

              {/* Custom Solutions Box */}
              <div className="rounded-2xl border border-border bg-surface-muted p-5 space-y-3 transition hover:border-border-strong">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">Custom Core</span>
                  <span className="h-2 w-2 rounded-full bg-orange" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full rounded-full bg-ink/20" />
                  <div className="h-2.5 w-1/2 rounded-full bg-border" />
                </div>
                <p className="text-[11px] text-foreground-muted pt-2">Mobile & Web Integration</p>
              </div>
            </div>

            {/* Bottom Graphic Matrix */}
            <div className="rounded-2xl border border-border/80 bg-ink p-5 text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white/90">Tampa Bay Native Platform</span>
                <span className="text-orange text-[11px] font-mono font-bold">28.0&apos; N / 82.4&apos; W</span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-1">
                <div className="h-1.5 rounded-full bg-orange" />
                <div className="h-1.5 rounded-full bg-white/40" />
                <div className="h-1.5 rounded-full bg-white/40" />
                <div className="h-1.5 rounded-full bg-orange/60" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
