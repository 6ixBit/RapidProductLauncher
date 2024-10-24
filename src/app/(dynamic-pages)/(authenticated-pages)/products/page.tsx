'use client'

import GenerateProductModal from '@/components/GenerateProductModal';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fetchSlimOrganizations } from '@/data/user/organizations';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

//TODO: AWS Img URL - https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/Hc28c56baf7eb4b549e5ed454e9023bf3Y.jpeg

interface Product {
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
}

const ITEMS_PER_PAGE = 8;
const languageToEmoji = (language: string) => {
    switch (language.toLowerCase()) {
        case 'english':
            return '🇬🇧';
        case 'spanish':
            return '🇪🇸';
        case 'french':
            return '🇫🇷';
        case 'german':
            return '🇩🇪';
        case 'italian':
            return '🇮🇹';
        default:
            return '❓'; // Default emoji for unknown languages
    }
};


const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/product/${product.id}/info`}>
        <div className="border rounded-lg p-3 shadow-md text-sm cursor-pointer hover:shadow-lg transition-shadow">
            <Image
                src={product.thumbnail_url || ""}
                alt={product.product_title}
                width={150}
                height={150}
                className="w-full h-32 object-cover mb-2 rounded"
            />
            <h2 className="font-semibold truncate">{product.product_title}</h2>
            <p className="text-gray-600 mb-3">{product.product_price}</p>
            <div className="flex justify-between items-center text-xs">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="bg-gray-200 px-2 py-1 rounded">
                            {languageToEmoji(product.language || 'Unknown')}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        {`This product page was generated in ${product.language || 'an unknown language'}.`}
                    </TooltipContent>
                </Tooltip>
                <Link
                    href={product.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ExternalLink size={14} className="mr-1" />
                    Source URL
                </Link>
            </div>
        </div>
    </Link>
);

export default function ProductsPage() {
    const user = useLoggedInUser();
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [organizationId, setOrganizationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastFetchedId, setLastFetchedId] = useState<string | null>(null);
    const supabase = supabaseUserClientComponentClient;
    const router = useRouter();

    const loadMoreRef = useRef<HTMLDivElement>(null);

    const fetchProducts = async () => {
        if (!user || isLoading || !hasMore) return;

        setIsLoading(true);
        setError(null);

        try {
            // First, get the total count if we don't have it
            if (totalCount === null) {
                const { count, error: countError } = await supabase
                    .from('html_templates')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                if (countError) throw countError;
                setTotalCount(count || 0);

                if (count === 0) {
                    setHasMore(false);
                    setIsLoading(false);
                    return;
                }
            }

            let query = supabase
                .from('html_templates')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(ITEMS_PER_PAGE);

            // If we have a last fetched ID, use it for pagination
            if (lastFetchedId) {
                const lastProduct = products.find(p => p.id === lastFetchedId);
                if (lastProduct) {
                    query = query.lt('created_at', lastProduct.created_at);
                }
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;

            if (data && data.length > 0) {
                // Update the last fetched ID
                setLastFetchedId(data[data.length - 1].id);

                // Merge new products while maintaining uniqueness
                setProducts(prevProducts => {
                    const productMap = new Map(prevProducts.map(p => [p.id, p]));
                    data.forEach(product => {
                        productMap.set(product.id, product as Product);
                    });
                    return Array.from(productMap.values())
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                });

                // Update hasMore based on whether we got a full page of items
                setHasMore(data.length === ITEMS_PER_PAGE);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again.');
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    fetchProducts();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isLoading, lastFetchedId]);

    // Fetch initial data and handle organization
    useEffect(() => {
        async function fetchOrganizationAndProducts() {
            try {
                const organizations = await fetchSlimOrganizations();
                setOrganizationId(organizations[0]?.id || null);
                if (user) {
                    // Reset states for initial fetch
                    setLastFetchedId(null);
                    setProducts([]);
                    fetchProducts();
                }
            } catch (error) {
                console.error('Error fetching organization:', error);
                setError('Failed to load organization data.');
            }
        }

        fetchOrganizationAndProducts();
    }, [user]);

    const handleRetry = () => {
        setError(null);
        setHasMore(true);
        setLastFetchedId(null);
        setProducts([]);
        fetchProducts();
    };

    const handleRefresh = async () => {
        setProducts([]);
        setTotalCount(null);
        setHasMore(true);
        setError(null);
        setLastFetchedId(null);
        await fetchProducts();
    };

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
                router.push(`/product/${data.productID}/info`);
            } else {
                console.error('Product ID not received in the response');
            }
        } catch (error) {
            console.error('Error generating product:', error);
        }
    };

    return (
        <TooltipProvider>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Your Products</h1>
                    <div className="flex gap-4">
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            onClick={handleRefresh}
                        >
                            Refresh
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Generate Product
                        </button>
                    </div>
                </div>

                <GenerateProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onGenerate={handleGenerateProduct}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div ref={loadMoreRef} className="mt-8">
                    {isLoading && <LoadingSpinner />}
                    {error && (
                        <div className="text-center">
                            <p className="text-red-500 mb-2">{error}</p>
                            <button
                                onClick={handleRetry}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                    {!hasMore && products.length > 0 && !error && (
                        <p className="text-center text-gray-500">End Of Products</p>
                    )}
                    {!hasMore && products.length === 0 && !error && (
                        <p className="text-center text-gray-500">No products found</p>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
