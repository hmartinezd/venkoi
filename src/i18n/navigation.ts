import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { routing, type RouteKey } from './routing';

export const {
  Link: LocalizedLink,
  usePathname,
  useRouter,
  getPathname,
  redirect,
  permanentRedirect
} = createLocalizedPathnamesNavigation(routing);

export type NavigationChild = {
  id: string;
  labelKey: string;
  routeKey: RouteKey;
};

export type NavigationItem = {
  id: string;
  labelKey: string;
  routeKey: RouteKey;
  children?: NavigationChild[];
};

export const headerNavigation: NavigationItem[] = [
  {
    id: 'products',
    labelKey: 'products',
    routeKey: 'productsZaiko',
    children: [
      {
        id: 'zaiko',
        labelKey: 'zaiko',
        routeKey: 'productsZaiko'
      }
    ]
  },
  {
    id: 'services',
    labelKey: 'services',
    routeKey: 'services'
  },
  {
    id: 'about',
    labelKey: 'about',
    routeKey: 'about'
  },
  {
    id: 'contact',
    labelKey: 'contact',
    routeKey: 'contact'
  }
];

export const footerNavigation: {
  products: NavigationItem[];
  company: NavigationItem[];
  workWithUs: NavigationItem[];
} = {
  products: [
    {
      id: 'zaiko',
      labelKey: 'zaiko',
      routeKey: 'productsZaiko'
    }
  ],
  company: [
    {
      id: 'about',
      labelKey: 'about',
      routeKey: 'about'
    },
    {
      id: 'contact',
      labelKey: 'contact',
      routeKey: 'contact'
    }
  ],
  workWithUs: [
    {
      id: 'services',
      labelKey: 'services',
      routeKey: 'services'
    }
  ]
};
