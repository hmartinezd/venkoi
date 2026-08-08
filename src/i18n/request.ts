import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from '@/i18n/config';

export default getRequestConfig(({ locale, requestLocale }) => ({
  locales,
  defaultLocale,
  locale: locale ?? requestLocale
}));
