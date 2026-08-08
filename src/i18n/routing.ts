import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales, type Locale } from './config';

export const internalRoutes = {
  home: '/',
  productsZaiko: '/products/zaiko',
  customSoftware: '/custom-software',
  about: '/about',
  contact: '/contact',
  demo: '/demo'
} as const;

export type RouteKey = keyof typeof internalRoutes;

const pathnames = {
  '/': '/',
  '/products/zaiko': {
    en: '/products/zaiko',
    es: '/productos/zaiko'
  },
  '/custom-software': {
    en: '/custom-software',
    es: '/software-a-medida'
  },
  '/about': {
    en: '/about',
    es: '/nosotros'
  },
  '/contact': {
    en: '/contact',
    es: '/contacto'
  },
  '/demo': '/demo'
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  pathnames
});

function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$|^\/+/, '/') || '/';
}

const pathToRoute = Object.entries(internalRoutes).reduce((map, [key, value]) => {
  const routeKey = key as RouteKey;
  const normalizedPath = normalizePathname(value);

  map[normalizedPath] = routeKey;
  locales.forEach((locale) => {
    const localizedPath = value === '/' ? `/${locale}` : `/${locale}${value}`;
    map[normalizePathname(localizedPath)] = routeKey;
  });

  return map;
}, {} as Record<string, RouteKey>);

export function getLocalizedPath(routeKey: RouteKey, locale: Locale): string {
  const pathname = internalRoutes[routeKey];
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

export function getRouteKeyFromPath(pathname: string): RouteKey {
  const normalized = normalizePathname(pathname);
  return pathToRoute[normalized] || 'home';
}

export function getLocaleFromPath(pathname: string): Locale | undefined {
  const normalized = pathname.replace(/\/+$/, '');
  return locales.find((locale) => normalized === `/${locale}` || normalized.startsWith(`/${locale}/`));
}
