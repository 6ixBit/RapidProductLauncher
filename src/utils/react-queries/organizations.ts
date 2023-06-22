import { UnwrapPromise } from '@/types';
import {
  getMembersInOrganization,
  getUserOrganizationRole,
} from '@/utils/supabase/organizations';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';

export const useGetUserOrganizationRole = (
  organizationId: string,
  {
    initialData,
  }: {
    initialData?: UnwrapPromise<ReturnType<typeof getUserOrganizationRole>>;
  }
) => {
  const user = useLoggedInUser();
  return useQuery(
    ['userGetUserOrganizationRole', organizationId, user.id],
    async () => {
      const organizationRole = await getUserOrganizationRole(
        supabaseClient,
        user.id,
        organizationId
      );
      return organizationRole;
    },
    {
      initialData,
    }
  );
};

export const useGetMembersInOrganization = (organizationId: string) => {
  return useQuery(['getMembersInOrganization', organizationId], async () => {
    return getMembersInOrganization(supabaseClient, organizationId);
  });
};
