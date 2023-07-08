import { getOrganizationById } from '@/utils/supabase-queries';
import { ReactNode } from 'react';
import { z } from 'zod';
import { AppSupabaseClient } from '@/types';
import { getUserOrganizationRole } from '@/utils/supabase/organizations';
import { notFound } from 'next/navigation';
import { getNormalizedSubscription } from '@/utils/supabase/subscriptions';
import { OrganizationContextProvider } from '@/contexts/OrganizationContext';
import { supabaseUserServerComponentClient } from '@/supabase-clients/user/supabaseUserServerComponentClient';

const paramsSchema = z.object({
  organizationId: z.string(),
});

async function fetchData(supabase: AppSupabaseClient, organizationId: string) {
  const { data: sessionResponse, error: userError } =
    await supabase.auth.getSession();
  if (!sessionResponse || !sessionResponse.session?.user) {
    throw new Error('User not found');
  }
  if (userError) {
    throw userError;
  }

  const [organizationByIdData, organizationRole, normalizedSubscription] =
    await Promise.all([
      getOrganizationById(supabase, organizationId),
      getUserOrganizationRole(
        supabase,
        sessionResponse.session.user.id,
        organizationId
      ),
      getNormalizedSubscription(supabase, organizationId),
    ]);

  return {
    organizationByIdData,
    organizationRole,
    normalizedSubscription,
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: any;
}) {
  try {
    const { organizationId } = paramsSchema.parse(params);
    const { organizationByIdData, organizationRole, normalizedSubscription } =
      await fetchData(supabaseUserServerComponentClient, organizationId);
    return (
      <OrganizationContextProvider
        normalizedSubscription={normalizedSubscription}
        organizationRole={organizationRole}
        organizationId={organizationId}
        organizationByIdData={organizationByIdData}
      >
        {children}
      </OrganizationContextProvider>
    );
  } catch (error) {
    console.log(error);
    return notFound();
  }
}
