import 'server-only';
import './globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import createClient from '@/utils/supabase-server';
import AppProviders from './AppProviders';
import { errors } from '@/utils/errors';
import { AppSupabaseClient } from '@/types';
import localFont from 'next/font/local';

const satoshiFont = localFont({
  src: '../fonts/satoshi/Satoshi-Variable.woff2',
  display: 'swap',
  variable: '--font-satoshi',
});

async function fetchSession(supabaseClient: AppSupabaseClient) {
  // This is a server-side call, so it will not trigger a revalidation
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    errors.add(error);
  }

  return session;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const [session] = await Promise.all([fetchSession(supabase)]);
  return (
    <html lang="en" className={satoshiFont.variable}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head></head>
      <body>
        <AppProviders initialSession={session}>{children}</AppProviders>
      </body>
    </html>
  );
}
