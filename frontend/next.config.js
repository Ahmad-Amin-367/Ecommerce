/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API requests to backend server to avoid cross-site cookie restrictions
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || 'https://ecommerce-ha7z.onrender.com';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl.replace(/\/+$/, '')}/api/:path*`,
      },
    ];
  },

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
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'ShopZone',
  },

  // Strict mode for catching bugs early
  reactStrictMode: true,

  transpilePackages: ['@tanstack/react-query'],
};

module.exports = nextConfig;
