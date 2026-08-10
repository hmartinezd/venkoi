'use client';

import { Button, type ButtonVariant } from '@/components/ui/Button';
import { trackCustomEvent, type AnalyticsEventName, type SafeAnalyticsProperties } from '@/lib/analytics';
import { type ReactNode } from 'react';

interface TrackedButtonProps {
  eventName: AnalyticsEventName;
  properties?: SafeAnalyticsProperties;
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

export function TrackedButton({
  eventName,
  properties,
  href,
  variant,
  className,
  children
}: TrackedButtonProps) {
  return (
    <Button
      href={href}
      variant={variant}
      className={className}
      onClick={() => trackCustomEvent(eventName, properties)}
    >
      {children}
    </Button>
  );
}
