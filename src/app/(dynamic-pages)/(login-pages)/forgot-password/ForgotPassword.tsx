'use client';
import { Email } from '@/components/presentational/tailwind/Auth/Email';
import {
  useResetPassword,
  useSignInWithMagicLink,
} from '@/utils/react-query-hooks';
import { useState } from 'react';

export function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const magicLinkMutation = useResetPassword({
    onSuccess: () => {
      setSuccessMessage('A magic link has been sent to your email!');
    },
  });

  return (
    <div className="container h-full grid items-center text-left max-w-lg mx-auto overflow-auto">
      <div className="space-y-8 ">
        {/* <Auth providers={['twitter']} supabaseClient={supabase} /> */}
        <div className="flex flex-col items-start gap-0 w-[320px]">
          <p className="text-xl font-[700]">Forgot Password</p>
          <p className="text-base text-left font-[400]">
            Enter your email to recieve a Magic Link to reset your password.
          </p>
        </div>

        <Email
          onSubmit={(email) => {
            magicLinkMutation.mutate({
              email,
            });
          }}
          successMessage={successMessage}
          isLoading={magicLinkMutation.isLoading}
          view="forgot-password"
        />
      </div>
    </div>
  );
}
