export function getSiteOrigin(): string {
  const url = process.env.SITE_URL || 'https://venkoi.com';
  return url.replace(/\/+$/, '');
}

export function isProductionEnv(): boolean {
  return process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
}
