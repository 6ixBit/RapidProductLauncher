import { fetchSlimOrganizations } from '@/data/user/organizations';
import { cn } from '@/utils/cn';
import { DollarSign, HelpCircle, Home, Layout, Plug, Settings } from 'lucide-react';
import { SidebarLink } from './SidebarLink';
import { SidebarLogoAndToggle } from './_components/SidebarLogo';

export async function UserSidebar() {
  const organizations = await fetchSlimOrganizations();
  const organizationId = organizations[0]?.id;

  return (
    <div className={cn('flex flex-col h-full', 'lg:px-3 lg:py-1 lg:pt-2.5')}>
      <div className="flex justify-between items-center mb-4">
        <SidebarLogoAndToggle />
      </div>
      <div className="flex flex-col space-y-1">
        {organizationId && (
          <SidebarLink
            label="Dashboard"
            href={`/organization/${organizationId}`}
            icon={<Home className="h-5 w-5 text-blue-500" />}
          />
        )}
        <SidebarLink
          label="Products"
          href={`/products`}
          icon={<Layout className="h-5 w-5 text-blue-600" />}
        />
        <SidebarLink
          label="Store Integrations"
          href={`/integrations`}
          icon={<Plug className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <div className="flex flex-col space-y-1 mt-auto">
        <SidebarLink
          label="Billing"
          href={`/organization/${organizationId}/settings/billing`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <SidebarLink
          label="Help"
          href="/help"
          icon={<HelpCircle className="h-5 w-5" />}
        />
        <SidebarLink
          label="Account Settings"
          href="/settings"
          icon={<Settings className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}
