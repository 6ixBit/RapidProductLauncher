'use server';
import { createSupabaseUserServerComponentClient } from '@/supabase-clients/user/createSupabaseUserServerComponentClient';

export const serverGetLoggedInUser = async () => {
  const supabase = createSupabaseUserServerComponentClient();

  const { data: { user }, error: sessionError, } = await supabase.auth.getUser();

  if (sessionError) {
    throw sessionError;
  }

  if (!user) {
    throw new Error('serverGetLoggedInUser: Not logged in');
  }

  return user;
};
