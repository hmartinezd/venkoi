export type ServiceInterest =
  | 'mobile'
  | 'web'
  | 'internal_tools'
  | 'workflow_automation'
  | 'integrations'
  | 'operations_software'
  | 'unsure';

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

  if (normalized === 'internal_tools') return 'internal_tools';
  if (normalized === 'workflow_automation') return 'workflow_automation';
  if (normalized === 'integrations') return 'integrations';
  if (normalized === 'operations_software') return 'operations_software';

  return '';
}
