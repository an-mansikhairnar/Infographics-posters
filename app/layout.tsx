import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import LayoutWrapper from './components/LayoutWrapper';
import { Toaster } from 'react-hot-toast';
import { COLORS } from './theme';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Infographics Admin Dashboard',
  description: 'Manage, analyze, and generate visual infographics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>

        <Toaster
          position='top-right'
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '8px',
              fontSize: '14px',
            },
            error: {
              style: {
                background: COLORS.error,
                color: COLORS.white,
              },
            },
            success: {
              style: {
                background: COLORS.success,
                color: COLORS.white,
              },
            },
          }}
        />
      </body>
    </html>
  );
}
