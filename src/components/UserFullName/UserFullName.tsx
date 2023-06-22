import { useGetUserPublicProfile } from '@/utils/react-queries/user';
import { Skeleton } from '../ui/Skeleton';
import { T } from '../ui/Typography';

export const UserFullName = ({ userId }: { userId: string }) => {
  const { data: userProfile, isLoading } = useGetUserPublicProfile(userId);

  let userFullName = 'User';

  if (!isLoading && userProfile) {
    userFullName = userProfile.full_name ?? 'User';
  }

  return isLoading ? (
    <Skeleton className="h-[12px] w-[90px] rounded-md" />
  ) : (
    <T.Subtle>{userFullName}</T.Subtle>
  );
};
