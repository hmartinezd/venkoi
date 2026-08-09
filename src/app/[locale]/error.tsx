'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { LocalizedLink } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errorBoundary');

  useEffect(() => {
    // Log sanitized error message without leaking sensitive internal details
    console.error('[Runtime Error Boundary]:', error.message || 'An unexpected error occurred');
  }, [error]);

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-20 bg-background text-foreground">
      <div className="max-w-md w-full mx-auto px-4 text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            {t('title')}
          </h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={reset}
            className="w-full sm:w-auto"
          >
            {t('tryAgain')}
          </Button>
          <LocalizedLink
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-ink transition duration-200 hover:border-ink hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange"
          >
            {t('goHome')}
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}

