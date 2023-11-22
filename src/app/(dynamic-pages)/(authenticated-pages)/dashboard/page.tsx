import {
  fetchSlimOrganizations,
  getDefaultOrganization,
  setDefaultOrganization,
} from '@/data/user/organizations';
import { notFound, redirect } from 'next/navigation';

async function getOrganizationToRedirectTo(): Promise<string> {
  const [slimOrganizations, defaultOrganizationId] = await Promise.all([
    fetchSlimOrganizations(),
    getDefaultOrganization(),
  ]);
  const firstOrganization = slimOrganizations[0];

  if (defaultOrganizationId) {
    return defaultOrganizationId;
  }

  if (!firstOrganization) {
    return notFound();
  }

  await setDefaultOrganization(firstOrganization.id);

  return firstOrganization.id;
}

export default async function DashboardPage() {
  const firstOrganizationId = await getOrganizationToRedirectTo();
  return redirect(`/organization/${firstOrganizationId}`);
}
