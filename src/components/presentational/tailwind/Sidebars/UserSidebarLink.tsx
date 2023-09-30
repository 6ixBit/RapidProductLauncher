'use client';
import { Anchor } from '@/components/Anchor';
import { classNames } from '@/utils/classNames';
import { usePathname } from 'next/navigation';

export function UserSidebarLink({
  href,
  icon,
  label,
  isExpanded,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isExpanded: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Anchor
      href={href}
      className={classNames(
        `flex w-full gap-2.5 items-center group py-2.5 mb-1 rounded-lg transition hover:cursor-pointer hover:bg-gray-300/50 dark:hover:bg-gray-700/50 `,
        isActive ? ' bg-gray-300/50  dark:bg-gray-700/80  ' : ' bg-transparent',
        isExpanded ? ' pl-5 pr-2 justify-start' : ' justify-center'
      )}
    >
      <span className="text-gray-700 dark:text-gray-300 ">{icon}</span>
      {isExpanded ? (
        <span className="transition text-base font-medium group-hover:text-gray-900 dark:group-hover:text-white">
          {label}
        </span>
      ) : null}
    </Anchor>
  );
}
