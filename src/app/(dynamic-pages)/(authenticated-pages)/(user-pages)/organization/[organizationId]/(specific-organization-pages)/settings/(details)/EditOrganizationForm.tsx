'use client';
import { Button } from '@/components/presentational/tailwind/Button';
import { T } from '@/components/ui/Typography';
import { classNames } from '@/utils/classNames';
import { useUpdateOrganizationTitleMutation } from '@/utils/react-query-hooks';
import { useState } from 'react';
import { useOrganizationContext } from '@/contexts/OrganizationContext';

export function EditOrganizationForm({
  initialTitle,
}: {
  initialTitle: string;
}) {
  const { organizationId } = useOrganizationContext();

  const { mutate, isLoading } = useUpdateOrganizationTitleMutation({
    organizationId,
  });

  const [organizationTitle, setOrganizationTitle] =
    useState<string>(initialTitle);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <T.H3>Edit Organization Title</T.H3>
        <T.P className="text-muted-foreground">
          This is the title that will be displayed on the organization page.
        </T.P>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          mutate({
            title: organizationTitle,
          });
        }}
        className="space-y-4 max-w-md"
      >
        <input
          value={organizationTitle}
          type="text"
          name="organization-title"
          id="organization-title"
          onChange={(e) => {
            setOrganizationTitle(e.target.value);
          }}
          className="block px-3 py-2 appearance-none w-full rounded-md border bg-transparent h-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <div className="inline-block">
          <Button
            disabled={isLoading}
            type="submit"
            id="update-organization-title-button"
            className={classNames(
              'flex w-full justify-center rounded-lg border border-transparent py-3 px-4 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
              'bg-gray-900 hover:bg-gray-700 dark:bg-gray-50 hover:dark:bg-gray-200 text-white dark:text-black'
            )}
          >
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </div>
  );
}
