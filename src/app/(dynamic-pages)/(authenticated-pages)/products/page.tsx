'use client'

import GenerateProductModal from '@/components/GenerateProductModal';
import { fetchSlimOrganizations } from '@/data/user/organizations';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
    id: string;
    user_id: string;
    organization_id: string;
    html_code: string;
    source_url: string;
    created_at: string;
}

const ProductCard = ({ product }) => (
    <Link href={`/product/${product.id}/info`}>
        <div className="border rounded-lg p-3 shadow-md text-sm cursor-pointer hover:shadow-lg transition-shadow">
            <Image
                src={product.image_url || '/placeholder-image.jpg'}
                alt={product.product_title}
                width={150}
                height={150}
                className="w-full h-32 object-cover mb-2 rounded"
            />
            <h2 className="font-semibold truncate">{product.product_title}</h2>
            <p className="text-gray-600 mb-3">{product.product_price}</p>
            <div className="flex justify-between items-center text-xs">
                <span className="bg-gray-200 px-2 py-1 rounded">{product.language || 'Unknown'}</span>
                <Link
                    href={product.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ExternalLink size={14} className="mr-1" />
                    Supplier URL
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
    const supabase = supabaseUserClientComponentClient;
    const router = useRouter();

    useEffect(() => {
        async function fetchOrganizationAndProducts() {
            const organizations = await fetchSlimOrganizations();
            setOrganizationId(organizations[0]?.id || null);

            if (user) {
                const { data, error } = await supabase
                    .from('html_templates')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) {
                    console.error('Error fetching products:', error);
                } else {
                    setProducts(data);
                }
            }
        }

        fetchOrganizationAndProducts();
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
            console.log('Response from fetch:', data);

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
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Your Products</h1>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => setIsModalOpen(true)}
                >
                    Generate Product
                </button>
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
        </div>
    );
}
