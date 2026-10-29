import type { Product } from './products';
import { isEarlyAccessInterest } from './products';

export type DemoIntent = 'demo' | 'early-access';

export function resolveDemoIntent(
  product: Pick<Product, 'earlyAccess'>,
  interest: string | string[] | undefined
): DemoIntent {
  return isEarlyAccessInterest(product, interest) ? 'early-access' : 'demo';
}

export function isEarlyAccessIntent(intent: DemoIntent): intent is 'early-access' {
  return intent === 'early-access';
}
