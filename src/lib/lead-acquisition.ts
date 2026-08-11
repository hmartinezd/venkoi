export type LeadAcquisitionContext = {
  source_path: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
};

export function normalizeExternalReferrer(referrer: string, currentOrigin: string): string {
  const candidate = referrer.trim();
  if (!candidate) return '';

  try {
    const url = new URL(candidate);
    const origin = new URL(currentOrigin).origin;
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || url.origin === origin) return '';
    return `${url.origin}${url.pathname}`;
  } catch {
    return '';
  }
}

export function getLeadAcquisitionContext({ href, pathname, referrer }: {
  href: string;
  pathname: string;
  referrer: string;
}): LeadAcquisitionContext {
  let currentUrl: URL | null = null;
  try {
    currentUrl = new URL(href);
  } catch {
    // Preserve the submission route if browser URL context is unavailable.
  }

  return {
    source_path: pathname,
    referrer: currentUrl ? normalizeExternalReferrer(referrer, currentUrl.origin) : '',
    utm_source: currentUrl?.searchParams.get('utm_source') || '',
    utm_medium: currentUrl?.searchParams.get('utm_medium') || '',
    utm_campaign: currentUrl?.searchParams.get('utm_campaign') || '',
    utm_content: currentUrl?.searchParams.get('utm_content') || ''
  };
}
