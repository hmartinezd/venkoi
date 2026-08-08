// @ts-nocheck
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--venkoi-background)',
        surface: 'var(--venkoi-surface)',
        'surface-muted': 'var(--venkoi-surface-muted)',
        'surface-dark': 'var(--venkoi-surface-dark)',
        foreground: 'var(--venkoi-foreground)',
        'foreground-muted': 'var(--venkoi-foreground-muted)',
        ink: 'var(--venkoi-ink)',
        orange: 'var(--venkoi-orange)',
        'orange-subtle': 'var(--venkoi-orange-subtle)',
        border: 'var(--venkoi-border)',
        'border-strong': 'var(--venkoi-border-strong)',
        focus: 'var(--venkoi-focus)',
        success: 'var(--venkoi-success)',
        error: 'var(--venkoi-error)',
        warning: 'var(--venkoi-warning)'
      },
      boxShadow: {
        card: '0 10px 30px rgba(20, 22, 28, 0.06)'
      },
      borderRadius: {
        md: '16px'
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'Inter', 'system-ui', 'sans-serif']
      },
      maxWidth: {
        'screen-2xl': '1320px'
      }
    }
  },
  plugins: []
};

export default config;
