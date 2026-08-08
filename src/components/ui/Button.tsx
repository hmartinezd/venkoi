import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, ReactElement } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'text';

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
  primary: 'bg-ink text-white border border-transparent hover:bg-ink/90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange shadow-sm',
  secondary: 'bg-surface text-ink border border-border hover:border-ink hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange',
  text: 'bg-transparent text-ink border border-transparent p-0 hover:text-orange focus-visible:ring-2 focus-visible:ring-orange'
};

const baseClasses: Record<ButtonVariant, string> = {
  primary: 'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
  secondary: 'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
  text: 'inline-flex items-center justify-center text-sm font-semibold transition duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'
};

export function Button(props: LinkProps): ReactElement;
export function Button(props: ActionProps): ReactElement;
export function Button(props: LinkProps | ActionProps) {
  const { className = '', variant = 'primary', children } = props;
  const classes = cn(
    baseClasses[variant],
    variantStyles[variant],
    className
  );

  if ('href' in props && typeof props.href === 'string') {
    const { href, target, rel, ...rest } = props as LinkProps;
    const isInternal = href.startsWith('/') && !href.startsWith('//');

    if (isInternal) {
      return (
        <Link className={classes} href={href as any} {...rest}>
          {children}
        </Link>
      );
    }

    return (
      <a className={classes} href={href} target={target} rel={rel} {...rest}>
        {children}
      </a>
    );
  }

  const { type = 'button', disabled, ...rest } = props as ActionProps;
  return (
    <button className={classes} type={type} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}


