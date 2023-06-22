'use client';
import { Anchor } from '@/components/Anchor';
import { T } from '@/components/ui/Typography';
import { Table } from '@/types';
import { useOrganizationContext } from '@/contexts/OrganizationContext';
import { useGetTeamsInOrganization } from '@/utils/react-queries/teams';

export const OrganizationTeams = ({
  initialTeams,
}: {
  initialTeams: Table<'teams'>[];
}) => {
  const { organizationId } = useOrganizationContext();
  const { data: teams } = useGetTeamsInOrganization(
    organizationId,
    initialTeams
  );
  if (!teams) {
    return null;
  }
  return (
    <div className="bg-gray-100 py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <T.H2>Teams</T.H2>
            <p className="mt-2 text-sm text-gray-700">A list of all teams.</p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Row
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Team Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {teams.map((team, index) => (
                      <tr key={team.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-blue-500">
                          <Anchor
                            href={`/organization/${organizationId}/team/${team.id}`}
                          >
                            {team.name}
                          </Anchor>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
