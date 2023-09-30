import { AppSupabaseClient } from '@/types';
import { getOrganizationById } from '@/utils/supabase-queries';
import { EditOrganizationForm } from './EditOrganizationForm';
import { createSupabaseUserServerComponentClient } from '@/supabase-clients/user/supabaseUserServerComponentClient';
import { withBaseDescription, withBaseTitle } from '@/utils/seo';

export const metadata = {
  title: withBaseTitle('Edit Organization'),
  description: withBaseDescription(
    'edit organization page of Nextbase Essentail version'
  ),
};

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
  const supabaseClient = createSupabaseUserServerComponentClient();
  const { organizationId } = params;
  const organization = await fetchData(supabaseClient, organizationId);
  return <EditOrganizationForm initialTitle={organization.title} />;
}
