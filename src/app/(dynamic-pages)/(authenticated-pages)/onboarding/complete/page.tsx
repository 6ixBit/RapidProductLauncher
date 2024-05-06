import { serverGetLoggedInUser } from '@/utils/server/serverGetLoggedInUser';

export default async function OnboardingCompletePage() {
  const user = await serverGetLoggedInUser();
  console.log(user.user_metadata);
  return <div>{JSON.stringify(user.user_metadata)}</div>;
}
