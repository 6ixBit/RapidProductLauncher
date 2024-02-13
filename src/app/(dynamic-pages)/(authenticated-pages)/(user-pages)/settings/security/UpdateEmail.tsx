// src/app/(dynamic-pages)/(authenticated-pages)/(user-pages)/settings/security/UpdateEmail.tsx

'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateEmailAction } from '@/data/user/security';
import { useToastMutation } from '@/hooks/useToastMutation';
import { classNames } from '@/utils/classNames';
import { useInput } from 'rooks';

export const UpdateEmail = ({
  initialEmail,
}: {
  initialEmail?: string | undefined;
}) => {
  const emailInput = useInput(initialEmail ?? '');

  const { mutate: updateEmail, isLoading } = useToastMutation(
    async () => {
      await updateEmailAction(emailInput.value);
    },
    {
      loadingMessage: 'Updating email...',
      successMessage: 'Email updated!',
      errorMessage: 'Failed to update email',
    },
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-muted-foreground">
          Email
        </Label>
        <div>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            {...emailInput}
            className="block"
          />
        </div>
        <Button
          aria-disabled={isLoading}
          type="button"
          onClick={() => {
            updateEmail();
          }}
          className={classNames(
            'flex w-full justify-center rounded-lg border border-transparent py-3 text-white dark:text-black px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
            isLoading
              ? 'bg-yellow-300 dark:bg-yellow-700 '
              : 'bg-black dark:bg-white hover:bg-gray-900 dark:hover:bg-gray-100  ',
          )}
        >
          {isLoading ? 'Updating...' : 'Update Email'}
        </Button>
      </div>
    </div>
  );
};
