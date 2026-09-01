/** @type {import('next').NextConfig} */
const nextConfig = {
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: '/frontend-api/:path*'
    //         }
    //     ];
    // },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.infographicsposters.com',
                pathname: '/**'
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5173'
            }
        ]
    }
};

module.exports = nextConfig;
