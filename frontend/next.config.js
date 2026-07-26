/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from external sources (add your domains here when needed)
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

  // Enable experimental features as needed
  experimental: {
    // serverActions: true, // Uncomment if using Server Actions
  },
};

module.exports = nextConfig;
