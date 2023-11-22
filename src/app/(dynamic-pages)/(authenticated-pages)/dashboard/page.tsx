import { fetchSlimOrganizations } from '@/data/user/organizations';
import { RedirectType } from 'next/dist/client/components/redirect';
import { notFound, redirect } from 'next/navigation';

async function getDefaultOrganization(): Promise<string> {
  const slimOrganizations = await fetchSlimOrganizations();
  const firstOrganization = slimOrganizations[0];
  const defaultOrganization = slimOrganizations.find(
    (organization) => organization.is_default,
  );

  const defaultOrganizationId =
    defaultOrganization?.id ?? firstOrganization?.id;
  if (!defaultOrganizationId) {
    return notFound();
  }

  return defaultOrganizationId;
}

export default async function DashboardPage() {
  const firstOrganizationId = await getDefaultOrganization();
  return redirect(`/organization/${firstOrganizationId}`);
}
