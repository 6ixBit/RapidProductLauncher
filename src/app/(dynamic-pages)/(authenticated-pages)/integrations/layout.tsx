import { UserSidebar } from '@/components/_sidebar/UserSidebar';
import { ApplicationLayoutShell } from '@/components/ApplicationLayoutShell/ApplicationLayoutShell';
import { InternalNavbar } from '@/components/NavigationMenu/InternalNavbar';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ApplicationLayoutShell sidebar={<UserSidebar />}>
      <div>
        <InternalNavbar>
          <div className="hidden lg:flex w-full justify-between items-center">
            {/* <Suspense>{navbar}</Suspense> */}
            <div className="flex items-center gap-1">
              <Link
                className="flex gap-1.5 py-1.5 px-3 cursor-pointer items-center group rounded-md transition hover:cursor-pointer hover:text-foreground"
                href={`/organization/what../settings`}
              >
                <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                <p className="text-muted-foreground group-hover:text-foreground text-sm font-normal">
                  Swap Out For settings
                </p>
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
