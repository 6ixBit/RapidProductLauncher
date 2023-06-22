'use client';
import { RenderProviders } from '@/components/presentational/tailwind/Auth/RenderProviders';
import { Email } from '@/components/presentational/tailwind/Auth/Email';
import { EmailAndPassword } from '@/components/presentational/tailwind/Auth/EmailAndPassword';
import {
  useSignInWithMagicLink,
  useSignInWithPassword,
  useSignInWithProvider,
} from '@/utils/react-query-hooks';
import { useState } from 'react';

export function Login() {
  const [isSuccessful, setIsSuccessful] = useState(false);
  function redirectToDashboard() {
    setIsSuccessful(true);
  }
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const magicLinkMutation = useSignInWithMagicLink({
    onSuccess: () => {
      setSuccessMessage('A magic link has been sent to your email!');
    },
  });
  const passwordMutation = useSignInWithPassword({
    onSuccess: redirectToDashboard,
  });
  const providerMutation = useSignInWithProvider();
  return (
    <div className="container h-full grid items-center text-left max-w-lg mx-auto overflow-auto">
      {isSuccessful ? (
        <p className="text-blue-500 text-sm">Logging you in ...</p>
      ) : (
        <div className="space-y-8 ">
          {/* <Auth providers={['twitter']} supabaseClient={supabase} /> */}
          <div className="flex flex-col items-start gap-0 w-[320px]">
            <p className="text-xl font-[700]">Login to Nextbase</p>
            <p className="text-base text-left font-[400]">
              Login with the account you used to signup.
            </p>
          </div>
          <RenderProviders
            providers={['google', 'github', 'twitter']}
            isLoading={providerMutation.isLoading}
            onProviderLoginRequested={(provider) => {
              providerMutation.mutate({
                provider,
              });
            }}
          />
          <hr />
          <Email
            onSubmit={(email) => {
              magicLinkMutation.mutate({
                email,
              });
            }}
            successMessage={successMessage}
            isLoading={magicLinkMutation.isLoading}
            view="sign-in"
          />
          <hr />
          <EmailAndPassword
            isLoading={passwordMutation.isLoading}
            onSubmit={(data) => {
              passwordMutation.mutate(data);
            }}
            view="sign-in"
          />
        </div>
      )}
    </div>
  );
}
