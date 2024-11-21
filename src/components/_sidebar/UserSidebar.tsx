import { fetchSlimOrganizations } from '@/data/user/organizations';
import { cn } from '@/utils/cn';
import { DollarSign, HelpCircle, Home, Layout, Plug, Settings, Star } from 'lucide-react';
import Link from 'next/link';
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
        {/* <ProFeatureGateDialog
          organizationId={organizationId}
          label="Feature Pro"
        /> */}

        <div className="mt-6 mb-6">
          <Link
            href={`/organization/${organizationId}/settings/billing`}
            className="group block p-4 rounded-xl bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-blue-50/90 hover:from-blue-100/90 hover:via-indigo-100/90 hover:to-blue-100/90 transition-all duration-300 shadow-sm hover:shadow-md border border-blue-100/50"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="text-md font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  Upgrade Your Subscription
                </div>


              </div>

              <div className="px-1.5 py-0.5 bg-blue-600/10 rounded-full">
                <span className="text-[10px] font-medium text-blue-600">RECOMMENDED</span>
              </div>

              <div className="flex items-center space-x-0.5 mb-2 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 transform group-hover:scale-110 transition-transform duration-300"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
                <span>Join 1000+ happy users</span>
                <span className="ml-1 transform group-hover:translate-x-0.5 transition-transform duration-300">→</span>
              </div>
            </div>
          </Link>
        </div>

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
