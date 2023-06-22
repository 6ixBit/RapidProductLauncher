'use client';

import { TabsNavigation } from '@/components/presentational/tailwind/TabsNavigation';
import { useMemo } from 'react';
import { FiUsers, FiDollarSign, FiEdit } from 'react-icons/fi';
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
        icon: <FiEdit />,
      },
      {
        label: 'Organization Members',
        href: `/organization/${organizationId}/settings/members`,
        icon: <FiUsers />,
      },
      {
        label: 'Billing',
        href: `/organization/${organizationId}/settings/billing`,
        icon: <FiDollarSign />,
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
