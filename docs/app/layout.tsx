import './global.css';
import { cn } from '@/lib/utils';
import { RootProvider } from 'fumadocs-ui/provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WebGL Fluid Enhanced',
  description:
    'WebGL Fluid Simulation for modern webpages (works even on mobile).',
  authors: [
    { name: 'Michael Brusegard', url: 'https://www.michaelbrusegard.com' },
  ],
  creator: 'Michael Brusegard',
  icons: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
  ],
  keywords: [
    'webgl',
    'background',
    'navier-strokes',
    'fluid-simulation',
    'es-module',
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang='en'
      className={cn('size-full', inter.className)}
      suppressHydrationWarning
    >
      <body className='size-full'>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
