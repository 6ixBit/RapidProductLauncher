import 'server-only';
import './globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import AppProviders from './AppProviders';
import localFont from 'next/font/local';

const satoshiFont = localFont({
  src: '../fonts/satoshi/Satoshi-Variable.woff2',
  display: 'swap',
  variable: '--font-satoshi',
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
    <html lang="en" className={satoshiFont.variable} suppressHydrationWarning>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head></head>
      <body className="bg-white dark:bg-gray-900/20">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
