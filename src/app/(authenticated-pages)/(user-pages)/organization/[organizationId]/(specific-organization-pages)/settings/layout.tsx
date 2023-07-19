'use client';

import { TabsNavigation } from '@/components/presentational/tailwind/TabsNavigation';
import { useMemo } from 'react';
import UsersIcon from 'lucide-react/dist/esm/icons/users';
import DollarSignIcon from 'lucide-react/dist/esm/icons/dollar-sign';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import { useOrganizationContext } from '@/contexts/OrganizationContext';

export default function OrganizationSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organizationId } = useOrganizationContext();
  const tabs = useMemo(() => {
    return [
      {
        label: 'General',
        href: `/organization/${organizationId}/settings`,
        icon: <EditIcon />,
      },
      {
        label: 'Organization Members',
        href: `/organization/${organizationId}/settings/members`,
        icon: <UsersIcon />,
      },
      {
        label: 'Billing',
        href: `/organization/${organizationId}/settings/billing`,
        icon: <DollarSignIcon />,
      },
    ];
  }, [organizationId]);

  return (
    <div className="space-y-6">
      <TabsNavigation tabs={tabs} />
      {children}
    </div>
  );
}
