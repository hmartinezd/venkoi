import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type SectionVariant = 'light' | 'muted' | 'dark' | 'surface';
export type SectionSpacing = 'compact' | 'standard' | 'spacious' | 'hero' | 'none';

const variantClasses: Record<SectionVariant, string> = {
  light: 'bg-background text-foreground',
  muted: 'bg-surface-muted text-foreground',
  surface: 'bg-surface text-foreground',
  dark: 'bg-ink text-white'
};

const spacingClasses: Record<SectionSpacing, string> = {
  compact: 'py-10 md:py-12 lg:py-14',
  standard: 'py-12 md:py-16 lg:py-20',
  spacious: 'py-14 md:py-20 lg:py-24',
  hero: 'pt-12 pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24',
  none: 'py-0'
};

export function Section({
  children,
  className = '',
  variant = 'light',
  spacing = 'standard',
  id
}: PropsWithChildren<{
  className?: string;
  variant?: SectionVariant;
  spacing?: SectionSpacing;
  id?: string;
}>) {
  return (
    <section id={id} className={cn(variantClasses[variant], spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}
