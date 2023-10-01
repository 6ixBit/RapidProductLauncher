import { withBaseDescription, withBaseTitle } from '@/utils/seo';

import { OrganizationSubscripionDetails } from './OrganizationSubscripionDetails';

export const metadata = {
  title: withBaseTitle('Organization Billing'),
  description: withBaseDescription(
    'organization billing page of Nextbase Essential version',
  ),
};

export default function OrganizationSettingsPage() {
  return <OrganizationSubscripionDetails />;
}
