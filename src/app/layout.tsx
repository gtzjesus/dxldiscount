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
    <ClerkProvider
      localization={{
        signUp: {
          start: {
            title: 'JOIN DXL DISCOUNTS',
            subtitle: 'Access exclusive deals on premium pre-owned gear.',
            actionText: 'Already a member?',
            actionLink: 'Sign In',
          },
        },
        signIn: {
          start: {
            title: 'MEMBER SIGN IN',
            subtitle: 'Access your account, track orders, and save on top items.',
            actionText: 'New to DXL Discounts?',
            actionLink: 'Create Account',
          },
        },
      }}
      appearance={{
        variables: {
          colorPrimary: '#2563eb', // Clean e-commerce blue accent
          colorBackground: '#090a0f', // Deep dark slate background
          colorText: '#f3f4f6', // Crisp light gray text
          colorInputBackground: '#111827', // Slate input background
          colorInputText: '#60a5fa', // Bright blue input text
          borderRadius: '0.5rem', // Modern rounded corners
        },
        elements: {
          card: 'bg-[#0f172a] border border-slate-800 shadow-2xl',
          modalContent: 'p-0',
          footer: 'hidden',
          'clerk-branding': 'hidden',
          headerTitle: 'text-white font-bold tracking-tight text-2xl',
          headerSubtitle: 'text-slate-400 font-sans text-xs',
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-500 !text-white font-semibold transition-all py-3 shadow-lg active:scale-[0.98]',
          formFieldLabel: 'text-slate-300 font-sans text-xs font-medium mb-1',
          formFieldInput: 'bg-slate-900 border border-slate-800 text-blue-400 focus:border-blue-500 transition-all py-3 px-4 [appearance:textfield]',
          footerActionLink: 'text-blue-400 font-sans text-xs font-semibold hover:text-blue-300',
          footerActionText: 'text-slate-400 font-sans text-xs',
          identityPreviewText: 'text-blue-400 font-sans font-medium',
          identityPreviewEditButtonIcon: 'text-blue-400',
        },
      }}
    >
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