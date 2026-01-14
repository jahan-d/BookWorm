import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'BookWorm | Your Digital Reading Companion',
    template: '%s | BookWorm'
  },
  description: 'Track your reading progress, set annual goals, and connect with a community of readers on BookWorm.',
  keywords: ['reading tracker', 'books', 'reading goals', 'literary social network', 'book reviews'],
  authors: [{ name: 'Jahan', url: 'https://jahan-d.web.app' }],
  creator: 'Jahan',
  metadataBase: new URL('https://bookewormclient.vercel.app'),
  openGraph: {
    title: 'BookWorm | Your Digital Reading Companion',
    description: 'The ultimate MERN-stack reading ecosystem for bibliophiles.',
    url: 'https://bookewormclient.vercel.app',
    siteName: 'BookWorm',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookWorm',
    description: 'Track your reading progress and connect with readers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import RouteGuard from '@/components/auth/RouteGuard';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <RouteGuard>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </RouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
