'use client';
import { Anchor } from '@/components/Anchor';
import { useUser } from '@supabase/auth-helpers-react';
import HomeIcon from 'lucide-react/dist/esm/icons/home';
import { cn } from '@/utils/cn';
import { UserSidebarLink } from './UserSidebarLink';

type LinksProps = {
  isExpanded: boolean;
  toggleIsExpanded: (isExpanded: boolean) => void;
};
function Links({ isExpanded, toggleIsExpanded }: LinksProps) {
  const user = useUser();

  const sidebarContainerClassName = cn(
    `grid grid-rows-[auto,1fr,auto] h-full overflow-auto`,
    isExpanded ? ' px-4 w-[264px]' : 'px-2 w-[64px]'
  );

  return (
    <div className={sidebarContainerClassName}>
      {user ? (
        <>
          <UserSidebarLink
            href="/dashboard"
            icon={<HomeIcon />}
            label="Dashboard"
            isExpanded={isExpanded}
          />
        </>
      ) : (
        <Anchor
          href="/login"
          className="flex py-1 text-slate-400 text-sm font-[600] hover:text-gray-200"
        >
          Login
        </Anchor>
      )}
    </div>
  );
}

export function AppSidebar({
  isExpanded,
  toggleIsExpanded,
}: {
  isExpanded: boolean;
  toggleIsExpanded: (isExpanded: boolean) => void;
}) {
  return (
    <nav className="flex w-full">
      <Links isExpanded={isExpanded} toggleIsExpanded={toggleIsExpanded} />
      <div className="flex-grow"></div>
    </nav>
  );
}
