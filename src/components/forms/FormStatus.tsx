import React from 'react';
import { cn } from '@/lib/utils';

interface FormStatusProps {
  status: 'idle' | 'success' | 'error';
  title?: string;
  message?: string;
  className?: string;
}

export function FormStatus({ status, title, message, className }: FormStatusProps) {
  if (status === 'idle' || (!title && !message)) return null;

  const isSuccess = status === 'success';
  const role = isSuccess ? 'status' : 'alert';
  const ariaLive = isSuccess ? 'polite' : 'assertive';

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={cn(
        'rounded-2xl p-6 border transition-all duration-200 space-y-2',
        isSuccess
          ? 'bg-orange/10 border-orange/30 text-ink'
          : 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200',
        className
      )}
    >
      {title ? (
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange text-ink text-xs font-bold">
              ✓
            </span>
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
              !
            </span>
          )}
          <h3 className="text-base font-bold tracking-tight">{title}</h3>
        </div>
      ) : null}
      {message ? (
        <p className="text-sm font-normal leading-relaxed text-foreground-muted whitespace-pre-line">
          {message}
        </p>
      ) : null}
    </div>
  );
}
