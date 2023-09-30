'use client';
import { Anchor } from '@/components/Anchor';
import { usePathname } from 'next/navigation';
import { TabProps } from './types';

export const Tab = ({ label, href, icon }: TabProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const baseClassNames =
    'whitespace-nowrap py-4 pb-3 px-1 border-b-2 font-medium text-base flex items-center space-x-2';
  const modifierClasses = isActive
    ? 'border-gray-900 dark:border-white '
    : 'border-transparent text-muted-foreground hover:border-muted-foreground';
  const className = `${baseClassNames} ${modifierClasses}`;
  return (
    <Anchor href={href} className={className}>
      {icon} <span>{label}</span>
    </Anchor>
  );
};
