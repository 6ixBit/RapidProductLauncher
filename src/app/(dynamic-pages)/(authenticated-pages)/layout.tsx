import { SIDEBAR_VISIBILITY_COOKIE_KEY } from '@/constants';
import { LoggedInUserProvider } from '@/contexts/LoggedInUserContext';
import { SidebarVisibilityProvider } from '@/contexts/SidebarVisibilityContext';
import { getUserProfile } from '@/data/user/user';
import { createSupabaseUserServerComponentClient } from '@/supabase-clients/user/createSupabaseUserServerComponentClient';
import { AppSupabaseClient } from '@/types';
import { errors } from '@/utils/errors';
import { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import { ClientLayout } from './ClientLayout';

function getSidebarVisibility() {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(SIDEBAR_VISIBILITY_COOKIE_KEY)?.value;
  if (cookieValue) {
    return cookieValue === 'true';
  }
  return true;
}

async function fetchData(supabaseClient: AppSupabaseClient, authUser: User) {
  const [userProfile] = await Promise.all([getUserProfile(authUser.id)]);
  return { userProfile };
}

export default async function Layout({ children }: { children: ReactNode }) {
  const supabaseClient = createSupabaseUserServerComponentClient();
  const { data, error } = await supabaseClient.auth.getUser();
  const { user } = data;

  if (!user) {
    // This is unreachable because the user is authenticated
    // But we need to check for it anyway for TypeScript.
    return redirect('/login');
  } else if (error) {
    return <p>Error: An error occurred.</p>;
  }

  try {
    const { userProfile } = await fetchData(supabaseClient, data.user);
    const sidebarVisibility = getSidebarVisibility();
    return (
      <SidebarVisibilityProvider initialValue={sidebarVisibility}>
        <LoggedInUserProvider user={user}>
          <ClientLayout userProfile={userProfile}>{children}</ClientLayout>
        </LoggedInUserProvider>
      </SidebarVisibilityProvider>
    );
  } catch (fetchDataError) {
    errors.add(fetchDataError);
    return <p>Error: An error occurred.</p>;
  }
}
