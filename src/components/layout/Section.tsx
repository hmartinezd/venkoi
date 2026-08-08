import type { PropsWithChildren } from 'react';

type SectionVariant = 'light' | 'muted' | 'dark';

const variantClasses: Record<SectionVariant, string> = {
  light: 'bg-background text-foreground',
  muted: 'bg-surface-muted text-foreground',
  dark: 'bg-ink text-surface'
};

export function Section({
  children,
  className = '',
  variant = 'light'
}: PropsWithChildren<{ className?: string; variant?: SectionVariant }>) {
  return (
    <section className={`${variantClasses[variant]} py-16 ${className}`}>{children}</section>
  );
}
