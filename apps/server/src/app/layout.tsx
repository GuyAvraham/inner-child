import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '~/styles/globals.css';

import { headers } from 'next/headers';
import { ClerkProvider } from '@clerk/nextjs';

import { TRPCReactProvider } from './providers';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Inner Child',
  description: 'Get in touch with your inner self',
  openGraph: {
    title: 'Inner Child',
    description: 'Get in touch with your inner self',
    url: 'https://inner-child-server.vercel.app',
    siteName: 'Inner Child',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lanky_johnny',
    creator: '@lanky_johnny',
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={['font-sans', fontSans.variable].join(' ')}>
          <TRPCReactProvider headers={headers()}>
            {props.children}
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
