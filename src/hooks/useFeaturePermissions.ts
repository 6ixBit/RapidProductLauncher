import {
  PRODUCT_GENERATION_LIMITS,
  STORE_LIMITS,
  SubscriptionTier,
} from '@/utils/stripe-queries';

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
  productsGeneratedCount: number,
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

  const getProductGenerationPermissions = (): FeaturePermission => {
    if (!subscriptionTier) {
      return {
        canAccess: false,
        canRemove: false,
        reason: 'Loading subscription information...',
      };
    }

    const generationLimit = PRODUCT_GENERATION_LIMITS[subscriptionTier];
    const canGenerate = productsGeneratedCount <= generationLimit;

    return {
      canAccess: canGenerate,
      canRemove: false,
      limit: generationLimit,
      current: productsGeneratedCount,
      reason: canGenerate
        ? undefined
        : subscriptionTier === 'free'
          ? `You've reached the free tier limit (${generationLimit} products). Upgrade to Solo Scaler to generate up to 50 products!`
          : `You've reached the maximum product generation limit (${generationLimit}) for your ${subscriptionTier} plan`,
    };
  };

  return {
    stores: getStorePermissions(),
    products: getProductGenerationPermissions(),
    // Add more feature permissions here as needed
    // example: products: getProductPermissions(),
    // example: analytics: getAnalyticsPermissions(),
  };
};
