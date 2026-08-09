import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales, type Locale } from './config';

export const internalRoutes = {
  home: '/',
  productsZaiko: '/products/zaiko',
  services: '/services',
  servicesMobile: '/services/mobile-applications',
  servicesWeb: '/services/websites-web-applications',
  about: '/about',
  contact: '/contact',
  demo: '/demo',
  insights: '/insights',
  insightRestaurantInventory: '/insights/restaurant-inventory-information',
  insightStartSoftwareProject: '/insights/start-a-software-project',
  insightWebsiteOrWebApp: '/insights/website-or-web-application'
} as const;

export type RouteKey = keyof typeof internalRoutes;
export type InternalPathname = (typeof internalRoutes)[RouteKey];

const pathnames = {
  '/': '/',
  '/products/zaiko': {
    en: '/products/zaiko',
    es: '/productos/zaiko'
  },
  '/services': {
    en: '/services',
    es: '/servicios'
  },
  '/services/mobile-applications': {
    en: '/services/mobile-applications',
    es: '/servicios/aplicaciones-moviles'
  },
  '/services/websites-web-applications': {
    en: '/services/websites-web-applications',
    es: '/servicios/paginas-web-aplicaciones-web'
  },
  '/about': {
    en: '/about',
    es: '/nosotros'
  },
  '/contact': {
    en: '/contact',
    es: '/contacto'
  },
  '/demo': '/demo',
  '/insights': {
    en: '/insights',
    es: '/recursos'
  },
  '/insights/restaurant-inventory-information': {
    en: '/insights/restaurant-inventory-information',
    es: '/recursos/inventario-restaurante-informacion-dispersa'
  },
  '/insights/start-a-software-project': {
    en: '/insights/start-a-software-project',
    es: '/recursos/como-empezar-un-proyecto-de-software'
  },
  '/insights/website-or-web-application': {
    en: '/insights/website-or-web-application',
    es: '/recursos/pagina-web-o-aplicacion-web'
  }
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  pathnames
});

function normalizePathname(pathname: string) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized;
}

const pathToRoute = Object.entries(internalRoutes).reduce((map, [key, value]) => {
  const routeKey = key as RouteKey;
  const normalizedInternal = normalizePathname(value);

  map[normalizedInternal] = routeKey;

  const pathnameConfig = pathnames[value as keyof typeof pathnames];

  locales.forEach((locale) => {
    let localizedSegment: string;
    if (typeof pathnameConfig === 'string') {
      localizedSegment = pathnameConfig;
    } else if (pathnameConfig && typeof pathnameConfig === 'object') {
      const config = pathnameConfig as Record<string, string>;
      localizedSegment = config[locale] || value;
    } else {
      localizedSegment = value;
    }

    const localizedPath = localizedSegment === '/' ? `/${locale}` : `/${locale}${localizedSegment}`;
    map[normalizePathname(localizedPath)] = routeKey;
  });

  return map;
}, {} as Record<string, RouteKey>);

export function getLocalizedPath(routeKey: RouteKey, locale: Locale): string {
  const internalPath = internalRoutes[routeKey];
  const pathnameConfig = pathnames[internalPath as keyof typeof pathnames];

  if (typeof pathnameConfig === 'string') {
    return internalPath === '/' ? `/${locale}` : `/${locale}${internalPath}`;
  }

  if (pathnameConfig && typeof pathnameConfig === 'object' && locale in pathnameConfig) {
    const localizedSegment = pathnameConfig[locale as keyof typeof pathnameConfig];
    return `/${locale}${localizedSegment}`;
  }

  return internalPath === '/' ? `/${locale}` : `/${locale}${internalPath}`;
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
