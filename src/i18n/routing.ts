import { locales, type Locale } from './config';

export const localizedRoutes = {
  home: {
    en: '/en',
    es: '/es'
  },
  productsZaiko: {
    en: '/en/products/zaiko',
    es: '/es/productos/zaiko'
  },
  customSoftware: {
    en: '/en/custom-software',
    es: '/es/software-a-medida'
  },
  about: {
    en: '/en/about',
    es: '/es/nosotros'
  },
  contact: {
    en: '/en/contact',
    es: '/es/contacto'
  },
  demo: {
    en: '/en/demo',
    es: '/es/demo'
  }
} as const;

export type RouteKey = keyof typeof localizedRoutes;

const pathToRoute = Object.entries(localizedRoutes).reduce(
  (map, [key, value]) => {
    map[value.en] = key as RouteKey;
    map[value.es] = key as RouteKey;
    return map;
  },
  {} as Record<string, RouteKey>
);

export function getLocalizedPath(routeKey: RouteKey, locale: Locale): string {
  return localizedRoutes[routeKey][locale];
}

export function getLocalizedRouteFromPath(pathname: string, locale: Locale): string {
  const normalized = pathname.replace(/\/+$/, '');
  const routeKey = pathToRoute[normalized] || 'home';
  return localizedRoutes[routeKey][locale];
}

export function getRouteKeyFromSegments(segments: string[]): RouteKey {
  const path = `/${segments.join('/')}`.replace(/\/+$/, '');
  return pathToRoute[path] || 'home';
}

export function getLocaleFromPath(pathname: string): Locale | undefined {
  const normalized = pathname.replace(/\/+$/, '');
  return locales.find((locale) => normalized === `/${locale}` || normalized.startsWith(`/${locale}/`));
}
