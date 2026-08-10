import { getRequestConfig } from 'next-intl/server';
import { locale as getRootLocale } from 'next/root-params';
import { defaultLocale, locales, type Locale } from '@/i18n/config';

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  let locale = explicitLocale ?? (await getRootLocale());

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
