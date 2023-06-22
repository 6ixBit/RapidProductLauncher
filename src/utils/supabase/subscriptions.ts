import { AppSupabaseClient, NormalizedSubscription } from '@/types';

export const getNormalizedSubscription = async (
  supabase: AppSupabaseClient,
  organizationId: string
): Promise<NormalizedSubscription> => {
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('organization_id', organizationId)
    .in('status', ['trialing', 'active']);

  if (error) {
    throw error;
  }

  if (!subscriptions || subscriptions.length === 0) {
    return {
      type: 'no-subscription',
    };
  }

  try {
    const subscription = subscriptions[0];
    console.log(subscription);

    const price = Array.isArray(subscription.prices)
      ? subscription.prices[0]
      : subscription.prices;
    if (!price) {
      throw new Error('No price found');
    }

    const product = Array.isArray(price.products)
      ? price.products[0]
      : price.products;
    if (!product) {
      throw new Error('No product found');
    }

    if (subscription.status === 'trialing') {
      if (!subscription.trial_start || !subscription.trial_end) {
        throw new Error('No trial start or end found');
      }
      return {
        type: 'trialing',
        trialStart: subscription.trial_start,
        trialEnd: subscription.trial_end,
        product: product,
        price: price,
        subscription,
      };
    } else if (subscription.status) {
      return {
        type: subscription.status,
        product: product,
        price: price,
        subscription,
      };
    } else {
      return {
        type: 'no-subscription',
      };
    }
  } catch (err) {
    return {
      type: 'no-subscription',
    };
  }
};
