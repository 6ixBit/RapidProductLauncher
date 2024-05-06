'use server';
import { createSupabaseUserServerActionClient } from '@/supabase-clients/user/createSupabaseUserServerActionClient';
import type { AuthProvider, ValidSAPayload } from '@/types';
import { toSiteURL } from '@/utils/helpers';

export const signUp = async (
  email: string,
  password: string,
): Promise<ValidSAPayload> => {
  const supabase = createSupabaseUserServerActionClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: toSiteURL('/auth/callback'),
    },
  });
  if (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  return {
    status: 'success',
  };
};

export const signInWithPassword = async (
  email: string,
  password: string,
): Promise<ValidSAPayload> => {
  const supabase = createSupabaseUserServerActionClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  return {
    status: 'success',
  };
};

export const signInWithMagicLink = async (
  email: string,
  next?: string,
): Promise<ValidSAPayload> => {
  const supabase = createSupabaseUserServerActionClient();
  const redirectUrl = new URL(toSiteURL('/auth/callback'));
  if (next) {
    redirectUrl.searchParams.set('next', next);
  }
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl.toString(),
    },
  });

  if (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  return {
    status: 'success',
  };
};

export const signInWithProvider = async (
  provider: AuthProvider,
  next?: string,
): Promise<ValidSAPayload> => {
  const supabase = createSupabaseUserServerActionClient();
  const redirectToURL = new URL(toSiteURL('/auth/callback'));
  if (next) {
    redirectToURL.searchParams.set('next', next);
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectToURL.toString(),
    },
  });

  if (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  return {
    status: 'success',
  };
};

export const resetPassword = async (email: string): Promise<ValidSAPayload> => {
  const supabase = createSupabaseUserServerActionClient();
  const redirectToURL = new URL(toSiteURL('/auth/callback'));
  redirectToURL.searchParams.set('next', `/update-password`);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectToURL.toString(),
  });
  if (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  return {
    status: 'success',
  };
};
