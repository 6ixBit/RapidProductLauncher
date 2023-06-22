import createClient from '@/utils/supabase-server';
import { getTeamsInOrganization } from '@/utils/supabase/teams';
import { z } from 'zod';
import { OrganizationTeams } from './OrganizationTeams';

async function fetchTeams(organizationId: string) {
  const supabase = createClient();

  return await getTeamsInOrganization(supabase, organizationId);
}

const paramsSchema = z.object({
  organizationId: z.string(),
});

export default async function OrganizationPage({
  params,
}: {
  params: z.infer<typeof paramsSchema>;
}) {
  // Add dashed border
  const { organizationId } = paramsSchema.parse(params);

  const teams = await fetchTeams(organizationId);
  // return (
  //   <div className="border-2 border-blue-500 rounded-md border-dashed h-48 flex justify-center items-center">
  //     <p className="text-sm select-none text-gray-500">
  //       Build something cool here!
  //     </p>
  //   </div>
  // );
  return (
    <div className="space-y-4">
      {teams.length ? (
        <OrganizationTeams initialTeams={teams} />
      ) : (
        <p>No teams</p>
      )}
    </div>
  );
}
