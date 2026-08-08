import type { PropsWithChildren } from 'react';

export function Surface({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-[18px] border border-border bg-surface p-6 shadow-card ${className}`}>
      {children}
    </div>
  );
}
