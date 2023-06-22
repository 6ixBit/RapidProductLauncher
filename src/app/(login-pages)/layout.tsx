'use client';

import { ReactNode, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LoginHeader from 'public/assets/login-asset-dashboard.png';
import LoginBackground from 'public/assets/image-background-login.png';
import LogoLogin from 'public/assets/logo-login.png';

// do not cache this layout
export const dynamic = 'force-dynamic';
export const fetchCache = 'only-no-store';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    router.prefetch('/dashboard');
  }, []);
  return (
    <div
      className="grid h-screen"
      style={{
        gridTemplateRows: 'auto 1fr',
      }}
    >
      <div className="row-auto"></div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div className="text-center flex flex-col items-center justify-center space-y-8">
          <div>{children}</div>
        </div>
        <div className="relative p-3">
          {/* Background Overlay */}

          {/* Blue Background Image */}
          <div
            className="flex flex-col gap-[56px] bg-cover rounded-2xl bg-opacity-90 h-full px-[96px] pt-20"
            style={{ backgroundImage: `url(${LoginBackground.src})` }}
          >
            <div className="flex w-full space-x-2 items-center justify-start">
              <Image width="48" src={LogoLogin} alt="Logo Login" />
              <p className="text-white text-[20px] font-[480]">Nextbase</p>
            </div>

            <div>
              <Image width="640" src={LoginHeader} alt="Login Header" />
            </div>

            <div className=" w-[640px]">
              <p className="text-white text-3xl font-[600] mb-8 tracking-tight">
                <span className="text-5xl -ml-4">＂</span> <br />
                We are now able to ship our product quicker, allowing us to
                focus on building the features that matter most to our customers
                and not worry about the infrastructure.
              </p>
              <div className="flex justify-between">
                <p className="text-blue-100">⭐️ ⭐️ ⭐️ ⭐️ ⭐️</p>
                <p className="text-blue-100 text-base font-[500]">
                  Jonathan Smith - CEO of Company
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
