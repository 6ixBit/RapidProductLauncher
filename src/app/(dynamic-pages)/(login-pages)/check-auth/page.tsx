'use client';
import { Anchor } from '@/components/Anchor';
import { T } from '@/components/ui/Typography';
import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useTimeoutWhen } from 'rooks';

export default function HomePage() {
  const user = useUser();
  const [loadingState, setLoadingState] = useState<
    'loading' | 'logged-in' | 'logged-out'
  >('loading');

  const noUser = !user;

  useEffect(() => {
    if (user && loadingState === 'loading') {
      setLoadingState('logged-in');
    }
  }, [user, loadingState]);

  // if user is not detected after 5 seconds, show an error
  // and allow user to proceed to login/signup
  useTimeoutWhen(
    () => {
      setLoadingState('logged-out');
    },
    5000,
    noUser
  );

  useEffect(() => {
    if (loadingState === 'logged-in') {
      // router.replace is rendering a cached page
      // only this is working
      window.location.href = '/dashboard';
    }
  }, [loadingState]);

  let content = <span>Checking...</span>;
  if (loadingState === 'logged-in') {
    content = <span>Redirecting to dashboard...</span>;
  } else if (loadingState === 'logged-out') {
    content = (
      <div className="flex flex-col space-y-6">
        <T.P className="text-red-500 dark:text-red-400">Not logged in</T.P>
        <Anchor href="/login">
          <div className="bg-white dark:bg-black items-center p-4 flex space-x-3 hover:bg-gray-100 dark:hover:bg-gray-900 shadow-sm border  rounded-xl">
            <div className="flex flex-col justify-center items-start space-y-1.5">
              <T.Small className=" leading-none m-0">Proceed to Login</T.Small>
            </div>
          </div>
        </Anchor>
        <Anchor href="/sign-up">
          <div className="bg-white dark:bg-black items-center p-4 flex space-x-3 hover:bg-gray-100 dark:hover:bg-gray-900 shadow-sm border  rounded-xl">
            <div className="flex flex-col justify-center items-start space-y-1.5">
              <T.Small className=" leading-none m-0">
                Proceed to Sign Up
              </T.Small>
            </div>
          </div>
        </Anchor>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {content}
    </div>
  );
}
