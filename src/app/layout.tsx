import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import BottomNav from '@/components/layout/BottomNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'DXL Discounts | Premium Open-Box & Used Goods',
  description: 'Your trusted source for discounted premium items, home goods, and electronics, used like new.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-[#090a0f]">
        <head>
          <meta name="theme-color" content="#090a0f" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body className="bg-[#090a0f] text-slate-100 antialiased selection:bg-blue-600 selection:text-white pb-16">
          {children}
          <BottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}