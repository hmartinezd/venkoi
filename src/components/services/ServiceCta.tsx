'use client';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';
import { trackCustomEvent } from '@/lib/analytics';

interface ServiceCtaProps {
  locale: Locale;
  heading: string;
  body: string;
  cta: string;
  interest: 'mobile' | 'web';
}

export function ServiceCta({ locale, heading, body, cta, interest }: ServiceCtaProps) {
  const contactHref = `${getLocalizedPath('contact', locale)}?type=services&interest=${interest}`;
  const source = `${interest}_detail_footer`;

  return (
    <Section className="bg-ink text-surface">
      <Container className="text-center">
        <div className="max-w-2xl mx-auto py-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {heading}
          </h2>
          <p className="text-lg text-surface/80 mb-10 leading-relaxed">
            {body}
          </p>
          <Button
            href={contactHref}
            variant="primary"
            className="bg-orange hover:bg-orange-strong border-orange text-white"
            onClick={() => trackCustomEvent('services_cta', { locale, source })}
          >
            {cta}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
