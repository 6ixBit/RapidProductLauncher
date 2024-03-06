'use client';
import { Email } from '@/components/Auth/Email';
import { EmailAndPassword } from '@/components/Auth/EmailAndPassword';
import { RenderProviders } from '@/components/Auth/RenderProviders';
import {
  signInWithMagicLink,
  signInWithProvider,
  signUp,
} from '@/data/auth/auth';
import { useSAToastMutation } from '@/hooks/useSAToastMutation';
import { AuthProvider } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SignUp({
  next,
  nextActionType,
}: {
  next?: string;
  nextActionType?: string;
}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  function redirectToDashboard() {
    router.refresh();
    if (next) {
      router.push(`/auth/callback?next=${next}`);
    } else {
      router.push('/auth/callback');
    }
  }
  const magicLinkMutation = useSAToastMutation(
    async (email: string) => {
      // since we can't use the onSuccess callback here to redirect from here
      // we pass on the `next` to the signInWithMagicLink function
      // the user gets redirected from their email message
      return await signInWithMagicLink(email, next);
    },
    {
      loadingMessage: 'Sending magic link...',
      errorMessage: 'Failed to send magic link',
      successMessage: 'Magic link sent!',
      onSuccess: () => {
        setSuccessMessage('A magic link has been sent to your email!');
      },
      onMutate: () => {
        setSuccessMessage(null);
      },
    },
  );
  const passwordMutation = useSAToastMutation(
    async ({ email, password }: { email: string; password: string }) => {
      return await signUp(email, password);
    },
    {
      onSuccess: redirectToDashboard,
      loadingMessage: 'Creating account...',
      errorMessage(error) {
        try {
          if (error instanceof Error) {
            return String(error.message);
          } else return 'Create account failed ' + String(error);
        } catch (_err) {
          console.warn(_err);
          return 'Create account failed ';
        }
      },
      successMessage: 'Account created!',
    },
  );
  const providerMutation = useSAToastMutation(
    async (provider: AuthProvider) => {
      // since we can't use the onSuccess callback here to redirect from here
      // we pass on the `next` to the signInWithProvider function
      // the user gets redirected from the provider redirect callback
      return signInWithProvider(provider, next);
    },
    {
      loadingMessage: 'Requesting login...',
      successMessage: 'Redirecting...',
      errorMessage: 'Failed to login',
    },
  );
  return (
    <div className="container h-full grid items-center text-left max-w-lg mx-auto overflow-auto">
      {successMessage ? (
        <p className="text-blue-500 text-sm">{successMessage}</p>
      ) : (
        <div className="space-y-8 ">
          {/* <Auth providers={['twitter']} supabaseClient={supabase} /> */}
          <div className="flex flex-col items-start gap-0 w-[320px]">
            <p className="text-xl font-[700]">Signup to Nextbase</p>
            <p className="text-base text-left font-[400]">
              How would you like to signup?
            </p>
          </div>
          <RenderProviders
            providers={['google', 'github', 'twitter']}
            isLoading={providerMutation.isLoading}
            onProviderLoginRequested={providerMutation.mutate}
          />
          <hr />
          <Email
            onSubmit={magicLinkMutation.mutate}
            isLoading={magicLinkMutation.isLoading}
            view="sign-up"
          />
          <hr />
          <EmailAndPassword
            isLoading={passwordMutation.isLoading}
            onSubmit={(data) => {
              passwordMutation.mutate(data);
            }}
            view="sign-up"
          />
        </div>
      )}
    </div>
  );
}
