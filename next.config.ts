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
                hostname: 'www.infographicsposters.com'
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5173'
            },
            {
                protocol: 'https',
                hostname: 'images.infographicsposters.com'
            }
        ]
    }
};

export default nextConfig;
