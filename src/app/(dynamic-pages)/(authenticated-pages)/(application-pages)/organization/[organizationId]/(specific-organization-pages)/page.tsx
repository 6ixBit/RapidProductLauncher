import { PageHeading } from '@/components/PageHeading';
import { Suspense } from 'react';
import { z } from 'zod';
import { OrganizationGraphs } from './OrganizationGraphs';
import { OrganizationPageHeading } from './OrganizationPageHeading';
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
