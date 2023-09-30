import { ReactNode } from 'react';
import InternalNavbar from '@/components/ui/NavigationMenu/InternalNavbar';

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <InternalNavbar />
      <div className=" flex-1 h-auto overflow-auto">
        <div className="px-12 space-y-6">{children}</div>
      </div>
    </>
  );
}
