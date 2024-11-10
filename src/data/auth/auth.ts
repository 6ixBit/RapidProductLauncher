'use server';
import { createSupabaseUserServerActionClient } from '@/supabase-clients/user/createSupabaseUserServerActionClient';
import type { AuthProvider, SAPayload } from '@/types';
import { toSiteURL } from '@/utils/helpers';

export const signUp = async (
  email: string,
  password: string,
): Promise<SAPayload> => {
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
): Promise<SAPayload> => {
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
): Promise<SAPayload> => {
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
): Promise<
  SAPayload<{
    url: string;
    providerData: any;
  }>
> => {
  const supabase = createSupabaseUserServerActionClient();
  const redirectToURL = new URL(toSiteURL('/auth/callback'));
  if (next) {
    redirectToURL.searchParams.set('next', next);
  }
  // provider token to access additonal services like gmail is returned here.
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectToURL.toString(),
      scopes:
        'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return { status: 'error', message: error.message };
  }

  const providerUrl = data.url;
  console.log('provider DATA: ', data, error);

  return {
    status: 'success',
    data: {
      url: providerUrl,
      providerData: data,
    },
  };
};

export const resetPassword = async (email: string): Promise<SAPayload> => {
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
