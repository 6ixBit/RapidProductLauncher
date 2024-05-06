'use server';
import { createSupabaseUserServerActionClient } from '@/supabase-clients/user/createSupabaseUserServerActionClient';
import { createSupabaseUserServerComponentClient } from '@/supabase-clients/user/createSupabaseUserServerComponentClient';
import { SupabaseFileUploadOptions, Table, ValidSAPayload } from '@/types';
import { serverGetLoggedInUser } from '@/utils/server/serverGetLoggedInUser';
import { AuthUserMetadata } from '@/utils/zod-schemas/authUserMetadata';
import slugify from 'slugify';
import urlJoin from 'url-join';
import { refreshSessionAction } from './session';
export async function getIsAppAdmin(): Promise<boolean> {
  const user = await serverGetLoggedInUser();
  if ('user_role' in user) {
    return user.user_role === 'admin';
  }

  return false;
}

export const getUserProfile = async (
  userId: string,
): Promise<Table<'user_profiles'>> => {
  const supabase = createSupabaseUserServerComponentClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
export const getUserFullName = async (userId: string) => {
  const supabase = createSupabaseUserServerComponentClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data.full_name;
};

export const getUserAvatarUrl = async (userId: string) => {
  const supabase = createSupabaseUserServerComponentClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('avatar_url')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data.avatar_url;
};

export const getUserPendingInvitationsByEmail = async (userEmail: string) => {
  const supabaseClient = createSupabaseUserServerComponentClient();
  const { data, error } = await supabaseClient
    .from('organization_join_invitations')
    .select(
      '*, inviter:user_profiles!inviter_user_id(*), invitee:user_profiles!invitee_user_id(*), organization:organizations(*)',
    )
    .ilike('invitee_user_email', `%${userEmail}%`)
    .eq('status', 'active');

  if (error) {
    throw error;
  }

  return data || [];
};

export const getUserPendingInvitationsById = async (userId: string) => {
  const supabaseClient = createSupabaseUserServerComponentClient();
  const { data, error } = await supabaseClient
    .from('organization_join_invitations')
    .select(
      '*, inviter:user_profiles!inviter_user_id(*), invitee:user_profiles!invitee_user_id(*), organization:organizations(*)',
    )
    .eq('invitee_user_id', userId)
    .eq('status', 'active');

  if (error) {
    throw error;
  }

  return data || [];
};

export const uploadPublicUserAvatar = async (
  formData: FormData,
  fileName: string,
  fileOptions?: SupabaseFileUploadOptions | undefined,
): Promise<ValidSAPayload<string>> => {
  'use server';
  const file = formData.get('file');
  if (!file) {
    throw new Error('File is empty');
  }
  const slugifiedFilename = slugify(fileName, {
    lower: true,
    strict: true,
    replacement: '-',
  });
  const supabaseClient = createSupabaseUserServerActionClient();
  const user = await serverGetLoggedInUser();
  const userId = user.id;
  const userImagesPath = `${userId}/images/${slugifiedFilename}`;

  const { data, error } = await supabaseClient.storage
    .from('public-user-assets')
    .upload(userImagesPath, file, fileOptions);

  if (error) {
    return { status: 'error', message: error.message };
  }

  const { path } = data;

  const filePath = path.split(',')[0];
  const supabaseFileUrl = urlJoin(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    '/storage/v1/object/public/public-user-assets',
    filePath,
  );

  return { status: 'success', data: supabaseFileUrl };
};

export const updateUserProfileNameAndAvatar = async (
  {
    fullName,
    avatarUrl,
  }: {
    fullName?: string;
    avatarUrl?: string;
  },
  {
    isOnboardingFlow = false,
  }: {
    isOnboardingFlow?: boolean;
  } = {},
): Promise<ValidSAPayload<Table<'user_profiles'>>> => {
  'use server';
  const supabaseClient = createSupabaseUserServerActionClient();
  const user = await serverGetLoggedInUser();
  const { data, error } = await supabaseClient
    .from('user_profiles')
    .update({
      full_name: fullName,
      avatar_url: avatarUrl,
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  if (isOnboardingFlow) {
    const updateUserMetadataPayload: Partial<AuthUserMetadata> = {
      onboardingHasCompletedProfile: true,
    };

    const updateUserMetadataResponse = await supabaseClient.auth.updateUser({
      data: updateUserMetadataPayload,
    });

    if (updateUserMetadataResponse.error) {
      return {
        status: 'error',
        message: updateUserMetadataResponse.error.message,
      };
    }

    const refreshSessionResponse = await refreshSessionAction();
    if (refreshSessionResponse.status === 'error') {
      return refreshSessionResponse;
    }
  }

  return {
    status: 'success',
    data,
  };
};

export const acceptTermsOfService = async (
  accepted: boolean,
): Promise<ValidSAPayload<boolean>> => {
  const supabaseClient = createSupabaseUserServerComponentClient();

  const updateUserMetadataPayload: Partial<AuthUserMetadata> = {
    onboardingHasAcceptedTerms: true,
  };

  const updateUserMetadataResponse = await supabaseClient.auth.updateUser({
    data: updateUserMetadataPayload,
  });

  if (updateUserMetadataResponse.error) {
    return {
      status: 'error',
      message: updateUserMetadataResponse.error.message,
    };
  }

  const refreshSessionResponse = await refreshSessionAction();
  if (refreshSessionResponse.status === 'error') {
    return refreshSessionResponse;
  }

  return {
    status: 'success',
    data: true,
  };
};
