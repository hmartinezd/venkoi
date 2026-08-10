import { TrackedButton } from '@/components/analytics/TrackedButton';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/routing';

interface ServiceDetailHeroProps {
  locale: Locale;
  breadcrumbLabelKey: string;
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  interest: 'mobile' | 'web';
  analyticsSource: 'mobile_detail_hero' | 'web_detail_hero';
}

export function ServiceDetailHero(props: ServiceDetailHeroProps) {
  const { locale, breadcrumbLabelKey, eyebrow, heading, body, cta, interest, analyticsSource } = props;

  return (
    <Section variant="light" spacing="hero">
      <Container>
        <Breadcrumbs locale={locale} items={[
          { labelKey: 'services', routeKey: 'services' },
          { labelKey: breadcrumbLabelKey, isCurrent: true }
        ]} />
        <div className="max-w-4xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-text">{eyebrow}</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">{heading}</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-foreground-muted">{body}</p>
          <div className="pt-4">
            <TrackedButton
              href={`${getLocalizedPath('contact', locale)}?type=services&interest=${interest}`}
              variant="primary"
              eventName="services_cta"
              properties={{ locale, source: analyticsSource, interest }}
            >
              {cta}
            </TrackedButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
