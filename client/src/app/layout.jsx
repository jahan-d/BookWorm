import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BookWorm',
  description: 'Your digital reading companion',
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
