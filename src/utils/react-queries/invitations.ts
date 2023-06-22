import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import {
  getUserPendingInvitationsByEmail,
  getUserPendingInvitationsById,
} from '../supabase/invitations';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { UnwrapPromise } from 'next/dist/lib/coalesced-function';

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
        return getUserPendingInvitationsByEmail(supabaseClient, user.email);
      } else {
        return getUserPendingInvitationsById(supabaseClient, user.id);
      }
    },
    {
      initialData: initialInvitations,
    }
  );
};
