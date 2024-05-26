'use client';
import { UpdateAvatarAndNameBody } from '@/components/UpdateAvatarAndName';
import {
  updateUserProfileNameAndAvatar,
  uploadPublicUserAvatar,
} from '@/data/user/user';

import { useToastMutation } from '@/hooks/useToastMutation';
import { Table } from '@/types';
import { useState } from 'react';

export function AccountSettings({
  userProfile,
}: {
  userProfile: Table<'user_profiles'>;
}) {
  const { mutate, isLoading } = useToastMutation(
    async ({
      fullName,
      avatarUrl,
    }: {
      fullName: string;
      avatarUrl?: string;
    }) => {
      return await updateUserProfileNameAndAvatar({
        fullName,
        avatarUrl,
      });
    },
    {
      loadingMessage: 'Updating profile...',
      errorMessage: 'Failed to update profile',
      successMessage: 'Profile updated!',
    },
  );
  // This loading state is for the new avatar image
  // being fetched from the server to the browser. At this point the
  // upload is complete, but the new image is not yet available to the browser.
  const [isNewAvatarImageLoading, setIsNewAvatarImageLoading] =
    useState<boolean>(false);

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    userProfile.avatar_url ?? undefined,
  );

  const { mutate: upload, isLoading: isUploading } = useToastMutation(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return await uploadPublicUserAvatar(formData, file.name, {
        upsert: true,
      });
    },
    {
      loadingMessage: 'Uploading avatar...',
      errorMessage: 'Failed to upload avatar',
      successMessage: 'Avatar uploaded!',
      onSuccess(data) {
        setAvatarUrl(data);
      },
    },
  );

  return (
    <div className="max-w-2xl">
      <UpdateAvatarAndNameBody
        onSubmit={(fullName: string) => {
          mutate({
            fullName,
          });
        }}
        onFileUpload={(file: File) => {
          console.log('file', file);
          upload(file);
        }}
        isNewAvatarImageLoading={isNewAvatarImageLoading}
        setIsNewAvatarImageLoading={setIsNewAvatarImageLoading}
        isUploading={isUploading}
        isLoading={isLoading ?? isUploading}
        profileAvatarUrl={avatarUrl}
        profileFullname={userProfile.full_name ?? undefined}
      />
    </div>
  );
}
