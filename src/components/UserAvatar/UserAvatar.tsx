import { getPublicUserAvatarUrl, getUserAvatarUrl } from '@/utils/helpers';
import { useGetUserPublicProfile } from '@/utils/react-queries/user';
import Image from 'next/image';

export const UserAvatar = ({
  userId,
  size,
}: {
  userId: string;
  size: number;
}) => {
  const fallbackSource = `https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp`;
  const { data: userProfile, isLoading } = useGetUserPublicProfile(userId);

  let imageSource = fallbackSource;
  if (!isLoading && userProfile) {
    imageSource = getPublicUserAvatarUrl(userProfile.avatar_url);
  }

  return (
    <Image
      className="rounded-full"
      alt={`${userId} avatar`}
      src={imageSource}
      width={size}
      height={size}
    />
  );
};
