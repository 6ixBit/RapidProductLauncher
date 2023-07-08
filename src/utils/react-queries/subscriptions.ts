import { useQuery } from '@tanstack/react-query';
import { getNormalizedSubscription } from '../supabase/subscriptions';
import { UnwrapPromise } from '@/types';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';

export const useGetNormalizedSubscription = (
  organizationId: string,
  initialData?: UnwrapPromise<ReturnType<typeof getNormalizedSubscription>>
) => {
  const query = useQuery(
    ['normalized-subscription', organizationId],
    () =>
      getNormalizedSubscription(
        supabaseUserClientComponentClient,
        organizationId
      ),
    {
      enabled: !!organizationId,
      initialData,
    }
  );

  return query;
};
