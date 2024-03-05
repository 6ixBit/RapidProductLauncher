import { cn } from '@/utils/cn';
import HomeIcon from 'lucide-react/dist/esm/icons/home';
import InvitationsIcon from 'lucide-react/dist/esm/icons/mail';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import SecurityIcon from 'lucide-react/dist/esm/icons/shield';
import { SidebarLink } from './SidebarLink';
import { SidebarLogoAndToggle } from './_components/SidebarLogo';

export async function UserSidebar() {
  return (
    <div
      className={cn(
        'flex flex-col justify-between h-full',
        'lg:px-3 lg:py-4 lg:pt-2.5 ',
      )}
    >
      <div className="flex justify-between items-center">
        <SidebarLogoAndToggle />
      </div>
      <div className="">
        <SidebarLink
          label="Dashboard"
          href="/dashboard"
          icon={<HomeIcon className="h-5 w-5" />}
        />
        <SidebarLink
          label="Account Settings"
          href="/settings"
          icon={<SettingsIcon className="h-5 w-5" />}
        />
        <SidebarLink
          label="Security Settings"
          href="/settings/security"
          icon={<SecurityIcon className="h-5 w-5" />}
        />
        <SidebarLink
          label="Invitations"
          href="/invitations"
          icon={<InvitationsIcon className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}
