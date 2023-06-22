'use client';
import { Anchor } from '@/components/Anchor';
import { PageHeading } from '@/components/presentational/tailwind/PageHeading/PageHeading';
import moment from 'moment';
import {
  InitialOrganizationListType,
  useCreateOrganizationMutation,
  useOrganizationsList,
} from '@/utils/react-query-hooks';
import { CreateOrganizationDialog } from '@/components/presentational/tailwind/CreateOrganizationDialog';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import TableCell from '@/components/ui/Table/TableCell';
import TableHeader from '@/components/ui/Table/TableHeader';
import { OrganizationGraphs } from './OrganizationGraphs';

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
      <div className="space-y-2">
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
        <p className="text-base font-[500] text-slate-600 w-[480px]">
          Organizations are the central unit of work. Each has a team and a
          unique Stripe plan. Customize the database models and add spaces with
          members to an organization.
        </p>
      </div>
      <table className="w-full shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="p-0">
              <TableHeader>#</TableHeader>
            </th>
            <th scope="col" className="p-0">
              <TableHeader>Title</TableHeader>
            </th>
            <th scope="col" className="p-0">
              <TableHeader>Members</TableHeader>
            </th>
            <th scope="col" className="p-0">
              <TableHeader>Created At</TableHeader>
            </th>
            <th scope="col" className="p-0">
              <TableHeader> Owner</TableHeader>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white ">
          {organizations?.map((organization, index) => {
            const teamMembers = Array.isArray(organization.organization_members)
              ? organization.organization_members
              : [];
            const teamMembersCount = teamMembers.length;
            const owner = teamMembers.find(
              (member) => member.member_role === 'owner'
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
              <tr key={organization.id} className="text-sm">
                <td className="p-0">
                  <TableCell classname="px-6 py-4">{index + 1}</TableCell>
                </td>
                <td className="p-0">
                  <Anchor
                    className=" "
                    key={organization.id}
                    href={`/organization/${organization.id}`}
                  >
                    <TableCell classname="text-blue-500 px-6 py-4 truncate font-[500] hover:underline">
                      {organization.title}
                    </TableCell>
                  </Anchor>
                </td>
                <td className="p-0">
                  <TableCell classname="px-6 py-4">
                    {teamMembersCount} members
                  </TableCell>
                </td>
                <td className="p-0">
                  <TableCell classname="px-6 py-4">
                    {moment(organization.created_at).fromNow()}
                  </TableCell>
                </td>
                <td className="p-0">
                  <TableCell classname="px-6 py-4">
                    {ownerUserProfile.full_name}
                  </TableCell>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <OrganizationGraphs />
    </div>
  );
}
