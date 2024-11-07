import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { stripe } from '@/utils/stripe';
import { getUserOrganization } from '@/utils/supabase-queries';
import { useQuery } from '@tanstack/react-query';
import Stripe from 'stripe';

export type SubscriptionTier =
  | 'free'
  | 'solo_scaler'
  | 'mega_scaler'
  | 'super_scaler';

// Define price IDs in a constant for better maintainability
const PRICE_IDS = {
  SOLO_SCALER: 'price_1QDe19Lh3oF1u37cBCbcleRf',
  MEGA_SCALER: 'price_1QDdwILh3oF1u37cGggCxLYC',
  SUPER_SCALER: 'price_1QDe0QLh3oF1u37cWjIelL64',
} as const;

export const STORE_LIMITS: Record<SubscriptionTier, number> = {
  free: 1,
  solo_scaler: 1,
  mega_scaler: 3,
  super_scaler: 6,
};

export const PRODUCT_GENERATION_LIMITS: Record<SubscriptionTier, number> = {
  free: 3,
  solo_scaler: 50,
  mega_scaler: 125,
  super_scaler: 250,
};

export async function isCustomerInFreeTrial(
  stripe: Stripe,
  customerId: string,
): Promise<boolean> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    const subscription = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'trialing',
    });

    return subscription.data.length > 0;
  } catch (error) {
    console.error('Error checking trial status:', error);
    return false;
  }
}

export async function hasCustomerSubscription(
  stripe: Stripe,
  customerId: string,
): Promise<boolean> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
  });

  return subscriptions.data.length > 0;
}

export async function getCustomerSubscriptionTier(
  stripe: Stripe,
  customerId: string,
): Promise<SubscriptionTier> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.plan'],
    });

    if (subscriptions.data.length === 0) {
      return 'free'; // Changed from 'solo_scaler' to 'free' as default
    }

    const planId = subscriptions.data[0].items.data[0].plan?.id;

    switch (planId) {
      case PRICE_IDS.SOLO_SCALER:
        return 'solo_scaler';
      case PRICE_IDS.MEGA_SCALER:
        return 'mega_scaler';
      case PRICE_IDS.SUPER_SCALER:
        return 'super_scaler';
      default:
        return 'free';
    }
  } catch (error) {
    console.error('Error fetching subscription tier:', error);
    return 'free'; // Fallback to free tier on error
  }
}

export async function startFreeTrial(
  stripe: Stripe,
  customerId: string,
  planId: string,
  trialDays: number,
): Promise<Stripe.Subscription | null> {
  if (!trialDays || trialDays <= 0) {
    return null;
  }

  const trialEnd = Math.floor(Date.now() / 1000) + trialDays * 86400;

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ plan: planId }],
    trial_end: trialEnd,
  });

  return subscription;
}

// Helper function to check if user can add more stores
export function canAddMoreStores(
  currentTier: SubscriptionTier,
  currentStoreCount: number,
): boolean {
  return currentStoreCount < STORE_LIMITS[currentTier];
}

const getStripeCustomerId = async (supabase: any, organizationId: string) => {
  const { data, error } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('organization_id', organizationId)
    .single();

  if (error) {
    console.error('Error fetching stripe customer id:', error);
    return null;
  }

  return data?.stripe_customer_id;
};

// Usage in a React Query hook
export const useStripeCustomerId = (
  supabase: any,
  organizationId: string | undefined,
) => {
  return useQuery({
    queryKey: ['stripeCustomerId', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      return getStripeCustomerId(supabase, organizationId);
    },
    enabled: !!organizationId,
  });
};

export const useStripeData = () => {
  const supabaseClient = supabaseUserClientComponentClient;
  const user = useLoggedInUser();

  const { data: organizationId } = useQuery({
    queryKey: ['userOrganization', user?.id],
    queryFn: () => getUserOrganization(supabaseClient, user?.id),
    enabled: !!user,
  });

  const { data: stripeCustomerId } = useStripeCustomerId(
    supabaseClient,
    organizationId,
  );

  const { data: subscriptionTier } = useQuery({
    queryKey: ['subscriptionTier', stripeCustomerId],
    queryFn: async () => {
      // If there's no stripeCustomerId, the user is on free tier
      if (!stripeCustomerId) return 'free';
      return getCustomerSubscriptionTier(stripe, stripeCustomerId);
    },
  });

  return {
    stripeCustomerId,
    // Default to 'free' if subscriptionTier is undefined
    subscriptionTier: subscriptionTier ?? 'free',
    isLoading: false, // We can always determine the tier now
  };
};
