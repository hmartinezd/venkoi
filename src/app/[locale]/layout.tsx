import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Geist } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getSiteOrigin } from '@/lib/site-config';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { FEATURED_PRODUCT } from '@/lib/products';

const globalClientMessageNamespaces = [
  'common',
  'navigation',
  'header',
  'breadcrumbs',
  'errorBoundary'
] as const;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin())
};

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap'
});

interface PageProps {
  params: Promise<{ locale: string }>;
  children: ReactNode;
}

function parseLocale(locale: string): Locale {
  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  notFound();
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ params, children }: PageProps) {
  const { locale } = await params;
  const currentLocale = parseLocale(locale);


  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    globalClientMessageNamespaces.map((namespace) => [namespace, messages[namespace]])
  );

  return (
    <html lang={currentLocale} className={geist.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <NextIntlClientProvider messages={clientMessages} locale={currentLocale}>
          <Header locale={currentLocale} productName={FEATURED_PRODUCT.name} />
          <main id="content" tabIndex={-1} className="outline-hidden">
            {children}
          </main>
          <Footer locale={currentLocale} productName={FEATURED_PRODUCT.name} />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
