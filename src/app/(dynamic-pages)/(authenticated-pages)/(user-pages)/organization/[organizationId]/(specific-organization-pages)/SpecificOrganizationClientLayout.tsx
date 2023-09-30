'use client';
import { Anchor } from '@/components/Anchor';
import { PageHeading } from '@/components/presentational/tailwind/PageHeading/PageHeading';
import Overline from '@/components/presentational/tailwind/Text/Overline';
import moment from 'moment';
import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';
import { ReactNode } from 'react';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useOrganizationContext } from '@/contexts/OrganizationContext';
import { T } from '@/components/ui/Typography';
import { formatNormalizedSubscription } from '@/utils/formatNormalizedSubscription';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/HoverCard';
const matchSettingsPath = match('/organization/:organizationId/settings/(.*)?');

function SubscriptionDetails() {
  const { normalizedSubscription, organizationId } = useOrganizationContext();

  const { title, sidenote, description } = formatNormalizedSubscription(
    normalizedSubscription
  );

  if (title) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Anchor
            href={`/organization/${organizationId}/settings/billing`}
            className="underline rounded"
          >
            <T.P>
              {title}{' '}
              {sidenote ? <span className="ml-1">{sidenote}</span> : null}
            </T.P>
          </Anchor>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <T.P className="text-blue-500">{description}</T.P>
        </HoverCardContent>
      </HoverCard>
    );
  } else {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Anchor
            className="flex mr-2 p-2"
            href={`/organization/${organizationId}/settings/billing`}
          >
            <T.Small className="font-semibold underline underline-offset-4">
              {sidenote}
            </T.Small>
          </Anchor>
        </HoverCardTrigger>
        <HoverCardContent className="w-60">{description}</HoverCardContent>
      </HoverCard>
    );
  }
}

export function SpecificOrganizationClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isSettingsPath = pathname ? matchSettingsPath(pathname) : false;
  const { organizationByIdData, organizationId } = useOrganizationContext();
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="space-y-0">
        <div className="mb-4">
          {isSettingsPath ? (
            <Anchor
              href={`/organization/${organizationId}`}
              className="group space-x-1 flex items-center"
            >
              <ChevronLeft className="relative text-gray-500 h-4 w-4 hover:-translate-x-10 group-hover:text-gray-800 group-hover:dark:text-gray-400 dark:text-gray-600" />
              <Overline className="text-gray-500 group-hover:text-gray-800 dark:text-gray-600 group-hover:dark:text-gray-400">
                Back to Organization
              </Overline>
            </Anchor>
          ) : (
            <Overline className="text-gray-500 dark:text-gray-600">
              Organization
            </Overline>
          )}
        </div>
        <PageHeading
          title={organizationByIdData.title}
          titleHref={`/organization/${organizationId}`}
          actions={
            <div className="flex items-start space-x-2">
              <div className=" flex items-center mt-1">
                <SubscriptionDetails />
              </div>

              <div className="flex flex-col space-y-1 items-end">
                <Anchor href={`/organization/${organizationId}/settings`}>
                  <Button variant="outline">
                    <SettingsIcon className="mr-2" />
                    <span className="text-sm">View Organization Settings</span>
                  </Button>
                </Anchor>
                <T.Subtle>
                  Created {moment(organizationByIdData.created_at).fromNow()}
                </T.Subtle>
              </div>
            </div>
          }
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
