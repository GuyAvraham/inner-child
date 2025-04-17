import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '~/styles/globals.css';

import { headers } from 'next/headers';
import Image from 'next/image';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import clsx from 'clsx';

import BGSVG from '~/svg/BGSVG';
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
    url: 'https://inner-child-server-one.vercel.app',
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
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={clsx('flex h-screen flex-col font-sans', fontSans.variable)}>
          {/* This is web console, to test on mobile */}
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
          <TRPCReactProvider headers={headers()}>{props.children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
