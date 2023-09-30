import { AppSupabaseClient } from '@/types';
import { getUserPendingInvitationsByEmail } from '@/utils/supabase/invitations';
import { PendingInvitationsList } from './PendingInvitationsList';
import { createSupabaseUserServerComponentClient } from '@/supabase-clients/user/supabaseUserServerComponentClient';

const fetchData = async (supabaseClient: AppSupabaseClient) => {
  const session = await supabaseClient.auth.getSession();
  const user = session?.data.session?.user;
  if (!user) throw new Error('No user found');
  const [pendingInvitations] = await Promise.all([
    user.email
      ? getUserPendingInvitationsByEmail(supabaseClient, user.email)
      : getUserPendingInvitationsByEmail(supabaseClient, user.id),
  ]);
  return { pendingInvitations };
};

export default async function DashboardPage() {
  const supabaseClient = createSupabaseUserServerComponentClient();
  const { pendingInvitations } = await fetchData(supabaseClient);
  return (
    <div className="space-y-8">
      <PendingInvitationsList
        initialPendingInvitationsList={pendingInvitations}
      />
    </div>
  );
}
