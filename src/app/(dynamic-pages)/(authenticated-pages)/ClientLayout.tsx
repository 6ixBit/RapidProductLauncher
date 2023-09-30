'use client';

import { useUserProfile } from '@/utils/react-queries/user';
import { ReactNode, useState } from 'react';
import { useWindowSize } from 'rooks';
import { UserOnboardingFlow } from './UserOnboardingFlow';
import ReactNoSSR from 'react-no-ssr';
import Confetti from 'react-confetti';
import { Table } from '@/types';
import { UserSidebar } from './Sidebar/UserSidebar';

export function ClientLayout({
  children,
  userProfile: initialUserProfile,
}: {
  children: React.ReactNode;
  userProfile: Table<'user_profiles'>;
}) {
  const { data } = useUserProfile(initialUserProfile);
  const userProfile = data ?? initialUserProfile;
  const { innerHeight: _innerHeight, innerWidth: _innerWidth } =
    useWindowSize();
  const innerHeight = _innerHeight ?? 0;
  const innerWidth = _innerWidth ?? 0;

  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  if (!userProfile.full_name) {
    return (
      <UserOnboardingFlow
        onSuccess={() => {
          setShowConfetti(true);
        }}
        userProfile={userProfile}
      />
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex h-full">
        <UserSidebar userProfile={userProfile} />
        <div className=" flex-1 h-auto overflow-auto">
          <div className="space-y-10">{children}</div>
        </div>
        <ReactNoSSR>
          {showConfetti ? (
            <Confetti
              confettiSource={{
                x: innerWidth / 2,
                y: innerHeight / 3,
                w: 0,
                h: 0,
              }}
              numberOfPieces={150}
              gravity={0.1}
              initialVelocityY={20}
              initialVelocityX={20}
              recycle={false}
              tweenDuration={1000}
              run={true}
              width={innerWidth}
              height={innerHeight}
            />
          ) : null}{' '}
        </ReactNoSSR>
      </div>
    </div>
  );
}
