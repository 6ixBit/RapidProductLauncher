import { AppSupabaseClient } from '@/types';
import { getOrganizationById } from '@/utils/supabase-queries';
import { EditOrganizationForm } from './EditOrganizationForm';
import { supabaseUserServerComponentClient } from '@/supabase-clients/user/supabaseUserServerComponentClient';

async function fetchData(
  supabaseClient: AppSupabaseClient,
  organizationId: string
) {
  return await getOrganizationById(supabaseClient, organizationId);
}

export default async function EditOrganizationPage({
  params,
}: {
  params: {
    organizationId: string;
  };
}) {
  const { organizationId } = params;
  const organization = await fetchData(
    supabaseUserServerComponentClient,
    organizationId
  );
  return <EditOrganizationForm initialTitle={organization.title} />;
}
