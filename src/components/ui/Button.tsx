import { cn } from '@/lib/utils';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, ReactElement } from 'react';

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

export function Button(props: LinkProps): ReactElement;
export function Button(props: ActionProps): ReactElement;
export function Button(props: LinkProps | ActionProps) {
  const { className = '', variant = 'primary', children } = props;
  const classes = cn(
    'inline-flex items-center justify-center rounded-[14px] border px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
    variantStyles[variant],
    className
  );

  if ('href' in props && typeof props.href === 'string') {
    const { href, target, rel, ...rest } = props as LinkProps;
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
