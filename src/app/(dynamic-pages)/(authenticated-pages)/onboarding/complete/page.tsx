import { serverGetLoggedInUser } from '@/utils/server/serverGetLoggedInUser';

export default async function OnboardingCompletePage() {
  const user = await serverGetLoggedInUser();
  return <div>{JSON.stringify(user.user_metadata)}</div>;
}
