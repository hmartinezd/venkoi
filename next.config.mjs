import createNextIntlPlugin from 'next-intl/plugin';
import { withBotId } from 'botid/next/config';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = withNextIntl({
  reactStrictMode: true,
  typedRoutes: true,
  async redirects() {
    return [
      {
        source: '/en/custom-software',
        destination: '/en/services',
        permanent: true
      },
      {
        source: '/es/software-a-medida',
        destination: '/es/servicios',
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ];
  }
});

export default withBotId(nextConfig);
