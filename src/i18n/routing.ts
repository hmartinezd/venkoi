import { defaultLocale, locales, type Locale } from './config';

export const localizedRoutes = {
  home: {
    en: '/',
    es: '/'
  },
  productsZaiko: {
    en: '/products/zaiko',
    es: '/productos/zaiko'
  },
  customSoftware: {
    en: '/custom-software',
    es: '/software-a-medida'
  },
  about: {
    en: '/about',
    es: '/nosotros'
  },
  contact: {
    en: '/contact',
    es: '/contacto'
  },
  demo: {
    en: '/demo',
    es: '/demo'
  }
} as const;

export type RouteKey = keyof typeof localizedRoutes;

const pathToRoute = Object.entries(localizedRoutes).reduce(
  (map, [key, value]) => {
    const enPath = value.en;
    const esPath = value.es;
    const prefixedEn = enPath === '/' ? '/en' : `/en${enPath}`;
    const prefixedEs = esPath === '/' ? '/es' : `/es${esPath}`;

    map[enPath] = key as RouteKey;
    map[esPath] = key as RouteKey;
    map[prefixedEn] = key as RouteKey;
    map[prefixedEs] = key as RouteKey;

    return map;
  },
  {} as Record<string, RouteKey>
);

export const routing = {
  locales,
  defaultLocale,
  localePrefix: 'always',
  pathnames: localizedRoutes
} as const;

function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$|^\/+/, '/') || '/';
}

export function getLocalizedPath(routeKey: RouteKey, locale: Locale): string {
  const pathname = localizedRoutes[routeKey][locale];
  return pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
}

export function getLocalizedRouteFromPath(pathname: string, locale: Locale): string {
  const normalized = normalizePathname(pathname);
  const routeKey = pathToRoute[normalized] || 'home';
  return getLocalizedPath(routeKey, locale);
}

export function getRouteKeyFromSegments(segments: string[]): RouteKey {
  const path = normalizePathname(`/${segments.join('/')}`);
  return pathToRoute[path] || 'home';
}

export function getLocaleFromPath(pathname: string): Locale | undefined {
  const normalized = pathname.replace(/\/+$/, '');
  return locales.find((locale) => normalized === `/${locale}` || normalized.startsWith(`/${locale}/`));
}
