import { TrackedButton } from '@/components/analytics/TrackedButton';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { type Locale } from '@/i18n/config';
import { getLocalizedPath, type RouteKey } from '@/i18n/routing';

interface Offering { eyebrow: string; title: string; body: string; cue: string; cta: string; routeKey: RouteKey; source: string }
export function ServiceOfferings({ locale, offerings }: { locale: Locale; offerings: [Offering, Offering] }) {
  return (
    <Section variant="surface" className="border-y border-border">
      <Container>
        <div className="grid overflow-hidden rounded-3xl border border-border bg-background md:grid-cols-2">
          {offerings.map((offering, index) => (
            <article key={offering.routeKey} className={`flex flex-col p-7 sm:p-10 ${index ? 'border-t border-border md:border-l md:border-t-0' : ''}`}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-text">{offering.eyebrow}</p>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{offering.title}</h2>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground-muted sm:text-base">{offering.body}</p>
              <p className="mt-5 text-sm font-semibold text-ink">{offering.cue}</p>
              <div className="mt-8"><TrackedButton href={getLocalizedPath(offering.routeKey, locale)} variant="secondary" eventName="services_cta" properties={{ locale, source: offering.source }}>{offering.cta}</TrackedButton></div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
