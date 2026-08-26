import { Roboto } from 'next/font/google';
import './globals.css';
import Navbar from './component/Navbar/Navbar';
import CategoriesSidebar from './component/CategoriesSidebar/CategoriesSidebar';
import { Suspense } from 'react';
import { LoadingProvider } from './context/loader';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { siteMetadata, siteOpenGraph } from './constants/metadata';
// import { ADSENSE_CLIENT_ID } from './constants/ads';

export const viewport: Viewport = {
  themeColor: '#1976d2',
};

export const metadata: Metadata = {
  title: 'Infographics Posters',
  description:
    'Extensive selection of well-designed infographics posters based on various topics from fashion, politics, entertainment, health, business to technology and others',
  keywords: siteMetadata.defaultKeywords,
  openGraph: {
    ...siteOpenGraph,
    title: 'Home',
    description:
      siteMetadata.defaultDescription,
    url: siteMetadata.siteUrl,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  other: {
    'fb:app_id': '412331035483201',
    'my:fb': 'on',
    'my:google': 'on',
    'my:tw': 'on',
    'my:in': 'on',
    'my:pint': 'on',
    HandheldFriendly: 'true',
    'apple-touch-fullscreen': 'YES',
  },
};
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang='en'>
        <body>
          <LoadingProvider>
            <Suspense fallback={null}>
              <Navbar />

              <div className='flex'>
                <CategoriesSidebar />
                <div className='flex-1'>{children}</div>
              </div>
            </Suspense>
          </LoadingProvider>
        </body>
        <Script
          async
          strategy='afterInteractive'
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin='anonymous'
        />
      </html>
    </>
  );
}