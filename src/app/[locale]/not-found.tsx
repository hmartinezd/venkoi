import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { LocalizedLink } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <Section variant="dark" className="min-h-[70vh] flex items-center justify-center py-20">
      <Container className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            404 ERROR
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-lg mx-auto">
            {t('description')}
          </p>
        </div>

        <div>
          <LocalizedLink
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-orange px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            {t('cta')}
          </LocalizedLink>
        </div>
      </Container>
    </Section>
  );
}
