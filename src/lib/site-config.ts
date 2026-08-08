export function getSiteOrigin(): string {
  const url = process.env.SITE_URL || 'https://venkoi.com';
  return url.replace(/\/+$/, '');
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

