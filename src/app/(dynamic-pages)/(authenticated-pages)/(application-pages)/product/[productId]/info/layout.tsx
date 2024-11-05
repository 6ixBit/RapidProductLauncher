import { UserSidebar } from '@/components/_sidebar/UserSidebar';
import { ApplicationLayoutShell } from '@/components/ApplicationLayoutShell/ApplicationLayoutShell';
import { InternalNavbar } from '@/components/NavigationMenu/InternalNavbar';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ApplicationLayoutShell sidebar={<UserSidebar />}>
      <div>
        <InternalNavbar>
          <div className="hidden lg:flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center bg-amber-50 text-amber-700 px-4 py-2 rounded-full border border-amber-200 shadow-sm hover:bg-amber-100 transition-colors">
                <FontAwesomeIcon icon={faBell} className="text-amber-600" />
                <span className="text-sm font-medium px-4">
                  Welcome Founders, the more you test the quicker you'll find winners, execution is everything ⚔️
                </span>
              </span>
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
