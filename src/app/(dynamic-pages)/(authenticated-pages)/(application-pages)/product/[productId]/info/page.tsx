'use client';

import DeleteModal from '@/components/DeleteModal';
import GenerateProductModal from '@/components/GenerateProductModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TabsNavigation } from '@/components/TabsNavigation';
import H1 from '@/components/Text/H1';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getDefaultOrganization } from '@/data/user/organizations';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { faFacebook, faInstagram, faShopify } from '@fortawesome/free-brands-svg-icons';
import { faBolt, faCircleCheck, faMagicWandSparkles, faStore, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArrowLeft, Calendar, Code, ExternalLink, Link as LinkIcon, SquarePen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { deleteProduct, formatDate, getConnectedShopifyStores, productHasBeenImportedToShopify } from './utils';


export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = supabaseUserClientComponentClient;
    const productID = params?.productId as string;
    const user = useLoggedInUser();
    const [productData, setProductData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [organizationId, setOrganizationId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchOrg = async () => {
            const org = await getDefaultOrganization();
            setOrganizationId(org);
        };
        fetchOrg();
    }, []);

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
            icon: <FontAwesomeIcon icon={faFacebook} size="lg" color="#1877F2" />,
        },
        {
            label: 'Instagram Creatives',
            href: `/product/${productID}/instagram-creatives`,
            icon: (
                <FontAwesomeIcon
                    icon={faInstagram}
                    size="lg"
                    style={{ color: '#E1306C' }}
                />
            ),
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
                    setError(
                        'Product not found. Please check the URL or return to the product list.',
                    );
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
    return (
        <div className="max-w-6xl mx-auto px-4 py-2">
            <div className="flex flex-col gap-4">
                <button
                    className="w-full lg:hidden px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => setIsModalOpen(true)}
                >
                    <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
                    Generate New Product
                </button>
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0 w-full">
                    <div className="w-full overflow-x-auto">
                        <TabsNavigation tabs={tabs} />
                    </div>
                    <button
                        className="hidden lg:flex px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
                        Generate
                    </button>
                </div>
            </div>

            <GenerateProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGenerate={handleGenerateProduct}
            />

            {productData ? (
                <div className="mt-1 bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row">
                        {productData.thumbnail_url && (
                            <div className="mb-4 md:mb-0 md:mr-6">
                                <Image
                                    src={productData.thumbnail_url || ''}
                                    alt={productData.product_title}
                                    width={400} // Adjust width as needed
                                    height={300} // Adjust height as needed
                                    className="object-cover rounded"
                                    priority
                                />
                            </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <H1 className="text-3xl font-bold mb-4 text-gray-900 ">
                                    {productData.product_title}
                                </H1>
                                {/* <p className="text-xl text-gray-600 mb-4">{productData.product_sub_heading}</p> */}

                                <div className="mb-6">
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mt-6">
                                            <p className="text-2xl font-semibold text-green-600">
                                                $
                                                {(
                                                    parseFloat(
                                                        productData.product_price.replace('$', ''),
                                                    ) * 3
                                                ).toFixed(2)}
                                            </p>
                                            {productData.is_imported_to_shopify ? (
                                                <Link
                                                    href={productData.shopify_product_url || ''}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Badge variant="shopify">
                                                        <FontAwesomeIcon
                                                            icon={faShopify}
                                                            className="mr-2"
                                                        />
                                                        Imported
                                                    </Badge>
                                                </Link>
                                            ) : (
                                                <Badge variant="default">
                                                    <FontAwesomeIcon icon={faShopify} className="mr-2" />
                                                    Not Imported
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>
                                            Generated on {formatDate(productData.created_at)}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-blue-600">
                                        <LinkIcon className="w-4 h-4 mr-2" />
                                        <a
                                            href={productData.source_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            Sourcing URL
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white">
                                            <FontAwesomeIcon icon={faBolt} className='mr-2' />
                                            Actions
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={async () => {
                                                // Show loading toast immediately
                                                const loadingToast = toast.loading(
                                                    <div className="flex items-center">
                                                        <LoadingSpinner className="w-4 h-4 mr-2" />
                                                        <span>Importing product to Shopify...</span>
                                                    </div>
                                                );

                                                const { data: shopifyIntegration, error } = await getConnectedShopifyStores(user.id);

                                                if (error || !shopifyIntegration) {
                                                    toast.dismiss(loadingToast);
                                                    toast.error('No connected Shopify store found.');
                                                    return;
                                                }

                                                const productPayload = {
                                                    title: productData.product_title,
                                                    body_html: productData.html_code,
                                                    vendor: productData.user_id,
                                                    product_type: productData.product_sub_heading,
                                                    variants: [
                                                        {
                                                            price: parseFloat(productData.product_price.replace('$', '')),
                                                        },
                                                    ],
                                                    images: productData.image_urls,
                                                };

                                                try {
                                                    const response = await fetch('/api/import-prod-to-shopify', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({
                                                            shopify_store_url: shopifyIntegration.myshopify_domain,
                                                            admin_api_key: shopifyIntegration.admin_api_key,
                                                            product: productPayload,
                                                        }),
                                                    });

                                                    if (response.ok) {
                                                        const importedProduct = await response.json();
                                                        const shopifyStoreUrl = await productHasBeenImportedToShopify(
                                                            productID,
                                                            shopifyIntegration.id,
                                                            importedProduct.url,
                                                        );

                                                        // Dismiss loading toast
                                                        toast.dismiss(loadingToast);

                                                        if (shopifyStoreUrl) {
                                                            toast(
                                                                <div className="flex items-center justify-between w-full">
                                                                    <FontAwesomeIcon
                                                                        icon={faCircleCheck}
                                                                        className="text-green-500"
                                                                    />
                                                                    <span>Product imported to store!</span>
                                                                    <Link
                                                                        href={importedProduct.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-500 hover:underline flex items-center ml-auto"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <ExternalLink size={14} className="mr-1" />
                                                                        View Product
                                                                    </Link>
                                                                </div>,
                                                            );
                                                        } else {
                                                            toast.error('Failed to update product import status in Shopify.');
                                                        }
                                                    } else {
                                                        const result = await response.json();
                                                        // Dismiss loading toast and show error
                                                        toast.dismiss(loadingToast);
                                                        toast.error(result.error || 'Failed to import product to Shopify');
                                                    }
                                                } catch (error) {
                                                    console.error('Error importing product:', error);
                                                    // Dismiss loading toast and show error
                                                    toast.dismiss(loadingToast);
                                                    toast.error('An error occurred while importing the product');
                                                }
                                            }}
                                            className="py-4"
                                        >
                                            <div className="flex items-center text-[#96bf47]">
                                                <FontAwesomeIcon icon={faShopify} className="mr-2" />
                                                Import to Shopify
                                            </div>
                                        </DropdownMenuItem>

                                        {productData.shopify_product_url && (
                                            <DropdownMenuItem asChild className="py-4">
                                                <Link
                                                    href={productData.shopify_product_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center"
                                                >
                                                    <FontAwesomeIcon icon={faStore} className="mr-2" />
                                                    View on your store
                                                </Link>
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuItem
                                            onClick={() => setShowDeleteModal(true)}
                                            className="py-4 text-red-600 hover:text-red-700"
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                            Delete Product
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DeleteModal
                                    isOpen={showDeleteModal}
                                    onClose={() => setShowDeleteModal(false)}
                                    onDelete={async () => {
                                        const result = await deleteProduct(productData.id);
                                        if (result.success) {
                                            toast.success('Product deleted successfully');
                                            router.push('/products');
                                        } else {
                                            toast.error('Failed to delete product');
                                        }
                                        setShowDeleteModal(false);
                                    }}
                                    title="Delete Product"
                                    description={`Are you sure you want to delete "${productData.product_title}"? This action cannot be undone.`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-3 text-gray-900">
                            Description
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {productData.product_description}
                        </p>
                    </div>
                    {productData.product_key_points &&
                        productData.product_key_points.length > 0 && (
                            <div className="border-t border-gray-200 p-6">
                                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                                    Key Points
                                </h2>
                                <ul className="list-disc list-inside text-gray-700">
                                    {productData.product_key_points &&
                                        productData.product_key_points.map((point, index) => (
                                            <li key={index} className="mb-2 text-black">
                                                {point}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                    <div className="mt-2 p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 ">
                            Customer Reviews
                        </h2>
                        {productData.product_reviews &&
                            productData.product_reviews.map((review, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-100 rounded">
                                    <p className="font-semibold text-gray-900">{review.name}</p>
                                    <p className="text-gray-700">{review.content}</p>
                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                <div className="mt-8 text-center">
                    <p className="text-xl text-gray-600">No product data found.</p>
                </div>
            )}
        </div>
    );
}

