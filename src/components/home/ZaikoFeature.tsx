import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { getLocalizedPath } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';

export function ZaikoFeature({
  locale,
  eyebrow,
  heading,
  body,
  discoverCta,
  demoCta,
  badge,
  badgeText,
  theme1Title,
  theme1Desc,
  theme2Title,
  theme2Desc,
  theme3Title,
  theme3Desc,
  theme4Title,
  theme4Desc
}: {
  locale: Locale;
  eyebrow: string;
  heading: string;
  body: string;
  discoverCta: string;
  demoCta: string;
  badge: string;
  badgeText: string;
  theme1Title: string;
  theme1Desc: string;
  theme2Title: string;
  theme2Desc: string;
  theme3Title: string;
  theme3Desc: string;
  theme4Title: string;
  theme4Desc: string;
}) {
  const themes = [
    { title: theme1Title, desc: theme1Desc },
    { title: theme2Title, desc: theme2Desc },
    { title: theme3Title, desc: theme3Desc },
    { title: theme4Title, desc: theme4Desc }
  ];

  return (
    <Section variant="surface" className="py-16 md:py-24 border-y border-border">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Info Column */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
                {eyebrow}
              </span>
              <span className="inline-flex items-center rounded-md bg-orange-subtle px-2.5 py-0.5 text-[11px] font-bold text-orange uppercase tracking-wider">
                {badge}
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight whitespace-pre-line">
              {heading}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed">
              {body}
            </p>
          </div>

          {/* 4 Concise Product Themes Grid */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            {themes.map((t, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-background p-4 space-y-1">
                <p className="text-sm font-bold text-ink flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                  {t.title}
                </p>
                <p className="text-xs text-foreground-muted leading-snug">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Early Access Callout */}
          <div className="rounded-xl border border-orange/30 bg-orange-subtle/50 p-4 flex items-center justify-between gap-4">
            <p className="text-xs font-semibold text-ink">{badgeText}</p>
            <span className="text-[11px] font-bold text-orange uppercase tracking-widest whitespace-nowrap">
              01 / ZAIKO
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button href={getLocalizedPath('productsZaiko', locale)} variant="primary">
              {discoverCta}
            </Button>
            <Button href={getLocalizedPath('demo', locale)} variant="secondary">
              {demoCta}
            </Button>
          </div>
        </div>

        {/* Right Abstract Product Composition */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-card space-y-5">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-orange" />
                <span className="text-xs font-bold tracking-wider text-ink uppercase">Zaiko</span>
              </div>
              <span className="text-[11px] text-orange font-bold uppercase tracking-wider bg-orange-subtle px-2.5 py-0.5 rounded">
                01
              </span>
            </div>

            {/* Abstract Structured Rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 text-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-ink">{theme1Title}</p>
                  <p className="text-[11px] text-foreground-muted">{theme1Desc}</p>
                </div>
                <div className="text-right">
                  <span className="h-2 w-12 rounded-full bg-orange/40 inline-block" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 text-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-ink">{theme2Title}</p>
                  <p className="text-[11px] text-foreground-muted">{theme2Desc}</p>
                </div>
                <div className="text-right">
                  <span className="h-2 w-10 rounded-full bg-border-strong inline-block" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 text-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-ink">{theme3Title}</p>
                  <p className="text-[11px] text-foreground-muted">{theme3Desc}</p>
                </div>
                <div className="text-right">
                  <span className="h-2 w-14 rounded-full bg-orange/60 inline-block" />
                </div>
              </div>
            </div>

            {/* Abstract Activity Stream Motif */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-ink">
                <span>{theme4Title}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-orange" />
                </div>
                <p className="text-[11px] text-foreground-muted pt-0.5">{theme4Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

