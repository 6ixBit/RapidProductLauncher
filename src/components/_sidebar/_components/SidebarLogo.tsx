import { T } from '@/components/ui/Typography';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/logos/rpd-logo.png';
import { SidebarClose } from './SidebarClose';

export function SidebarLogoAndToggle() {
  return (
    <div className="flex justify-between items-center w-full mb-5">
      <Link
        href="/dashboard"
        className="ml-2 cursor-pointer flex items-center gap-1 w-full"
      >
        <Image
          width={36}
          src={logo}
          alt="RPL Logo"
          className={cn(
            'rotate-0 scale-100 transition-all',
            '-ml-2 ',
          )}
        />
        <Image
          width={36}
          src={logo}
          alt="RPL Logo"
          className={cn(
            ' absolute rotate-90 scale-0 transition-all',
            '-ml-2 ',
          )}
        />

        <T.P className="text-sm font-medium text-foreground">
          Rapid Product Launcher
        </T.P>
      </Link>

      <SidebarClose />
    </div>
  );
}
