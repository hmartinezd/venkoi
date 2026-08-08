import createNextIntlPlugin from 'next-intl/plugin';
import { withBotId } from 'botid/next/config';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = withNextIntl({
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    unoptimized: true
  }
});

export default withBotId(nextConfig);

