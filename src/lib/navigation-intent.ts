import { type RouteKey } from '@/i18n/routing';
import { normalizeServiceInterest } from './services';
import { isDemoEnabledProduct } from './products';

/**
 * Validates and filters search parameters to preserve only recognized
 * application intent during navigation or locale switching.
 *
 * It prevents arbitrary query parameters (like UTMs or random values)
 * from being carried across locale switches.
 */
export function getSafeLocalizedIntentQuery(
  routeKey: RouteKey,
  searchParams: URLSearchParams
): URLSearchParams {
  const safeParams = new URLSearchParams();

  if (routeKey === 'contact') {
    const type = searchParams.get('type');
    const interest = searchParams.get('interest');

    // Canonical service type is 'services'
    if (type === 'services' || type === 'custom-software') {
      safeParams.set('type', 'services');
    }

    const normalizedInterest = normalizeServiceInterest(interest);
    if (normalizedInterest) {
      safeParams.set('interest', normalizedInterest);
    }
  }

  if (routeKey === 'demo') {
    const product = searchParams.get('product');
    const interest = searchParams.get('interest');

    if (product && isDemoEnabledProduct(product)) {
      safeParams.set('product', product);
    }

    if (interest === 'early-access') {
      safeParams.set('interest', 'early-access');
    }
  }

  return safeParams;
}
