/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendOrigin = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5173';

    return [
      { source: '/api/auth/:path*', destination: `${backendOrigin}/api/auth/:path*` },
      { source: '/api/password-reset', destination: `${backendOrigin}/api/password-reset` },
      {
        source: '/api/creator-designs/:path*',
        destination: `${backendOrigin}/api/creator-designs/:path*`,
      },
      {
        source: '/uploads/infographics/:filename',
        destination: `${backendOrigin}/api/client-infographics/uploads/:filename`,
      },
      {
        source: '/images/:path*',
        destination: `${backendOrigin}/images/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'beta.infographicsposters.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3157',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5173',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9082',
      },
      {
        protocol: 'https',
        hostname: 'www.infographicsposters.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: '**.fbsbx.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
    ],
  },
};

module.exports = nextConfig;
