import { getAllOrganizationsForUser } from '@/utils/supabase-queries';
import { OrganizationList } from './OrganizationList';
import { AppSupabaseClient } from '@/types';
import { getUserPendingInvitationsByEmail } from '@/utils/supabase/invitations';
import { createSupabaseUserServerComponentClient } from '@/supabase-clients/user/supabaseUserServerComponentClient';
import { Anchor } from '@/components/Anchor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import InfoIcon from 'lucide-react/dist/esm/icons/info';

import { withBaseTitle, withBaseDescription } from '@/utils/seo';

export const metadata = {
  title: withBaseTitle('Dashboard'),
  description: withBaseDescription('dahsboard of Nextbase Essentail version'),
};

const fetchData = async (supabaseClient: AppSupabaseClient) => {
  const session = await supabaseClient.auth.getSession();
  const user = session?.data.session?.user;
  if (!user) throw new Error('No user found');
  const [initialOrganizationsList, pendingInvitations] = await Promise.all([
    getAllOrganizationsForUser(supabaseClient, user.id),
    user.email
      ? getUserPendingInvitationsByEmail(supabaseClient, user.email)
      : getUserPendingInvitationsByEmail(supabaseClient, user.id),
  ]);
  return { initialOrganizationsList, pendingInvitations };
};

export default async function DashboardPage() {
  const supabaseClient = createSupabaseUserServerComponentClient();
  const { initialOrganizationsList, pendingInvitations } = await fetchData(
    supabaseClient
  );
  return (
    <div className="space-y-8">
      {pendingInvitations.length > 0 ? (
        <Anchor href="/invitations" className="cursor-pointer">
          <Alert variant="default">
            <InfoIcon className="h-4 w-4 mt-1" />
            <AlertTitle>Pending Invitations</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              You have{' '}
              <span className="font-bold text-muted-foreground">
                {pendingInvitations.length}
              </span>{' '}
              pending invitation{pendingInvitations.length > 1 ? 's' : ''}.
              Accept the invitation to join the organization.
            </AlertDescription>
          </Alert>
        </Anchor>
      ) : null}
      <OrganizationList initialOrganizationsList={initialOrganizationsList} />
    </div>
  );
}
