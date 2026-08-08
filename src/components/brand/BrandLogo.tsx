import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface BrandLogoProps {
  variant?: 'dark' | 'light';
  size?: 'header' | 'footer' | 'custom';
  className?: string;
  priority?: boolean;
}

const logoAssets = {
  dark: '/brand/venkoi-logo-dark.png',
  light: '/brand/venkoi-logo-light.png',
} as const;

// Native asset dimensions (353x101)
const LOGO_NATIVE_WIDTH = 353;
const LOGO_NATIVE_HEIGHT = 101;

const sizeClasses = {
  header: 'h-11 md:h-12',
  footer: 'h-10',
  custom: '',
};

export function BrandLogo({
  variant = 'dark',
  size = 'custom',
  className,
  priority = false,
}: BrandLogoProps) {
  const logoSrc = logoAssets[variant];

  return (
    <Image
      src={logoSrc}
      alt="Venkoi"
      width={LOGO_NATIVE_WIDTH}
      height={LOGO_NATIVE_HEIGHT}
      priority={priority}
      className={cn(
        'w-auto object-contain shrink-0',
        size === 'custom' && !className && 'h-8',
        sizeClasses[size],
        className
      )}
    />
  );
}
