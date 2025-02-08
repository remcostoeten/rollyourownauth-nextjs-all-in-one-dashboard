import { RootProvider } from 'fumadocs-ui/provider';
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { siteConfig } from '../../../packages/core/config/site-config';

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Load JetBrains Mono font
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata = {
  title: {
    default: siteConfig.docs.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.docs.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.docsUrl,
    title: siteConfig.docs.title,
    description: siteConfig.docs.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: siteConfig.twitter.card,
    title: siteConfig.docs.title,
    description: siteConfig.docs.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter.creator,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-light-100 dark:bg-dark-100">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
