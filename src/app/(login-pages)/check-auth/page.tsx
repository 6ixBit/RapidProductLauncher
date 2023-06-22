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
      <div className="space-y-4">
        <T.P className="text-red-500">Not logged in</T.P>
        <Anchor
          className=" font-medium block text-blue-600 hover:text-blue-500"
          href="/login"
        >
          Proceed to Login
        </Anchor>
        <Anchor
          className=" font-medium block text-blue-600 hover:text-blue-500"
          href="/sign-up"
        >
          Proceed to Signup
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
