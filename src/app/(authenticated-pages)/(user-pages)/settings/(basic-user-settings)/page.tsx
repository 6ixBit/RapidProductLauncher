import { supabaseUserServerComponentClient } from '@/supabase-clients/user/supabaseUserServerComponentClient';
import { AccountSettings } from './AccountSettings';
import { withBaseTitle, withBaseDescription } from '@/utils/seo';

import { errors } from '@/utils/errors';

import { getUserProfile } from '@/utils/supabase-queries';

export const metadata = {
  title: withBaseTitle('Account Settings'),
  description: withBaseDescription('user account settings of Nextbase Essentail version'),
  
}

export default async function AccountSettingsPage() {
  const { data, error } =
    await supabaseUserServerComponentClient.auth.getUser();
  if (error) {
    errors.add(error);
    return <p>Error: An error occurred.</p>;
  }
  if (!data.user) {
    // This is unreachable because the user is authenticated
    // But we need to check for it anyway for TypeScript.
    return <p>No user</p>;
  }
  const userProfile = await getUserProfile(
    supabaseUserServerComponentClient,
    data.user.id
  );

  return <AccountSettings userProfile={userProfile} />;
}
