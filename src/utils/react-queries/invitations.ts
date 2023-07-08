import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import {
  getUserPendingInvitationsByEmail,
  getUserPendingInvitationsById,
} from '../supabase/invitations';
import { useQuery } from '@tanstack/react-query';
import { UnwrapPromise } from 'next/dist/lib/coalesced-function';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';

export const useGetUserPendingInvitations = (
  initialInvitations?: UnwrapPromise<
    ReturnType<typeof getUserPendingInvitationsByEmail>
  >
) => {
  const user = useLoggedInUser();
  return useQuery(
    ['user-pending-invitations', user.email, user.id],
    async () => {
      if (user.email) {
        return getUserPendingInvitationsByEmail(
          supabaseUserClientComponentClient,
          user.email
        );
      } else {
        return getUserPendingInvitationsById(
          supabaseUserClientComponentClient,
          user.id
        );
      }
    },
    {
      initialData: initialInvitations,
    }
  );
};
