import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { ReactNode } from 'react';

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

  setRequestLocale(currentLocale);

  const messages = await getMessages();

  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <NextIntlClientProvider messages={messages} locale={currentLocale}>
          <a id="skip-to-content" href={`/${currentLocale}#content`}>
            Skip to content
          </a>
          <Header locale={currentLocale} />
          <main id="content">{children}</main>
          <Footer locale={currentLocale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

