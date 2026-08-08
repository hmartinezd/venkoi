import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function Container({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

