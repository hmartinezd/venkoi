import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { LocalizedLink } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <Section variant="dark" spacing="none" className="min-h-[70vh] flex items-center justify-center">
      <Container className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-orange">
            404
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
            className="inline-flex items-center justify-center rounded-xl bg-orange px-6 py-3 text-sm font-semibold text-ink shadow-sm hover:bg-orange hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange"
          >
            {t('cta')}
          </LocalizedLink>
        </div>
      </Container>
    </Section>
  );
}
