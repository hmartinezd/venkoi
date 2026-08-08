import { NextIntlProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { defaultLocale, locales, type Locale } from '@/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { ReactNode } from 'react';

interface PageProps {
  params: { locale: string };
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
  const locale = parseLocale(params.locale);
  const messages = await import(`@/i18n/messages/${locale}.json`);

  return (
    <NextIntlProvider messages={messages} locale={locale} defaultLocale={defaultLocale}>
      <a id="skip-to-content" href={`/${locale}#content`}>
        Skip to content
      </a>
      <Header locale={locale} />
      <main id="content">{children}</main>
      <Footer locale={locale} />
    </NextIntlProvider>
  );
}
