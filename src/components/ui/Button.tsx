import { cn } from '@/lib/utils';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type SharedProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type LinkProps = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

type ActionProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white border-transparent hover:bg-[#0f1217] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange',
  secondary: 'bg-surface text-ink border border-border hover:border-ink focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange',
  ghost: 'bg-transparent text-ink hover:text-ink/90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange'
};

export function Button(props: LinkProps | ActionProps) {
  const { className = '', variant = 'primary', children, ...rest } = props as SharedProps & Record<string, unknown>;
  const classes = cn(
    'inline-flex items-center justify-center rounded-[14px] border px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
    variantStyles[variant],
    className
  );

  if ('href' in rest && typeof rest.href === 'string') {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
