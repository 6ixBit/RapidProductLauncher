import { Suspense } from 'react';
import { EditOrganizationForm } from './EditOrganizationForm';
import { getOrganizationTitle } from '@/data/user/organizations';
import { T } from '@/components/ui/Typography';

async function EditOrganization({
  organizationId,
}: {
  organizationId: string;
}) {
  const organizationTitle = await getOrganizationTitle(organizationId);
  return (
    <EditOrganizationForm
      organizationId={organizationId}
      initialTitle={organizationTitle}
    />
  );
}

export default async function EditOrganizationPage({
  params,
}: {
  params: {
    organizationId: string;
  };
}) {
  const { organizationId } = params;
  return (
    <Suspense fallback={<T.Subtle>Loading...</T.Subtle>}>
      <EditOrganization organizationId={organizationId} />
    </Suspense>
  );
}
