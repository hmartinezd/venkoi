import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from '@/i18n/config';

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = locales.includes(locale as Locale)
    ? locale
    : await requestLocale;

  return {
    locales,
    defaultLocale,
    locale: locales.includes(resolvedLocale as Locale) ? resolvedLocale : defaultLocale
  };
});
