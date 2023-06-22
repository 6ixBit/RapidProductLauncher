import { Menu } from '@headlessui/react';
import Image from 'next/image';
import { UserSidebarMenu } from '../UserSidebarMenu';
import { BiChevronRight } from 'react-icons/bi';
import { cn } from '@/utils/cn';

export const SidebarBottom = ({
  avatarUrl,
  userFullname,
  isExpanded,
  userEmail,
}: {
  avatarUrl: string;
  userFullname: string;
  userEmail: string;
  isExpanded: boolean;
}) => {
  const userClassName = cn(
    `flex w-full gap-3 mb-2 items-center py-3 text-white h-[80px] border-t border-slate-600`,
    isExpanded ? 'px-4 pl-5 justify-start' : 'justify-center',
    'group hover:cursor-pointer'
  );

  return (
    <div className="cursor-pointer">
      <Menu as="div" className="relative">
        <Menu.Button as="div" className={userClassName}>
          <Image
            width="32"
            height="32"
            src={avatarUrl}
            className="w-8 h-8 rounded-full object-cover"
            alt="User avatar"
          />
          {isExpanded ? (
            <div className="flex flex-col w-full">
              <div className="flex justify-between w-full items-center">
                <p className="text-sm text-white font-[500]">{userFullname}</p>
                <BiChevronRight className="text-2xl text-white opacity-0 group-hover:opacity-100" />
              </div>
              <p className="text-sm text-slate-400">{userEmail}</p>
            </div>
          ) : null}
        </Menu.Button>
        {isExpanded ? <UserSidebarMenu /> : null}
      </Menu>
    </div>
  );
};
