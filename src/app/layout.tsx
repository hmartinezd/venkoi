import './globals.css';
import type { Metadata } from 'next';
import { defaultLocale } from '@/i18n/config';
import { getLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Venkoi',
  description: 'Venkoi website foundation for a Tampa Bay software company.'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale ?? defaultLocale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
