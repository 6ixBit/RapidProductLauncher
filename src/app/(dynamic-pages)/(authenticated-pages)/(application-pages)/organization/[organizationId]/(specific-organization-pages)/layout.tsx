import { ReactNode, Suspense } from 'react';
import { z } from 'zod';
import { ApplicationLayoutShell } from '@/components/ApplicationLayoutShell/ApplicationLayoutShell';
import { OrganizationSidebar } from '../../../_sidebar/OrganizationSidebar';
import { InternalNavbar } from '@/components/ui/NavigationMenu/InternalNavbar';
import { Anchor } from '@/components/Anchor';

import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import TeamsIcon from 'lucide-react/dist/esm/icons/folders';
import { SimpleDialog } from '@/components/SimpleDialog';

const paramsSchema = z.object({
  organizationId: z.string(),
});

export default async function Layout({
  children,
  params,
  navbar,
}: {
  children: ReactNode;
  params: unknown;
  navbar: ReactNode;
}) {
  const { organizationId } = paramsSchema.parse(params);
  return (
    <ApplicationLayoutShell
      sidebar={<OrganizationSidebar organizationId={organizationId} />}
    >
      <div>
        <InternalNavbar>
          <div className="flex w-full justify-between items-center">
            <Suspense>{navbar}</Suspense>
            <div className="flex items-center gap-1">
              <Anchor
                className="flex gap-1.5 py-1.5 px-3 cursor-pointer items-center group rounded-md transition hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800"
                href={`/organization/${organizationId}/settings`}
              >
                <SettingsIcon className="w-4 h-4 text-gray-500 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-300" />
                <p className="text-gray-500 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-300 text-sm font-normal">
                  Organization settings
                </p>
              </Anchor>
            </div>
          </div>
        </InternalNavbar>
        <div className="relative flex-1 h-auto mt-6 w-full overflow-auto">
          <div className="px-6 space-y-6 pb-8">{children}</div>
        </div>
      </div>
    </ApplicationLayoutShell>
  );
}
