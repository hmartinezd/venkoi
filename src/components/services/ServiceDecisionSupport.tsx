import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { InsightCard } from '@/components/insights/InsightCard';
import { type Locale } from '@/i18n/config';
import { type RouteKey } from '@/i18n/routing';
import { ServiceFaqList, type FaqItem } from './ServiceFaqList';

interface Props { locale: Locale; heading: string; guide: { category: string; title: string; description: string; routeKey: RouteKey; readMoreLabel: string }; faqHeading: string; faqItems: FaqItem[] }
export function ServiceDecisionSupport({ locale, heading, guide, faqHeading, faqItems }: Props) {
  return (
    <Section variant="surface" className="border-t border-border">
      <Container className="space-y-10">
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">{heading}</h2>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5"><InsightCard locale={locale} {...guide} /></div>
          <div className="space-y-6 lg:col-span-7">
            <h3 className="text-xl font-bold text-ink sm:text-2xl">{faqHeading}</h3>
            <ServiceFaqList items={faqItems} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
