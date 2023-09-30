'use client';
import { Anchor } from '@/components/Anchor';
import { PageHeading } from '@/components/presentational/tailwind/PageHeading/PageHeading';
import moment from 'moment';
import {
  InitialOrganizationListType,
  useCreateOrganizationMutation,
  useOrganizationsList,
} from '@/utils/react-query-hooks';
import { T } from '@/components/ui/Typography';
import { CreateOrganizationDialog } from '@/components/presentational/tailwind/CreateOrganizationDialog';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table/ShadcnTable';
import { OrganizationGraphs } from './OrganizationGraphs';
import { cn } from '@/utils/cn';

export function OrganizationList({
  initialOrganizationsList,
}: {
  initialOrganizationsList: InitialOrganizationListType;
}) {
  const { data: organizations, isLoading: isLoadingOrganizations } =
    useOrganizationsList(initialOrganizationsList);
  const router = useRouter();
  const { mutate, isLoading: isCreatingOrganization } =
    useCreateOrganizationMutation({
      onSuccess: (organization) => {
        router.push(`/organization/${organization.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const onConfirm = (organizationTitle: string) => {
    mutate(organizationTitle);
  };
  if (isLoadingOrganizations) return <div>Loading...</div>;
  return (
    <div className="space-y-10 mb-10">
      <div>
        <PageHeading
          actions={
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <CreateOrganizationDialog
                isLoading={isCreatingOrganization}
                onConfirm={onConfirm}
              />
            </div>
          }
          title="Organizations"
        />
        <T.P className={cn('w-[480px] text-muted-foreground leading-6')}>
          Organizations are a core part of Nextbase. Each organization can have
          as many members as needed and a unique Stripe plan.
        </T.P>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <ShadcnTable>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations?.map((organization, index) => {
              const teamMembers = Array.isArray(
                organization.organization_members,
              )
                ? organization.organization_members
                : [];
              const teamMembersCount = teamMembers.length;
              const owner = teamMembers.find(
                (member) => member.member_role === 'owner',
              );
              const ownerUserProfile = Array.isArray(owner?.user_profiles)
                ? owner?.user_profiles[0]
                : owner?.user_profiles;

              if (!ownerUserProfile) {
                // THIS IS A HACK
                // User profile will always be there
                throw new Error('Owner user profile not found');
              }

              return (
                <TableRow key={organization.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Anchor
                      className=" font-medium underline underline-offset-4 "
                      key={organization.id}
                      href={`/organization/${organization.id}`}
                    >
                      {organization.title}
                    </Anchor>
                  </TableCell>
                  <TableCell>{teamMembersCount} members</TableCell>
                  <TableCell>
                    {moment(organization.created_at).fromNow()}
                  </TableCell>
                  <TableCell>{ownerUserProfile.full_name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </ShadcnTable>
      </div>

      <OrganizationGraphs />
    </div>
  );
}
