'use server';

import { createSupabaseUserServerActionClient } from '@/supabase-clients/user/createSupabaseUserServerActionClient';
import type { ValidSAPayload } from '@/types';

export async function refreshSessionAction(): Promise<ValidSAPayload<void>> {
  const supabaseClient = createSupabaseUserServerActionClient();
  const refreshSessionResponse = await supabaseClient.auth.refreshSession();

  if (refreshSessionResponse.error) {
    return {
      status: 'error',
      message: refreshSessionResponse.error.message,
    };
  }

  return {
    status: 'success',
  };
}
