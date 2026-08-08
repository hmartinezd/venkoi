import type { Locale } from './config';

export default function getRequestConfig({ locale, requestLocale }: any) {
  const resolvedLocale = (locale ?? requestLocale) as Locale | undefined;
  return {
    locales: ['en', 'es'] as const,
    defaultLocale: 'en' as Locale,
    locale: resolvedLocale
  };
}
