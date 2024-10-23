import { ApplicationLayoutShell } from '@/components/ApplicationLayoutShell/ApplicationLayoutShell';
import { type ReactNode } from 'react';
import { UserSidebar } from '../../../_sidebar/UserSidebar';


export default function Layout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <ApplicationLayoutShell
            sidebar={<UserSidebar />}
        >
            <div>

                <div className="relative flex-1 h-auto mt-6 w-full overflow-auto">
                    <div className="px-6 space-y-6 pb-8">{children}</div>
                </div>
            </div>
        </ApplicationLayoutShell>
    );
}
