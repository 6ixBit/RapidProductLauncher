import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className=" flex-1 h-auto max-w-[1296px] overflow-auto">
      <div className=" px-12 py-8 space-y-10">{children}</div>
    </div>
  );
}
