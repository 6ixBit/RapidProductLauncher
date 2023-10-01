import 'server-only';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import AppProviders from './AppProviders';
import localFont from 'next/font/local';

// const satoshiFont = localFont({
//   src: '../fonts/satoshi/Satoshi-Variable.woff2',
//   display: 'swap',
//   subsets: ['cyrillic', 'cyrillic-ext', 'latin-ext', 'latin', 'vietnamese'],
//   variable: '--font-inter',
// });

const inter = Inter({
  display: 'swap',
  subsets: ['cyrillic', 'cyrillic-ext', 'latin-ext', 'latin', 'vietnamese'],
  variable: '--font-inter',
});

export const metadata = {
  icons: {
    icon: '/images/logo-black-main.ico',
  },
  title:
    'NextBase | Premium Next.js 13, Supabase, Typescript SAAS boilerplate. | Essential',
  description: 'Nextbase Essential',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head></head>
      <body className="bg-white dark:bg-slate-900">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
