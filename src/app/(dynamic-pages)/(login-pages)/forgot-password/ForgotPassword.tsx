'use client';
import { Email } from '@/components/Auth/Email';
import { T } from '@/components/ui/Typography';
import { resetPassword } from '@/data/auth/auth';
import { useSAToastMutation } from '@/hooks/useSAToastMutation';
import { useState } from 'react';

export function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const magicLinkMutation = useSAToastMutation(
    async (email: string) => {
      return await resetPassword(email);
    },
    {
      loadingMessage: 'Sending password reset link...',
      errorMessage(error) {
        try {
          if (error instanceof Error) {
            return String(error.message);
          } else return 'Failed to send password reset link ' + String(error);
        } catch (_err) {
          console.warn(_err);
          return `Failed to send password reset link`;
        }
      },
      successMessage: 'Password reset link sent!',
      onSuccess: () => {
        setSuccessMessage(
          'A  password reset link has been sent to your email!',
        );
      },
    },
  );

  return (
    <div className="container h-full grid items-center text-left max-w-lg mx-auto overflow-auto">
      <div className="space-y-8 ">
        {/* <Auth providers={['twitter']} supabaseClient={supabase} /> */}
        <div className="flex flex-col items-start gap-0 w-[320px]">
          <T.H4>Forgot Password</T.H4>
          <T.P className="text-muted-foreground">
            Enter your email to recieve a Magic Link to reset your password.
          </T.P>
        </div>
        {successMessage ? (
          <T.P className="text-blue-500 text-sm">{successMessage}</T.P>
        ) : null}
        <Email
          onSubmit={magicLinkMutation.mutate}
          isLoading={magicLinkMutation.isLoading}
          view="forgot-password"
        />
      </div>
    </div>
  );
}
