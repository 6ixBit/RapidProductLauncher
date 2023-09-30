import { DynamicLayoutProviders } from './DynamicLayoutProviders';
import { errors } from '@/utils/errors';
import { AppSupabaseClient } from '@/types';
import { createSupabaseUserServerComponentClient } from '@/supabase-clients/user/supabaseUserServerComponentClient';

// do not cache this layout
export const dynamic = 'force-dynamic';
export const fetchCache = 'only-no-store';
export const revalidate = 0;

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
  const supabaseClient = createSupabaseUserServerComponentClient();
  const session = await fetchSession(supabaseClient);
  return (
    <DynamicLayoutProviders initialSession={session}>
      {children}
    </DynamicLayoutProviders>
  );
}
