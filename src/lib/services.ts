export type ServiceInterest = 'mobile' | 'web' | 'unsure';

/**
 * Normalizes a service interest value from query parameters or form inputs.
 * Maps legacy or alias values to canonical categories.
 */
export function normalizeServiceInterest(value: unknown): ServiceInterest | '' {
  if (typeof value !== 'string') return '';

  const normalized = value.trim().toLowerCase();

  if (normalized === 'mobile') return 'mobile';

  if (
    normalized === 'web' ||
    normalized === 'website' ||
    normalized === 'web_application'
  ) {
    return 'web';
  }

  if (normalized === 'unsure') return 'unsure';

  return '';
}
