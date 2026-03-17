/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'i.ibb.co',
      'scontent.fotp8-1.fna.fbcdn.net',
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:8003/:path*',
      },
      {
        source: '/api/files/:path*',
        destination: 'http://localhost:8001/files/:path*',
      },
      {
        source: '/api/search/:path*',
        destination: 'http://localhost:8002/search/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
