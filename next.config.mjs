import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = withNextIntl({
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    unoptimized: true
  }
});

export default nextConfig;
