'use client';
import { Anchor } from '@/components/Anchor';
import { PageHeading } from '@/components/presentational/tailwind/PageHeading/PageHeading';
import Overline from '@/components/presentational/tailwind/Text/Overline';
import moment from 'moment';
import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';
import { ReactNode } from 'react';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
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
            <T.P className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-4">
              {sidenote}
            </T.P>
          </Anchor>
        </HoverCardTrigger>
        <HoverCardContent className="w-60">
          <T.P className="text-gray-700 leading-6 font-[550]">
            {description}
          </T.P>
        </HoverCardContent>
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
        <div>
          {isSettingsPath ? (
            <Anchor
              href={`/organization/${organizationId}`}
              className="text-blue-800 space-x-2 flex items-center"
            >
              <ArrowLeft className="relative -top-0.5" />
              <Overline className="text-blue-800">
                Back to Organization
              </Overline>
            </Anchor>
          ) : (
            <Overline className="text-blue-800">Organization</Overline>
          )}
        </div>
        <PageHeading
          title={organizationByIdData.title}
          titleHref={`/organization/${organizationId}`}
          actions={
            <div className="flex items-start space-y-1 space-x-2">
              <SubscriptionDetails />

              <div className="flex flex-col space-y-1 items-end">
                <Anchor href={`/organization/${organizationId}/settings`}>
                  <Button variant="outline">
                    <SettingsIcon />
                    <span className="text-sm">View Organization Settings</span>
                  </Button>
                </Anchor>
                <span className="text-xs text-gray-500">
                  Created {moment(organizationByIdData.created_at).fromNow()}
                </span>
              </div>
            </div>
          }
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
