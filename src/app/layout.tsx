import 'server-only';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import '@/styles/prosemirror.css';
import 'react-tooltip/dist/react-tooltip.css';
import { AppProviders } from './AppProviders';
import localFont from 'next/font/local';
import { GeistSans } from 'geist/font/sans';

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
    icon: '/images/logo-black-main.ico',
  },
  title: 'Nextbase Ultimate',
  description: 'Nextbase Ultimate',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head></head>
      <body className="bg-white dark:bg-slate-900">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
