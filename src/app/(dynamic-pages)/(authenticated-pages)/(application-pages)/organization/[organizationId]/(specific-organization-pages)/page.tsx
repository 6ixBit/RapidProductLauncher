import { PageHeading } from '@/components/PageHeading';
import { Suspense } from 'react';
import { z } from 'zod';
import { OrganizationPageHeading } from './OrganizationPageHeading';
import { WelcomeHeader } from "./home";

const paramsSchema = z.object({
  organizationId: z.coerce.string(),
});

export default async function OrganizationPage({
  params,
}: {
  params: unknown;
}) {
  const parsedParams = paramsSchema.parse(params);
  const { organizationId } = parsedParams;
  return (
    <div className="">
      <div className="space-y-0 block lg:hidden">
        <Suspense
          fallback={
            <PageHeading
              title={'Loading...'}
              isLoading
              titleHref={`/organization/${organizationId}`}
            />
          }
        >
          <OrganizationPageHeading organizationId={organizationId} />
        </Suspense>
      </div>

      <div>
        <Suspense>
          {/* <OrganizationGraphs /> */}

          <WelcomeHeader userEmail={"real@real.com"} userName={"Real"} />
        </Suspense>
      </div>
    </div>
  );
}
