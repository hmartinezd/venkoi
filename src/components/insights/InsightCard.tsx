import { LocalizedLink } from '@/i18n/navigation';
import { type RouteKey, internalRoutes } from '@/i18n/routing';
import { type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  locale: Locale;
  category: string;
  title: string;
  description: string;
  routeKey: RouteKey;
  readMoreLabel: string;
  featured?: boolean;
}

export function InsightCard({
  locale,
  category,
  title,
  description,
  routeKey,
  readMoreLabel,
  featured = false
}: InsightCardProps) {
  return (
    <div className={cn(
      'group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition hover:border-orange/30 hover:shadow-sm',
      featured && 'lg:col-span-7 lg:p-8'
    )}>
      <div className="flex-1 space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-text">
          {category}
        </span>
        <h3 className={cn(
          'text-xl font-bold leading-tight text-ink transition-colors group-hover:text-orange-text',
          featured && 'sm:text-2xl lg:text-3xl'
        )}>
          {title}
        </h3>
        <p className={cn(
          'text-sm leading-relaxed text-foreground-muted',
          featured && 'sm:text-base'
        )}>
          {description}
        </p>
      </div>
      <div className="mt-8 pt-6 border-t border-border/50">
        <LocalizedLink
          href={internalRoutes[routeKey]}
          locale={locale}
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-ink transition hover:text-orange-text outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4 rounded-sm"
        >
          {readMoreLabel}
          <svg
            className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </LocalizedLink>
      </div>
    </div>
  );
}
