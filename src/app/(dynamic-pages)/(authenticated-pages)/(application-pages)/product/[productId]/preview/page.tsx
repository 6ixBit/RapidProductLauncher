'use client'

import { TabsNavigation } from '@/components/TabsNavigation';
import H1 from '@/components/Text/H1';
import { Button } from '@/components/ui/button';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { ArrowLeft, DollarSign, SquarePen, UserRound } from 'lucide-react';
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

    const tabs = [
        {
            label: 'Product Preview',
            href: `/product/${productID}/preview`,
            icon: <SquarePen />,
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
        {
            label: 'TikTok',
            href: `/product/${productID}/tiktok-creatives`,
            icon: <DollarSign />,
        },
    ];

    useEffect(() => {
        const fetchProductData = async () => {
            if (!productID) return;

            try {
                const { data, error } = await supabase
                    .from('html_templates')
                    .select('product_title, product_price, product_description')
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
                <Button
                    onClick={() => router.push('/products')}

                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back To Products
                </Button>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => router.push('/products')}
                className="flex items-center mb-4 text-blue-600 hover:text-blue-800"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back To Products
            </button>
            <TabsNavigation tabs={tabs} />

            {/* <H1>Product Preview</H1> */}
            {productData ? (
                <div>
                    <h2>{productData.product_title}</h2>
                    <p>Price: {productData.product_price}</p>
                    <p>Description: {productData.product_description}</p>
                </div>
            ) : (
                <p>No product data found.</p>
            )}
        </div>
    );
}

