import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type SectionVariant = 'light' | 'muted' | 'dark' | 'surface';

const variantClasses: Record<SectionVariant, string> = {
  light: 'bg-background text-foreground',
  muted: 'bg-surface-muted text-foreground',
  surface: 'bg-surface text-foreground',
  dark: 'bg-ink text-white'
};

export function Section({
  children,
  className = '',
  variant = 'light',
  id
}: PropsWithChildren<{ className?: string; variant?: SectionVariant; id?: string }>) {
  return (
    <section id={id} className={cn(variantClasses[variant], 'py-14 md:py-20 lg:py-28', className)}>
      {children}
    </section>
  );
}

