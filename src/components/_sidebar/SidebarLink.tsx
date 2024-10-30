'use client';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarLinkProps = {
  label: string;
  href: string;
  icon: JSX.Element;
};

export function SidebarLink({ label, href, icon }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <div
      key={href}
      className={cn(
        'hover:cursor-pointer rounded-md group w-full flex items-center',
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-muted-foreground hover:bg-secondary',
      )}
    >
      <div
        className={cn(
          'p-2',
          isActive ? 'text-blue-600' : 'group-hover:text-muted-foreground',
        )}
      >
        {icon}
      </div>
      <Link
        className={cn(
          'p-2 w-full text-sm',
          isActive
            ? 'text-blue-600 font-medium'
            : 'group-hover:text-foreground',
        )}
        href={href}
      >
        {label}
      </Link>
    </div>
  );
}
