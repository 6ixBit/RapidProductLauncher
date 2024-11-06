import { STORE_LIMITS, SubscriptionTier } from '@/utils/stripe-queries';

type FeaturePermission = {
  canAccess: boolean;
  canRemove: boolean;
  reason?: string;
  limit?: number;
  current?: number;
};

export const useFeaturePermissions = (
  subscriptionTier: SubscriptionTier | undefined,
  currentStoreCount: number,
) => {
  const getStorePermissions = (): FeaturePermission => {
    if (!subscriptionTier) {
      return {
        canAccess: false,
        canRemove: false,
        reason: 'Loading subscription information...',
      };
    }

    const storeLimit = STORE_LIMITS[subscriptionTier];
    const canAddMore = currentStoreCount < storeLimit;
    const canRemove = subscriptionTier !== 'free';

    return {
      canAccess: canAddMore,
      canRemove,
      limit: storeLimit,
      current: currentStoreCount,
      reason: canAddMore
        ? undefined
        : `You've reached the maximum store limit (${storeLimit}) for your ${subscriptionTier} plan`,
    };
  };

  return {
    stores: getStorePermissions(),
    // Add more feature permissions here as needed
    // example: products: getProductPermissions(),
    // example: analytics: getAnalyticsPermissions(),
  };
};
