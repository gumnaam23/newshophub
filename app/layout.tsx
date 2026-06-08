import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './providers/AuthProvider';
import Link from 'next/link';



export const metadata: Metadata = {
  title: 'E-Commerce Store',
  description: 'Your one-stop shop for everything',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className="font-sans antialiased">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}