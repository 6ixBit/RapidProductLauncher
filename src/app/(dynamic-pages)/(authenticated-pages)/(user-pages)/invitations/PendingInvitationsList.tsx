'use client';
import { Button } from '@/components/ui/Button';
import { T } from '@/components/ui/Typography';
import { Enum, UnwrapPromise } from '@/types';
import { toSiteURL } from '@/utils/helpers';
import { useGetUserPendingInvitations } from '@/utils/react-queries/invitations';
import { getUserPendingInvitationsByEmail } from '@/utils/supabase/invitations';
import { useRouter } from 'next/navigation';
import {
  ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table/ShadcnTable';
import { PageHeading } from '@/components/presentational/tailwind/PageHeading';
import CheckIcon from 'lucide-react/dist/esm/icons/check';
import RejectIcon from 'lucide-react/dist/esm/icons/x';

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
  const router = useRouter();

  return (
    <div className="space-y-6">
      <T.P>
        You have{' '}
        <span className="font-bold">{pendingInvitationsList.length}</span>{' '}
        pending invitations
      </T.P>
      <div className="w-full rounded-lg border overflow-hidden">
        <ShadcnTable>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">#</TableHead>
              <TableHead scope="col">Invited By</TableHead>
              <TableHead scope="col">Organization Name</TableHead>
              <TableHead scope="col">ROLE</TableHead>
              <TableHead scope="col">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingInvitationsList.map((invitation, index) => (
              <TableRow key={invitation.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="text-left">
                  {invitation.inviterUserFullName}
                </TableCell>
                <TableCell>{invitation.organizationTitle}</TableCell>
                <TableCell>{invitation.role}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => router.push(invitation.acceptURL)}
                    >
                      <CheckIcon className="mr-2" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(invitation.declineURL)}
                    >
                      <RejectIcon className="mr-2" /> Decline
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ShadcnTable>
      </div>
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
    initialPendingInvitationsList,
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
    <div className="space-y-8">
      <PageHeading
        title="Pending Invitations"
        subTitle="Manage pending invitations here."
      />
      <PendingInvitationsTable
        pendingInvitationsList={pendingInvitationsList}
      />
    </div>
  );
};
