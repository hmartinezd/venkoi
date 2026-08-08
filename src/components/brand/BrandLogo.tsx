import type { PropsWithChildren } from 'react';

export function BrandLogo({ className }: PropsWithChildren<{ className?: string }>) {
  return (
    <span className={className} aria-label="Venkoi logo">
      <span className="font-semibold tracking-[0.18em] text-2xl md:text-3xl">VENKOI</span>
    </span>
  );
}
