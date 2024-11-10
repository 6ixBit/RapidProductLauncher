import { ThemeToggle } from '@/components/ThemeToggle';
import { getUserProfile } from '@/data/user/user';
import { serverGetLoggedInUser } from '@/utils/server/serverGetLoggedInUser';
import { UserNavDropDownMenu } from './UserNavDropDownMenu';

const getInitials = (fullName: string) => {
  return fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export async function UserNav() {
  const user = await serverGetLoggedInUser();
  const { email } = user;
  if (!email) {
    // unreachable
    throw new Error('User email not found');
  }

  const userProfile = await getUserProfile(user.id);
  const initials = getInitials(userProfile.full_name ?? email);

  return (
    <>
      <ThemeToggle />

      <UserNavDropDownMenu
        avatarUrl={userProfile.avatar_url}
        initials={initials}
        userFullname={userProfile.full_name ?? `User ${email}`}
        userEmail={email}
        userId={user.id}
      />
    </>
  );
}
