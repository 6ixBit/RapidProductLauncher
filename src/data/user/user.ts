'use server';
import { createSupabaseUserServerActionClient } from '@/supabase-clients/user/createSupabaseUserServerActionClient';
import { createSupabaseUserServerComponentClient } from '@/supabase-clients/user/createSupabaseUserServerComponentClient';
import { SupabaseFileUploadOptions, Table } from '@/types';
import { serverGetLoggedInUser } from '@/utils/server/serverGetLoggedInUser';
import slugify from 'slugify';
import urlJoin from 'url-join';

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
): Promise<string> => {
  'use server';
  const supabaseClient = createSupabaseUserServerActionClient();
  const user = await serverGetLoggedInUser();
  const userId = user.id;
  const file = formData.get('file');

  if (!file) {
    throw new Error('File is empty');
  }

  const slugifiedFilename = slugify(fileName, {
    lower: true,
    strict: true,
    replacement: '-',
  });

  const userImagePath = `${userId}/images/${slugifiedFilename}`;

  const { data, error } = await supabaseClient.storage
    .from('public-user-assets')
    .upload(userImagePath, file, fileOptions);

  if (error) {
    throw new Error(error.message);
  }

  const { path } = data;

  const filePath = path.split(',')[0];
  const supabaseFileUrl = urlJoin(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    '/storage/v1/object/public/public-user-assets',
    filePath,
  );

  const { error: updateProfileError } = await supabaseClient
    .from('user_profiles')
    .update({
      avatar_url: supabaseFileUrl,
    })
    .eq('id', userId);

  if (updateProfileError) {
    throw updateProfileError;
  }

  return supabaseFileUrl;
};

export const updateUserProfileNameAndAvatar = async ({
  fullName,
  avatarUrl,
}: {
  fullName?: string;
  avatarUrl?: string;
}) => {
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
    .single();

  if (error) {
    throw error;
  }

  return data;
};
