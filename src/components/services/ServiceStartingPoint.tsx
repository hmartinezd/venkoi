import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { TrackedButton } from '@/components/analytics/TrackedButton';
import { type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';

interface ServiceStartingPointProps {
  locale: Locale;
  heading: string;
  body: string;
  existingProject?: { heading: string; body: string };
  prompts: string[];
  ctaText?: string;
  ctaInterest: 'mobile' | 'web';
  ctaSource: string;
}

export function ServiceStartingPoint({
  locale,
  heading,
  body,
  existingProject,
  prompts,
  ctaText,
  ctaInterest,
  ctaSource
}: ServiceStartingPointProps) {
  return (
    <Section variant="light" className="border-t border-border/50">
      <Container className="max-w-4xl space-y-10">
        <div className="max-w-3xl space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">
            {heading}
          </h2>
          <p className="text-base text-foreground-muted leading-relaxed">
            {body}
          </p>
        </div>

        {existingProject && <div className="rounded-2xl border border-border bg-surface-muted p-6 sm:p-8"><h3 className="text-xl font-bold text-ink">{existingProject.heading}</h3><p className="mt-3 text-sm leading-relaxed text-foreground-muted">{existingProject.body}</p></div>}

        <div className="grid gap-4 sm:grid-cols-2">
          {prompts.map((prompt, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-surface p-6 flex flex-col justify-center"
            >
              <p className="text-sm font-semibold text-ink leading-relaxed">
                {prompt}
              </p>
            </div>
          ))}
        </div>

        {ctaText && (
          <div className="pt-2">
            <TrackedButton
              href={`${getLocalizedPath('contact', locale)}?type=services&interest=${ctaInterest}`}
              variant="secondary"
              eventName="services_cta"
              properties={{ locale, source: ctaSource, interest: ctaInterest }}
            >
              {ctaText}
            </TrackedButton>
          </div>
        )}
      </Container>
    </Section>
  );
}
