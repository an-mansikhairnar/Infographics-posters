/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const backendOrigin = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5173';

        return [
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
                pathname: '/**'
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3147'
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5173'
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9082'
            },
            {
                protocol: 'https',
                hostname: 'www.infographicsposters.com',
                pathname: '/**'
            },
        ]
    }
};

module.exports = nextConfig;
