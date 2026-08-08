import { localizedRoutes } from './routing';

export type NavigationChild = {
  id: string;
  labelKey: string;
  routeKey: keyof typeof localizedRoutes;
};

export type NavigationItem = {
  id: string;
  labelKey: string;
  routeKey: keyof typeof localizedRoutes;
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
    id: 'customSoftware',
    labelKey: 'customSoftware',
    routeKey: 'customSoftware'
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

export const footerNavigation = {
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
      id: 'customSoftware',
      labelKey: 'customSoftware',
      routeKey: 'customSoftware'
    }
  ]
};
