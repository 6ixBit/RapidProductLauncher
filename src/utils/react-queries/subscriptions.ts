import { useQuery } from '@tanstack/react-query';
import { getNormalizedSubscription } from '../supabase/subscriptions';
import supabaseClient from '@/utils/supabase-browser';
import { UnwrapPromise } from '@/types';

export const useGetNormalizedSubscription = (
  organizationId: string,
  initialData?: UnwrapPromise<ReturnType<typeof getNormalizedSubscription>>
) => {
  const query = useQuery(
    ['normalized-subscription', organizationId],
    () => getNormalizedSubscription(supabaseClient, organizationId),
    {
      enabled: !!organizationId,
      initialData,
    }
  );

  return query;
};
