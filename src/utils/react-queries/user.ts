import { getUserProfile } from '../supabase/user';
import supabaseClient from '@/utils/supabase-browser';
import { useQuery } from '@tanstack/react-query';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { Table } from '@/types';

export const useGetUserPublicProfile = (userId: string) => {
  return useQuery(['user', userId], () =>
    getUserProfile(supabaseClient, userId)
  );
};

export const useUserProfile = (initialData?: Table<'user_profiles'>) => {
  const user = useLoggedInUser();
  return useQuery<Table<'user_profiles'>>(
    ['user-profile', user.id],
    async () => {
      return getUserProfile(supabaseClient, user.id);
    },
    {
      initialData,
    }
  );
};
