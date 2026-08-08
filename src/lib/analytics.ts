import { track } from '@vercel/analytics';

export type AnalyticsEventName =
  | 'zaiko_demo_cta'
  | 'zaiko_early_access_cta'
  | 'custom_software_cta'
  | 'demo_form_start'
  | 'demo_form_submit'
  | 'demo_form_success'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'contact_form_success'
  | 'language_switch';

export type SafeAnalyticsProperties = {
  locale?: string;
  product?: string;
  source?: string;
  earlyAccess?: boolean;
  leadType?: string;
};

/**
 * Safely track non-PII conversion and interaction events.
 * Wraps @vercel/analytics track() in try/catch to ensure analytics failures
 * never block form submissions, navigation, or application flows.
 */
export function trackCustomEvent(
  eventName: AnalyticsEventName,
  properties?: SafeAnalyticsProperties
): void {
  try {
    // Sanitize properties to explicitly prevent any accidental PII leak
    const safeProps: Record<string, string | boolean> = {};

    if (properties?.locale) safeProps.locale = String(properties.locale);
    if (properties?.product) safeProps.product = String(properties.product);
    if (properties?.source) safeProps.source = String(properties.source);
    if (typeof properties?.earlyAccess === 'boolean') safeProps.earlyAccess = properties.earlyAccess;
    if (properties?.leadType) safeProps.leadType = String(properties.leadType);

    track(eventName, safeProps);
  } catch (err) {
    // Silently handle analytics failures (e.g. adblockers, tier limitations)
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Analytics] Track event '${eventName}' skipped:`, err);
    }
  }
}
