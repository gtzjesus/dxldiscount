import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import BottomNav from '@/components/layout/BottomNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'THE FORGE | Iron Store',
  description: 'Built with Next.js, Clerk, Sanity, and Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-[#121212]">
        <head>
          <meta name="theme-color" content="#121212" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body className="bg-[#121212] text-white antialiased selection:bg-[#F1C232] selection:text-black">
          {children}
          <BottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}