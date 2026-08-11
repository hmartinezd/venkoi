export const DEFAULT_SITE_ORIGIN = 'https://venkoi.com';
export const PRIVACY_CONTACT_EMAIL = 'privacy@venkoi.com';

const UNSAFE_URL_CHARACTERS = /[\s\u0000-\u001f\u007f-\u009f]/u;

export function normalizeSiteOrigin(value: string | undefined): string | undefined {
  if (!value || UNSAFE_URL_CHARACTERS.test(value)) {
    return undefined;
  }

  try {
    const url = new URL(value);

    if (
      url.protocol !== 'https:' ||
      !url.hostname ||
      url.username ||
      url.password ||
      url.pathname !== '/' ||
      url.search ||
      url.hash
    ) {
      return undefined;
    }

    return url.origin;
  } catch {
    return undefined;
  }
}

export function getSiteOrigin(): string {
  return normalizeSiteOrigin(process.env.SITE_URL) ?? DEFAULT_SITE_ORIGIN;
}

export function isProductionEnv(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;

  if (vercelEnv) {
    return vercelEnv === 'production';
  }

  return process.env.NODE_ENV === 'production';
}

export function isPreviewEnv(): boolean {
  return process.env.VERCEL_ENV === 'preview';
}

export function isDeployedEnv(): boolean {
  return isProductionEnv() || isPreviewEnv();
}
