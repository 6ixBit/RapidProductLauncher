import { UserSidebar } from '@/components/_sidebar/UserSidebar';
import { ApplicationLayoutShell } from '@/components/ApplicationLayoutShell/ApplicationLayoutShell';
import { InternalNavbar } from '@/components/NavigationMenu/InternalNavbar';
import { Announcement } from '@/components/ui/announcement';
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
    <ApplicationLayoutShell sidebar={<UserSidebar />}>
      <div>
        <InternalNavbar>

          <div className="hidden lg:flex w-full justify-between items-center lg:ml-3">
            <div className="flex items-center gap-2">
              <Announcement
                text="Temu & Amazon imports are currently in beta. If you'd like to join the waitlist, please contact support."
                variant="info"
                className="hover:bg-amber-100 transition-colors"
              />
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
