import {
  Bebas_Neue,
  Bricolage_Grotesque,
  Caveat,
  DM_Serif_Display,
  Inter,
  Lora,
  Manrope,
  Montserrat,
  Playfair_Display,
  Poppins,
  Roboto,
  Space_Grotesk,
} from 'next/font/google';
import './globals.css';
import '@/styles/infographic.css';
import { LoadingProvider } from './context/loader';
import { Metadata, Viewport } from 'next';
import { siteMetadata, siteOpenGraph } from './constants/metadata';
import ClientLayout from './component/ClientLayout/ClientLayout';

export const viewport: Viewport = {
  themeColor: '#1976d2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: 'Infographics Posters',
  description:
    'Extensive selection of well-designed infographics posters based on various topics from fashion, politics, entertainment, health, business to technology and others',
  keywords: siteMetadata.defaultKeywords,
  openGraph: {
    ...siteOpenGraph,
    title: 'Home',
    description: siteMetadata.defaultDescription,
    url: siteMetadata.siteUrl,
  },
  other: {
    'fb:app_id': '412331035483201',
    'my:fb': 'on',
    'my:google': 'on',
    'my:tw': 'on',
    'my:in': 'on',
    'my:pint': 'on',
    HandheldFriendly: 'true',
  },
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <LoadingProvider>
          <ClientLayout>{children}</ClientLayout>
        </LoadingProvider>
      </body>
    </html>
  );
}