import { Menu } from '@headlessui/react';
import Image from 'next/image';
import { UserSidebarMenu } from '../UserSidebarMenu';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import { cn } from '@/utils/cn';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';

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
    isExpanded ? 'px-4 pl-5 justify-start' : 'px-4 justify-center',
    'group hover:cursor-pointer'
  );

  return (
    <div className="cursor-pointer">
      <div className="relative">
        <Popover>
          <PopoverTrigger>
            <div className={userClassName}>
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
                    <p className="text-sm text-white font-[500]">
                      {userFullname}
                    </p>
                    <ChevronRight className="text-2xl text-white opacity-0 group-hover:opacity-100" />
                  </div>
                  <p className="text-sm text-slate-400">{userEmail}</p>
                </div>
              ) : null}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <UserSidebarMenu />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
