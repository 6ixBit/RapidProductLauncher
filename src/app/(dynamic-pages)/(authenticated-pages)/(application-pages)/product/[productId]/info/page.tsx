'use client'

import { TabsNavigation } from '@/components/TabsNavigation';
import H1 from '@/components/Text/H1';
import { Button } from '@/components/ui/button';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { ArrowLeft, Calendar, Code, DollarSign, Link as LinkIcon, SquarePen, UserRound } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = supabaseUserClientComponentClient;
    const productID = params?.productId as string;

    const [productData, setProductData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //TODO: LIST PRODUCTS IN A GRID VIEW.
    //TODO: Add a gneerate product button to far right of Back to Products
    const tabs = [
        {
            label: 'Product Info',
            href: `/product/${productID}/info`,
            icon: <SquarePen />,
        },
        {
            label: 'Page Template',
            href: `/product/${productID}/template`,
            icon: <Code />,
        },
        {
            label: 'Facebook Creatives',
            href: `/product/${productID}/facebook-creatives`,
            icon: <UserRound />,
        },
        {
            label: 'Instagram Creatives',
            href: `/product/${productID}/instagram-creatives`,
            icon: <DollarSign />,
        },
    ];

    useEffect(() => {
        const fetchProductData = async () => {
            if (!productID) return;

            try {
                const { data, error } = await supabase
                    .from('html_templates')
                    .select('*')
                    .eq('id', productID)
                    .single();

                if (error || !data) {
                    setError('Product not found. Please check the URL or return to the product list.');
                    console.error('Error fetching product data:', error);
                } else {
                    setProductData(data);
                }
            } catch (err) {
                setError('An unexpected error occurred');
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productID, supabase]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <H1>Whoops! 😅</H1>
                <p className="text-red-500 mb-8 mt-2">{error}</p>
                <Button onClick={() => router.push('/products')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back To Products
                </Button>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-2">
            <button
                onClick={() => router.push('/products')}
                className="flex items-center mb-6 text-blue-600 hover:text-blue-800"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back To Products
            </button>
            <TabsNavigation tabs={tabs} />

            {productData ? (
                <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                        <H1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{productData.product_title}</H1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{productData.product_sub_heading}</p>
                        <div className="flex justify-between items-center mb-6 mt-8">
                            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                                Recommended Sale Price: ${(parseFloat(productData.product_price.replace('$', '')) * 3).toFixed(2)}
                            </p>
                            <div className="text-right">
                                <div className="flex items-center justify-end mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>Generated on: {formatDate(productData.created_at)}</span>
                                </div>
                                <div className="flex items-center justify-end text-sm text-blue-600 dark:text-blue-400">
                                    <LinkIcon className="w-4 h-4 mr-2" />
                                    <a href={productData.source_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        Original Product Link
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Description</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{productData.product_description}</p>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Customer Reviews</h2>
                            {productData.product_reviews && productData.product_reviews.map((review, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                                    <p className="font-semibold text-gray-900 dark:text-white">{review.name}</p>
                                    <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-8 text-center">
                    <p className="text-xl text-gray-600 dark:text-gray-300">No product data found.</p>
                </div>
            )}
        </div>
    );
}
