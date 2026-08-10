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
  location,
  productName,
  inventoryLabel,
  purchasesLabel,
  activityLabel,
  costsLabel
}: {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  location: string;
  productName: string;
  inventoryLabel: string;
  purchasesLabel: string;
  activityLabel: string;
  costsLabel: string;
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
            <Button href={getLocalizedPath('demo', locale) + '?product=zaiko'} variant="secondary">
              {secondaryCta}
            </Button>
          </div>

          <div className="pt-6 border-t border-border/80">
            <p className="text-xs font-medium text-foreground-muted flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-orange" />
              {location}
            </p>
          </div>
        </div>

        {/* Abstract Product Composition Right Visual */}
        <div className="relative isolate w-full">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-card space-y-6">
            {/* Header bar */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-orange" />
                <span className="h-2 w-24 rounded-full bg-ink/70" />
              </div>
              <div className="flex items-center gap-1.5 bg-surface-muted px-2.5 py-1 rounded-md">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                <span className="h-2 w-16 rounded-full bg-foreground-muted/50" />
              </div>
            </div>

            {/* Main Visual Panels */}
            <div className="space-y-4">
              {/* Primary Product Card */}
              <div className="rounded-2xl border border-orange/30 bg-orange-subtle/30 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">{productName}</span>
                  <span className="text-[10px] font-bold text-orange uppercase tracking-wider bg-orange-subtle px-2 py-0.5 rounded">
                    01
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-ink sm:grid-cols-4">
                  {[inventoryLabel, purchasesLabel, activityLabel, costsLabel].map((label, index) => (
                    <div key={label} className="rounded-lg border border-orange/20 bg-surface px-3 py-3">
                      <span className="mb-2 block h-1.5 rounded-full bg-orange" style={{ opacity: 1 - index * 0.16 }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Graphic Matrix */}
            <div className="rounded-2xl border border-border bg-ink p-5 text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="h-2 w-28 rounded-full bg-white/80" />
                <div className="h-2 w-12 rounded-full bg-orange" />
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
