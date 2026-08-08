import './globals.css';
import type { Metadata } from 'next';
import { defaultLocale } from '@/i18n/config';

export const metadata: Metadata = {
  title: 'Venkoi',
  description: 'Venkoi website foundation for a Tampa Bay software company.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
