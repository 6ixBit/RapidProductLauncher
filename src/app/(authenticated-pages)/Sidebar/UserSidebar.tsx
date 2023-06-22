'use client';
import { Anchor } from '@/components/Anchor';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useState } from 'react';
import Logo from 'public/logos/logo.png';
import { AppSidebar } from '@/components/presentational/tailwind/Sidebars/AppSidebar';
import { SidebarBottom } from '@/components/presentational/tailwind/Sidebars/SidebarBottom';
import { Table } from '@/types';
import { useUserProfile } from '@/utils/react-queries/user';
import { getUserAvatarUrl } from '@/utils/helpers';
import { useLoggedInUserEmail } from '@/hooks/useLoggedInUserEmail';

export function UserSidebar({
  userProfile: initialUserProfile,
}: {
  userProfile: Table<'user_profiles'>;
}) {
  const { data: _userProfile } = useUserProfile(initialUserProfile);
  const userProfile = _userProfile ?? initialUserProfile;
  const userEmail = useLoggedInUserEmail();
  const avatarUrl = getUserAvatarUrl({
    email: userEmail,
    profileAvatarUrl: userProfile.avatar_url ?? undefined,
  });
  const [isExpanded, toggleIsExpanded] = useState<boolean>(false);
  const nextbaseIconClassName = cn(
    `flex w-full mt-2 gap-2 items-center py-3 mb-1 text-white h-[64px] rounded-lg`,
    isExpanded ? 'px-6 justify-start' : 'justify-center'
  );

  return (
    <div
      className="bg-slate-900 space-y-2 grid grid-rows-4"
      style={{
        gridTemplateRows: 'auto auto 1fr auto',
      }}
    >
      <div>
        <Anchor href="/dashboard" className={nextbaseIconClassName}>
          <Image width={28} src={Logo} alt="Logo Login" />
          {isExpanded ? (
            <span className="text-xl font-[500]">Nextbase</span>
          ) : null}
        </Anchor>
      </div>
      <AppSidebar isExpanded={isExpanded} toggleIsExpanded={toggleIsExpanded} />
      <div />
      <SidebarBottom
        avatarUrl={avatarUrl}
        userFullname={userProfile.full_name ?? 'User'}
        isExpanded={isExpanded}
        userEmail={userEmail}
      />
    </div>
  );
}
