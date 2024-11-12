import '@/styles/globals.css';
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from 'geist/font/sans';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import 'react-tooltip/dist/react-tooltip.css';
import 'server-only';
import { AppProviders } from './AppProviders';
import FacebookPixel from './FacebookPixel';

// const satoshiFont = localFont({
//   src: '../fonts/satoshi/Satoshi-Variable.woff2',
//   display: 'swap',
//   variable: '--font-satoshi',
// });

const inter = Inter({
  display: 'swap',
  subsets: ['cyrillic', 'cyrillic-ext', 'latin-ext', 'latin', 'vietnamese'],
  variable: '--font-inter',
});

export const metadata = {
  icons: {
    icon: '/logos/rpd-logo.png',
  },
  title: 'Rapid Product Launcher',
  description: 'Launch ecom products faster than your competitors',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <Analytics />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=AW-16500501224`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16500501224');
          `}
        </Script>
        <FacebookPixel />
      </head>
      <body className="bg-background">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
