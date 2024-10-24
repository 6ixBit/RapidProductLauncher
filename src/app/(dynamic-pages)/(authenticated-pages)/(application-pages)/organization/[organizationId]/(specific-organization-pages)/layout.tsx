import { UserSidebar } from '@/components/_sidebar/UserSidebar';
import { ApplicationLayoutShell } from '@/components/ApplicationLayoutShell/ApplicationLayoutShell';
import { InternalNavbar } from '@/components/NavigationMenu/InternalNavbar';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { z } from 'zod';

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
      sidebar={<UserSidebar />}
    >
      <div>
        <InternalNavbar>
          <div className="hidden lg:flex w-full justify-between items-center">
            {/* <Suspense>{navbar}</Suspense> */}
            <div className="flex items-center gap-1">
              <Link
                className="flex gap-1.5 py-1.5 px-3 cursor-pointer items-center group rounded-md transition hover:cursor-pointer hover:text-foreground"
                href={`/organization/what../settings`}
              >

              </Link>
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
