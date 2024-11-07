import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { SubscriptionTier } from '@/utils/stripe-queries';
import { useQuery } from '@tanstack/react-query';

export const useProductGenerationCount = (
  organizationId: string | undefined,
  subscriptionTier: SubscriptionTier | undefined,
) => {
  return useQuery({
    queryKey: ['productsGeneratedCount', organizationId, subscriptionTier],
    queryFn: async () => {
      if (!organizationId) return 0;

      let startDate = new Date();

      if (subscriptionTier === 'free') {
        startDate.setDate(startDate.getDate() - 30);
      } else {
        const { data: subscription } = await supabaseUserClientComponentClient
          .from('subscriptions')
          .select('current_period_start')
          .eq('organization_id', organizationId)
          .eq('status', 'active')
          .single();

        if (subscription?.current_period_start) {
          startDate = new Date(subscription.current_period_start);
        } else {
          startDate.setDate(startDate.getDate() - 30);
        }
      }

      const { count, error } = await supabaseUserClientComponentClient
        .from('html_templates')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      return count ?? 0;
    },
    enabled: !!organizationId,
  });
};
