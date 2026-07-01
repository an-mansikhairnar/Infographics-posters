// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
// images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'www.infographicsposters.com',
//       },
//     ],
//   },
// };

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.infographicsposters.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.infographicsposters.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;