import { z } from 'zod';
import { Suspense } from 'react';
import { PageHeading } from '@/components/presentational/tailwind/PageHeading';
import { OrganizationPageHeading } from './OrganizationPageHeading';
import { OrganizationGraphs } from './OrganizationGraphs';
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
          <OrganizationGraphs />
        </Suspense>
      </div>
    </div>
  );
}
