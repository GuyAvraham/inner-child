import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '~/styles/globals.css';

import Image from 'next/image';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

import { cn } from '~/utils/cn';
import BGSVG from '~/svg/BGSVG';
import { TRPCReactProvider } from '~/trpc/react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Future Self',
  description: 'Get in touch with your inner self',
  openGraph: {
    title: 'Future Self',
    description: 'Get in touch with your inner self',
    url: 'https://inner-child-server-one.vercel.app',
    siteName: 'Future Self',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lanky_johnny',
    creator: '@lanky_johnny',
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={cn('flex h-screen flex-col font-sans', inter.variable)}>
          {/* This plugin can allow u to open the inspector in your chrome browser on mobile */}
          {/* We keep it here for future mobile debug */}
          {/* <script src="https://cdn.jsdelivr.net/npm/eruda" />
          <script>eruda.init();</script> */}

          <Image
            src="/bg1.png"
            width={375}
            height={812}
            alt="background"
            className="lef-0 fixed top-0 -z-10 h-full w-full sm:hidden"
          />
          <BGSVG className="lef-0 fixed top-0 -z-10 hidden h-full w-full sm:block" id="bg-image" data-animation="on" />
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
