'use client';

import GenerateProductModal from '@/components/GenerateProductModal';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { ProductCard } from '@/components/ProductCard';
import {
    TooltipProvider
} from '@/components/ui/tooltip';
import { useFeaturePermissions } from '@/hooks/useFeaturePermissions';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { useOrganizationID } from '@/hooks/useOrganization';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { useStripeData } from '@/utils/stripe-queries';
import {
    faArrowsRotate,
    faMagicWandSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
export interface Product {
    id: string;
    user_id: string;
    organization_id: string;
    html_code: string;
    source_url: string;
    created_at: string;
    product_title: string;
    product_price: string;
    image_url: string;
    thumbnail_url: string;
    language: string;
    is_imported_to_shopify: boolean;
    shopify_product_url: string;
}

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
    const user = useLoggedInUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch,
        remove
    } = useInfiniteQuery({
        queryKey: ['products', user?.id],
        queryFn: async ({ pageParam = null }) => {
            if (!user) throw new Error('No user found');

            let query = supabaseUserClientComponentClient
                .from('html_templates')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(ITEMS_PER_PAGE);

            if (pageParam) {
                query = query.lt('created_at', pageParam);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as unknown as Product[];
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.length < ITEMS_PER_PAGE) return undefined;
            return lastPage[lastPage.length - 1]?.created_at;
        },
        enabled: !!user,
        staleTime: 1000 * 60, // Consider data stale after 1 minute
        cacheTime: 1000 * 60 * 5, // Keep cache for 5 minutes
    });

    // Initialize intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 },
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage]);

    const { data: organizationId } = useOrganizationID();
    const { subscriptionTier } = useStripeData();
    console.log('organizationId', organizationId);
    console.log('subscriptionTier', subscriptionTier);

    // Get count of products generated in last 30 days
    const { data: productsGeneratedCount, isLoading: isLoadingProductsGeneratedCount } = useQuery({
        queryKey: ['productsGeneratedCount', organizationId, subscriptionTier],
        queryFn: async () => {
            if (!organizationId) return 0;

            let startDate = new Date();

            if (subscriptionTier === 'free') {
                // For free users, use rolling 30-day window
                startDate.setDate(startDate.getDate() - 30);
            } else {
                // For paid users, get their billing cycle start date
                const { data: subscription } = await supabaseUserClientComponentClient
                    .from('subscriptions')
                    .select('current_period_start')
                    .eq('organization_id', organizationId)
                    .eq('status', 'active')
                    .single();

                if (subscription?.current_period_start) {
                    startDate = new Date(subscription.current_period_start);
                } else {
                    // Fallback to 30-day window if no subscription found
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

    const permissions = useFeaturePermissions(
        subscriptionTier,
        0,
        productsGeneratedCount || 0
    );
    console.log('permissions', permissions);
    console.log('productsGeneratedCount', productsGeneratedCount, isLoadingProductsGeneratedCount);

    const handleGenerateProduct = async (
        source: string,
        url: string,
        language: string,
    ): Promise<void> => {
        if (!user || !organizationId) return;

        try {
            const response = await fetch('/api/fetch-aliexpress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    source,
                    url,
                    language,
                    user_id: user.id,
                    organization_id: organizationId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            if (data.productID) {
                // Invalidate and refetch products after successful generation
                queryClient.invalidateQueries({ queryKey: ['products', user.id] });
                router.push(`/product/${data.productID}/info`);
            } else {
                console.error('Product ID not received in the response');
            }
        } catch (error) {
            console.error('Error generating product:', error);
        }
    };

    const handleRefresh = async () => {
        // Remove the existing query data
        remove();
        // Refetch from scratch
        refetch({ refetchPage: (_: number, index: number) => index === 0 });
    };

    const allProducts = data?.pages.flat() ?? [];

    return (
        <TooltipProvider>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold">Your Products</h1>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-600 font-medium">
                                        {permissions.products.current} / {permissions.products.limit}
                                    </span>
                                    <div className="h-2 ml-3 w-32 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 transition-all duration-300"

                                            style={{
                                                width: permissions.products?.current && permissions.products?.limit
                                                    ? `${(permissions.products.current / permissions.products.limit) * 100}%`
                                                    : '0%'
                                            }}
                                        />
                                    </div>
                                </div>
                                {subscriptionTier !== 'mega_scaler' &&
                                    (
                                        <Link
                                            href={`/organization/${organizationId}/settings/billing`}
                                            className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
                                        >
                                            Upgrade to generate more products →
                                        </Link>
                                    )}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                className={`px-6 py-2 bg-blue-500 text-white rounded-full transition-colors duration-200 
                                    ${!permissions.products.canAccess
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-blue-600'}`}
                                onClick={() => setIsModalOpen(true)}
                                disabled={!permissions.products.canAccess}
                                title={permissions.products.reason}
                            >
                                <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
                                Generate
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                                onClick={handleRefresh}
                            >
                                <FontAwesomeIcon
                                    icon={faArrowsRotate}
                                    className="transition-transform duration-200 hover:rotate-180"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <GenerateProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onGenerate={handleGenerateProduct}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div ref={loadMoreRef} className="mt-8">
                    {isLoading && <LoadingSpinner />}
                    {isError && (
                        <div className="text-center">
                            <p className="text-red-500 mb-2">
                                {error instanceof Error ? error.message : 'Failed to load products'}
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                    {isFetchingNextPage && <LoadingSpinner />}
                    {!hasNextPage && allProducts.length > 0 && !isError && (
                        <p className="text-center text-gray-500">End Of Products</p>
                    )}
                    {!hasNextPage && allProducts.length === 0 && !isError && (
                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-semibold text-red-500">No Products Yet</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Get ahead by generating your first product using our AI-powered product generator.
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 inline-flex items-center"
                            >
                                <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
                                Generate Your First Product
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
