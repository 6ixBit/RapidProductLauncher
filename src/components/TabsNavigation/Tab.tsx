'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TabProps } from './types';

export const Tab = ({ label, href, icon }: TabProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const baseClassNames =
    'whitespace-nowrap py-4 pb-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2';
  const modifierClasses = isActive
    ? 'border-blue-500 text-blue-600 font-semibold'
    : 'border-transparent text-muted-foreground hover:border-muted-foreground hover:text-gray-600';
  const className = `${baseClassNames} ${modifierClasses}`;
  return (
    <Link href={href} className={className}>
      {icon} <span>{label}</span>
    </Link>
  );
};
