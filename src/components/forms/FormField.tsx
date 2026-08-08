import React, { useId } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: (props: { id: string; errorId?: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }) => React.ReactNode;
}

export function FormField({ label, required = false, error, className, children }: FormFieldProps) {
  const fieldId = useId();
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={fieldId} className="block text-xs font-semibold uppercase tracking-wider text-ink">
        {label} {required ? <span className="text-orange">*</span> : null}
      </label>

      {children({
        id: fieldId,
        errorId,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': errorId
      })}

      {error ? (
        <p id={errorId} className="text-xs font-medium text-red-600 animate-in fade-in-50" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
