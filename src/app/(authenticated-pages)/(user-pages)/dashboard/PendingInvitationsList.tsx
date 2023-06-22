'use client';
import { Button } from '@/components/ui/Button';
import { T } from '@/components/ui/Typography';
import { Enum, UnwrapPromise } from '@/types';
import { toSiteURL } from '@/utils/helpers';
import { useGetUserPendingInvitations } from '@/utils/react-queries/invitations';
import { getUserPendingInvitationsByEmail } from '@/utils/supabase/invitations';

const PendingInvitationsTable = ({
  pendingInvitationsList,
}: {
  pendingInvitationsList: Array<{
    id: string;
    inviterUserFullName: string;
    organizationTitle: string;
    status: string;
    acceptURL: string;
    declineURL: string;
    role: Enum<'organization_member_role'>;
  }>;
}) => {
  return (
    <div className="space-y-2">
      <T.Subtle>
        You have {pendingInvitationsList.length} pending invitations
      </T.Subtle>
      <table className="w-full divide-y divide-gray-300 shadow rounded-sm">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              #
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Invited By
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Organization Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ROLE
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pendingInvitationsList.map((invitation, index) => (
            <tr key={invitation.id} className="text-sm">
              <td className="px-6 py-4 whitespace-nowrap ">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-left">
                <div className="text-sm text-gray-900">
                  {invitation.inviterUserFullName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {invitation.organizationTitle}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 uppercase">
                  {invitation.role}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <Button
                    size="xs"
                    variant="success"
                    onClick={() =>
                      (window.location.href = invitation.acceptURL)
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={() =>
                      (window.location.href = invitation.declineURL)
                    }
                  >
                    Decline
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const PendingInvitationsList = ({
  initialPendingInvitationsList,
}: {
  initialPendingInvitationsList: UnwrapPromise<
    ReturnType<typeof getUserPendingInvitationsByEmail>
  >;
}) => {
  const { data, isLoading } = useGetUserPendingInvitations(
    initialPendingInvitationsList
  );
  if (isLoading || !data) return <div>Loading...</div>;
  if (data.length === 0) return null;

  const filteredData = data.filter((invitation) => {
    return Boolean(invitation.organization) && Boolean(invitation.inviter);
  });

  const pendingInvitationsList = filteredData
    .map((invitation) => {
      const inviter = Array.isArray(invitation.inviter)
        ? invitation.inviter[0]
        : invitation.inviter;
      const organization = Array.isArray(invitation.organization)
        ? invitation.organization[0]
        : invitation.organization;
      if (!organization || !inviter) {
        throw new Error('Organization or Inviter not found');
      }
      return {
        id: invitation.id,
        inviterUserFullName: inviter.full_name ?? invitation.invitee_user_email,
        organizationTitle: organization.title,
        status: invitation.status,
        role: invitation.invitee_organization_role,
        acceptURL: toSiteURL(`/api/invitations/accept/${invitation.id}`),
        declineURL: toSiteURL(`/api/invitations/decline/${invitation.id}`),
      };
    })
    .filter(Boolean);
  return (
    <div className="space-y-2">
      <T.H2>Pending Invitations</T.H2>
      <PendingInvitationsTable
        pendingInvitationsList={pendingInvitationsList}
      />
    </div>
  );
};
