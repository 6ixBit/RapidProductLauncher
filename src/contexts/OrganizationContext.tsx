'use client';
import { Enum, NormalizedSubscription, Table } from '@/types';
import { useGetUserOrganizationRole } from '@/utils/react-queries/organizations';
import { useGetNormalizedSubscription } from '@/utils/react-queries/subscriptions';
import { useGetOrganizationById } from '@/utils/react-query-hooks';
import { createContext, useContext } from 'react';

type OrganizationContextType = {
  organizationId: string;
  organizationRole: Enum<'organization_member_role'>;
  organizationByIdData: Table<'organizations'>;
  normalizedSubscription: NormalizedSubscription;
};
export const OrganizationContext = createContext<OrganizationContextType>({
  organizationId: '',
  organizationRole: 'readonly',
  organizationByIdData: {} as Table<'organizations'>,
  normalizedSubscription: { type: 'no-subscription' },
});

export function useOrganizationContext() {
  return useContext(OrganizationContext);
}

export function OrganizationContextProvider({
  children,
  organizationId,
  organizationRole: initialOrganizationRole,
  organizationByIdData: initialOrganizationByIdData,
  normalizedSubscription: initialNormalizedSubscription,
}: {
  children: React.ReactNode;
  organizationId: string;
  organizationRole: Enum<'organization_member_role'>;
  organizationByIdData: Table<'organizations'>;
  normalizedSubscription: NormalizedSubscription;
}) {
  const {
    data: _organizationData,
    isLoading: isLoadingOrganization,
    error: organizationError,
  } = useGetOrganizationById(organizationId, initialOrganizationByIdData);
  // This is a hack to bypass typescript error
  // as _data will never be undefined since we are passing initial data
  const organizationByIdData = _organizationData ?? initialOrganizationByIdData;
  const { data: _organizationRole } = useGetUserOrganizationRole(
    organizationId,
    {
      initialData: initialOrganizationRole,
    }
  );
  const organizationRole = _organizationRole ?? initialOrganizationRole;
  const { data: _normalizedSubscription } = useGetNormalizedSubscription(
    organizationId,
    initialNormalizedSubscription
  );

  const normalizedSubscription =
    _normalizedSubscription ?? initialNormalizedSubscription;

  if (!organizationRole) {
    return <p>Not authorized</p>;
  }
  return (
    <OrganizationContext.Provider
      value={{
        normalizedSubscription,
        organizationByIdData,
        organizationId,
        organizationRole,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
