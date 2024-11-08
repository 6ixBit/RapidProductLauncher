import { UserSidebar } from '@/components/_sidebar/UserSidebar';
import { ApplicationLayoutShell } from '@/components/ApplicationLayoutShell/ApplicationLayoutShell';
import { InternalNavbar } from '@/components/NavigationMenu/InternalNavbar';
import { Announcement } from '@/components/ui/announcement';
import { type ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ApplicationLayoutShell sidebar={<UserSidebar />}>
      <div>
        <InternalNavbar>

          <div className="hidden lg:flex w-full justify-between items-center lg:ml-8">
            <div className="flex items-center gap-2">
              <Announcement
                text="Use unsaturated videos from TikTok/Reels/Amazon for better ad performance. Fresh, unique content tends to convert better."
                variant="tip"
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
