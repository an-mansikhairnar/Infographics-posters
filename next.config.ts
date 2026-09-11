// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'www.infographicsposters.com',
//       },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'beta.infographicsposters.com'
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

export default nextConfig;
