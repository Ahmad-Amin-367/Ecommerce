/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'ShopZone',
  },

  // Strict mode for catching bugs early
  reactStrictMode: true,

  transpilePackages: ['@tanstack/react-query'],
};

module.exports = nextConfig;
