import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

interface ServiceProcessProps {
  headingKey: string;
  showPrinciple?: boolean;
}

export function ServiceProcess({ headingKey, showPrinciple = true }: ServiceProcessProps) {
  const t = useTranslations('servicesPage.howWeWork');
  const tPage = useTranslations();

  const stages = [
    { num: '01', title: t('stage1Title'), desc: t('stage1Desc') },
    { num: '02', title: t('stage2Title'), desc: t('stage2Desc') },
    { num: '03', title: t('stage3Title'), desc: t('stage3Desc') },
    { num: '04', title: t('stage4Title'), desc: t('stage4Desc') },
  ];

  return (
    <Section className="bg-surface-muted/50 border-y border-border/50">
      <Container>
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold tracking-widest text-orange uppercase block mb-4">
            {t('eyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-6">
            {tPage(headingKey)}
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage) => (
            <div key={stage.num} className="relative group">
              <div className="text-5xl font-black text-border/30 mb-4 group-hover:text-orange/20 transition-colors">
                {stage.num}
              </div>
              <h3 className="text-lg font-bold text-ink mb-3">{stage.title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>

        {showPrinciple && (
          <div className="mt-16 pt-8 border-t border-border/60">
            <p className="text-sm font-medium text-ink italic">
              "{t('testingPrinciple')}"
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}
