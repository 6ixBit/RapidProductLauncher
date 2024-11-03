'use client';

import GenerateProductModal from '@/components/GenerateProductModal';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { ProductCard } from '@/components/ProductCard';
import {
    TooltipProvider
} from '@/components/ui/tooltip';
import { fetchSlimOrganizations } from '@/data/user/organizations';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import {
    faArrowsRotate,
    faMagicWandSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
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
    const [organizationId, setOrganizationId] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Convert to useInfiniteQuery
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

    // Fetch organization data
    useEffect(() => {
        async function fetchOrganization() {
            try {
                const organizations = await fetchSlimOrganizations();
                setOrganizationId(organizations[0]?.id || null);
            } catch (error) {
                console.error('Error fetching organization:', error);
            }
        }

        if (user) {
            fetchOrganization();
        }
    }, [user]);

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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Your Products</h1>
                    <div className="flex gap-4">
                        <button
                            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
                            onClick={() => setIsModalOpen(true)}
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
                        <p className="text-center text-gray-500">No products found</p>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
