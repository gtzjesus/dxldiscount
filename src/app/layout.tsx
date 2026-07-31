import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
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
    <ClerkProvider
      localization={{
        signUp: {
          start: {
            title: 'HELLO USER',
            subtitle: 'Enter the Forge.',
            actionText: 'Already an Iron?',
            actionLink: 'Authenticate',
          },
        },
        signIn: {
          start: {
            title: 'AUTHENTICATE, USER',
            subtitle:
              'Fully Access your iron dashboard. Enter your credentials.',
            actionText: 'New to the forge?',
            actionLink: 'Become Iron',
          },
        },
      }}
      appearance={{
        elements: {
          card: 'bg-[#121212] border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-[#ededed]',
          modalContent: 'p-0',
          footer: 'hidden',
          'clerk-branding': 'hidden',
          headerTitle: 'text-[#F1C232] font-black italic uppercase tracking-tighter text-2xl',
          headerSubtitle: 'text-zinc-400 italic font-mono text-[10px] uppercase tracking-widest',
          formButtonPrimary: 'bg-[#F1C232] !text-black font-black uppercase italic transition-all py-3 shadow-md hover:bg-[#F1C232]/90 active:scale-[0.98]',
          formFieldLabel: 'text-zinc-400 font-mono text-[10px] uppercase tracking-widest mb-1 font-bold italic',
          formFieldInput: 'bg-black border border-zinc-800 text-[#F1C232] focus:border-[#F1C232]/50 transition-all py-3 px-4 italic [appearance:textfield]',
          footerActionLink: 'text-[#F1C232] font-mono text-[10px] font-black underline decoration-2 uppercase hover:text-[#F1C232]/80',
          footerActionText: 'text-zinc-500 font-mono text-[10px] uppercase italic',
          identityPreviewText: 'text-[#F1C232] font-mono font-bold uppercase italic',
          identityPreviewEditButtonIcon: 'text-[#F1C232]',
        },
      }}
    >
      <html lang="en" className="bg-[#121212]">
        <head>
          <meta name="theme-color" content="#121212" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body className="bg-[#121212] text-white antialiased selection:bg-[#F1C232] selection:text-black">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}