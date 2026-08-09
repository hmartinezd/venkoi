import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';

interface ServiceCtaProps {
  locale: Locale;
  headingKey: string;
  bodyKey: string;
  ctaKey: string;
  interest: 'mobile' | 'web';
}

export function ServiceCta({ locale, headingKey, bodyKey, ctaKey, interest }: ServiceCtaProps) {
  const t = useTranslations();

  const contactHref = `${getLocalizedPath('contact', locale)}?type=services&interest=${interest}`;

  return (
    <Section className="bg-ink text-surface">
      <Container className="text-center">
        <div className="max-w-2xl mx-auto py-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t(headingKey)}
          </h2>
          <p className="text-lg text-surface/80 mb-10 leading-relaxed">
            {t(bodyKey)}
          </p>
          <Button
            href={contactHref}
            variant="primary"
            className="bg-orange hover:bg-orange-strong border-orange text-white"
          >
            {t(ctaKey)}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
