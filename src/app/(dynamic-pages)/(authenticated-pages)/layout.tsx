import { ClientLayout } from './ClientLayout';
import { AppSupabaseClient } from '@/types';
import { User } from '@supabase/supabase-js';
import { getUserProfile } from '@/utils/supabase-queries';
import { errors } from '@/utils/errors';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseUserServerComponentClient } from '@/supabase-clients/user/supabaseUserServerComponentClient';

// do not cache this layout
export const dynamic = 'force-dynamic';
export const fetchCache = 'only-no-store';

async function fetchData(supabaseClient: AppSupabaseClient, authUser: User) {
  const [userProfile] = await Promise.all([
    getUserProfile(supabaseClient, authUser.id),
  ]);

  return { userProfile };
}

export default async function Layout({ children }: { children: ReactNode }) {
  const supabaseClient = createSupabaseUserServerComponentClient();
  const { data, error } = await supabaseClient.auth.getUser();

  if (!data.user) {
    // This is unreachable because the user is authenticated
    // But we need to check for it anyway for TypeScript.
    return redirect('/check-auth');
  } else if (error) {
    return <p>Error: An error occurred.</p>;
  }

  try {
    const { userProfile } = await fetchData(supabaseClient, data.user);

    return <ClientLayout userProfile={userProfile}>{children}</ClientLayout>;
  } catch (fetchDataError) {
    errors.add(fetchDataError);
    return <p>Error: An error occurred.</p>;
  }
}
