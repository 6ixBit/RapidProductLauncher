import { AppSupabaseClient, AuthProvider } from '@/types';
import { toSiteURL } from '../helpers';

export const signInWithMagicLink = async (
  supabase: AppSupabaseClient,
  email: string
) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: toSiteURL('/check-auth'),
    },
  });

  if (error) {
    throw error;
  }
};

export const signInWithPassword = async (
  supabase: AppSupabaseClient,
  email: string,
  password: string
) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }
};

export const resetPassword = async (
  supabase: AppSupabaseClient,
  email: string
) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: toSiteURL('/update-password'),
  });

  if (error) {
    throw error;
  }
};

export const updatePassword = async (
  supabase: AppSupabaseClient,
  password: string
) => {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }
};

export const signInWithProvider = async (
  supabase: AppSupabaseClient,
  provider: AuthProvider
) => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: toSiteURL('/check-auth'),
    },
  });

  if (error) {
    throw error;
  }
};

export const signUp = async (
  supabase: AppSupabaseClient,
  email: string,
  password: string
) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: toSiteURL('/'),
    },
  });

  if (error) {
    throw error;
  }
};
