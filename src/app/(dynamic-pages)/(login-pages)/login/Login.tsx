'use client';
import ConfirmationPendingCard from '@/components/Auth/ConfirmationPendingCard';
import { EmailAndPassword } from '@/components/Auth/EmailAndPassword';
import { google as GoogleIcon } from '@/components/Auth/Icons';
import {
  signInWithMagicLink,
  signInWithPassword,
  signInWithProvider,
} from '@/data/auth/auth';
import { useSAToastMutation } from '@/hooks/useSAToastMutation';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import type { AuthProvider } from '@/types';
import logo from '@public/logos/rpd-logo.png';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Login({
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
      return await signInWithMagicLink(email, next);
    },
    {
      loadingMessage: 'Sending magic link...',
      errorMessage(error) {
        try {
          if (error instanceof Error) {
            return String(error.message);
          }
          return `Send magic link failed ${String(error)}`;
        } catch (_err) {
          console.warn(_err);
          return 'Send magic link failed ';
        }
      },
      onSuccess: () => {
        setSuccessMessage('A magic link has been sent to your email!');
      },
      successMessage: 'A magic link has been sent to your email!',
    },
  );
  const passwordMutation = useSAToastMutation(
    async ({ email, password }: { email: string; password: string }) => {
      return await signInWithPassword(email, password);
    },
    {
      onSuccess: redirectToDashboard,
      loadingMessage: 'Logging in...',
      errorMessage(error) {
        try {
          if (error instanceof Error) {
            return String(error.message);
          }
          return `Sign in account failed ${String(error)}`;
        } catch (_err) {
          console.warn(_err);
          return 'Sign in account failed';
        }
      },
      successMessage: 'Logged in!',
    },
  );
  const providerMutation = useSAToastMutation(
    async (provider: AuthProvider) => {
      return signInWithProvider(provider, next);
    },
    {
      loadingMessage: 'Requesting login...',
      successMessage: 'Redirecting...',
      errorMessage: 'Failed to login',
      onSuccess: (payload) => {
        console.log('providerMutation success: ', payload);
        window.location.href = payload.data.url;
      },
    },
  );

  const { data: isLoggedIn } = useQuery(
    ['isLoggedInHome'],
    async () => {
      const response = await supabaseUserClientComponentClient.auth.getUser();
      return Boolean(response.data.user?.id);
    },
    {
      initialData: false,
      refetchOnMount: true,
      refetchInterval: false,
      refetchOnWindowFocus: true,
      refetchIntervalInBackground: false,
      cacheTime: 0,
      staleTime: 0,
    },
  );

  (isLoggedIn || next) && redirectToDashboard();
  return (
    <div
      data-success={successMessage}
      className="container data-[success]:flex items-center data-[success]:justify-center text-left max-w-md mx-auto overflow-auto data-[success]:h-full min-h-[470px]"
    >
      {successMessage ? (
        <ConfirmationPendingCard
          type={'login'}
          heading={`Confirmation Link Sent`}
          message={successMessage}
          resetSuccessMessage={setSuccessMessage}
        />
      ) : (
        <div className="space-y-10 bg-background p-8 rounded-2xl shadow-sm border border-gray-100">
          {/* Logo and Title */}
          <div className="space-y-6 text-center">
            <Image
              src={logo}
              alt="Rapid Product Launcher Logo"
              width={80}
              height={80}
              className="mx-auto object-contain"
            />
            <h1 className="text-xl font-bold text-gray-900">
              Welcome back
            </h1>
          </div>

          <div className="space-y-8">
            {/* Social Login Button */}
            <button
              onClick={() => providerMutation.mutate('google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              disabled={providerMutation.isLoading}
            >
              <GoogleIcon />
              <span className="text-sm font-medium text-gray-700">
                {providerMutation.isLoading ? 'Connecting...' : 'Sign in with Google'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-gray-500">or</span>
              </div>
            </div>

            {/* Email/Password Login */}
            <div className="space-y-6">
              <EmailAndPassword
                isLoading={passwordMutation.isLoading}
                onSubmit={(data) => {
                  passwordMutation.mutate(data);
                }}
                view="sign-in"
              />


            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 text-center">
            <p className="text-sm text-gray-600">
              New to Rapid Product Launcher?{' '}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}