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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { faFacebook, faInstagram, faShopify } from '@fortawesome/free-brands-svg-icons';
import { faBolt, faCircleCheck, faCircleInfo, faMagicWandSparkles, faPencil, faStore, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Calendar, ExternalLink, Eye, ImageIcon, Link as LinkIcon, SquarePen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteProduct, formatDate, getConnectedShopifyStores, productHasBeenImportedToShopify } from './utils';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = supabaseUserClientComponentClient;
    const productID = params?.productId as string;
    const queryClient = useQueryClient();
    const user = useLoggedInUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Use React Query for fetching the default organization ID
    const { data: organizationId } = useQuery({
        queryKey: ['userOrganization', user.id],
        queryFn: async () => {
            const { data: orgMember, error } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('member_id', user.id)
                .order('created_at', { ascending: true })
                .limit(1)
                .single();

            if (error) {
                throw error;
            }

            return orgMember.organization_id;
        },
    });

    // Replace useState and useEffect with useQuery for product data
    const { data: productData, isLoading, error } = useQuery({
        queryKey: ['product', productID],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('html_templates')
                .select('*')
                .eq('id', productID)
                .single();

            if (error) throw error;
            return data;
        },
    });

    // Mutation for importing to Shopify
    const importToShopifyMutation = useMutation({
        mutationFn: async () => {
            const { data: shopifyIntegration, error } = await getConnectedShopifyStores(user.id);
            if (error || !shopifyIntegration) {
                throw new Error('No connected Shopify store found.');
            }

            console.log('productData variants:', productData?.variants);

            // Extract variants
            const colorVariants = productData?.image_variants?.map(variant => JSON.parse(variant)) || [];
            const sizeVariants = productData?.variants || [];

            let variants = [];
            let options = [];

            // Case 1: Both colors and sizes
            if (colorVariants.length && sizeVariants.length) {
                // @ts-expect-error Type '{ option1: string; price: number; }[]' is not assignable to type 'never[]' due to empty array type inference
                variants = sizeVariants.flatMap(size =>
                    colorVariants.map(color => ({
                        option1: `${color.text} / ${size}`,
                        price: parseFloat(productData?.product_price?.replace('$', '') || '0'),
                    }))
                );

                options = [
                    // @ts-expect-error Type '{ name: string; values: string[]; }' is not assignable to type 'never'
                    { name: 'Style', values: variants.map(v => v.option1) }
                ];
            }
            // Case 2: Only colors
            else if (colorVariants.length) {
                // @ts-expect-error Type '{ option1: string; price: number; }[]' is not assignable to type 'never'
                variants = colorVariants.map(color => ({
                    option1: color.text,
                    price: parseFloat(productData?.product_price?.replace('$', '') || '0'),
                }));
                // @ts-expect-error Type '{ name: string; values: string[]; }[]' is not assignable to type 'never'
                options = [{ name: 'Color', values: colorVariants.map(color => color.text) }];
            }
            // Case 3: Only sizes
            else if (sizeVariants.length) {
                // @ts-expect-error Type '{ option1: string; price: number; }[]' is not assignable to type 'never'
                variants = sizeVariants.map(size => ({
                    option1: size,
                    price: parseFloat(productData?.product_price?.replace('$', '') || '0'),
                }));
                // @ts-expect-error Type '{ name: string; values: string[]; }[]' is not assignable to type 'never'
                options = [{ name: 'Size', values: sizeVariants }];
            }
            // Case 4: No variants
            else {
                // @ts-expect-error Type '{ option1: string; price: number; }[]' is not assignable to type 'never'
                variants = [{
                    option1: 'Normal:',
                    price: parseFloat(productData?.product_price?.replace('$', '') || '0'),
                }];
                options = [];
            }

            const productPayload = {
                title: productData?.product_title || '',
                body_html: productData?.html_code || '',
                vendor: productData?.user_id || '',
                product_type: productData?.product_sub_heading || '',
                variants,
                options,
                images: [
                    ...(productData?.image_urls || []),
                    ...colorVariants.map(color => color.imageUrl)
                ],
            };

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

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Failed to import product to Shopify');
            }

            const importedProduct = await response.json();
            const shopifyStoreUrl = await productHasBeenImportedToShopify(
                productID,
                shopifyIntegration.id,
                importedProduct.url,
                importedProduct.id,
            );

            return { importedProduct, shopifyStoreUrl };
        },
        onSuccess: (data) => {
            // Invalidate and refetch product data
            queryClient.invalidateQueries({ queryKey: ['product', productID] });

            toast(
                <div className="flex items-center justify-between w-full">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-green-500" />
                    <span>Product imported to store!</span>
                    <Link
                        href={data.importedProduct.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center ml-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink size={14} className="mr-1" />
                        View Product
                    </Link>
                </div>,
                {
                    dismissible: true
                }
            );
        },
        onError: (error: any) => {
            toast.error((error as Error).message || 'An error occurred while importing the product');
        },
    });

    // Mutation for deleting product
    const deleteProductMutation = useMutation({
        mutationFn: (productId: string) => deleteProduct(productId),
        onSuccess: () => {
            toast.success('Product deleted successfully');
            router.push('/products');
        },
        onError: () => {
            toast.error('Failed to delete product');
        },
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <H1>Whoops! 😅</H1>
                <p className="text-red-500 mb-8 mt-2">{(error as Error).message}</p>
                <Button onClick={() => router.push('/products')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back To Products
                </Button>
            </div>
        );
    }

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
        // {
        //     label: 'Page Template',
        //     href: `/product/${productID}/template`,
        //     icon: <Code />,
        // },
        {
            label: 'Preview',
            href: `/product/${productID}/preview`,
            icon: <Eye style={{ color: '#000000' }} />,
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
        {
            label: "Media Center",
            href: `/product/${productID}/media-center`,
            icon: <ImageIcon style={{ color: '#4B5563' }} />
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-2">
            <div className="flex flex-col gap-4">
                <button
                    className="w-full lg:hidden px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
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
                        className="hidden lg:flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
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
                                    src={productData?.thumbnail_url || ''}
                                    alt={productData?.product_title || ''}
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
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <div className="flex items-center">
                                                        <p className="text-2xl font-semibold text-green-600">
                                                            ${(parseFloat(productData?.product_price?.replace('$', '') || '0') * 3).toFixed(2)}
                                                        </p>
                                                        <TooltipTrigger asChild>
                                                            <button className="text-gray-400 hover:text-gray-600 transition-colors ml-2">
                                                                <FontAwesomeIcon icon={faCircleInfo} className="w-4 h-4 text-blue-500" />
                                                            </button>
                                                        </TooltipTrigger>
                                                    </div>
                                                    <TooltipContent className="flex flex-col gap-2 p-3">
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-gray-500">Supplier price:</span>
                                                            <span className="font-medium">${parseFloat(productData?.product_price?.replace('$', '') || '0').toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-gray-500">Gross profit margin:</span>
                                                            <span className="font-medium text-green-600">{((3 - 1) * 100).toFixed(0)}%</span>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            {productData.is_imported_to_shopify ? (
                                                <Link
                                                    href={productData?.shopify_product_url || ''}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Badge variant="shopify">
                                                        <FontAwesomeIcon icon={faShopify} className="mr-2" />
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
                                            Generated on {formatDate(productData.created_at)} in {productData.language}
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
                                            onClick={() => {
                                                const loadingToast = toast.loading(
                                                    <div className="flex items-center">
                                                        <LoadingSpinner className="w-4 h-4 mr-2" />
                                                        <span>Importing product to Shopify...</span>
                                                    </div>,
                                                    {
                                                        dismissible: true
                                                    }
                                                );
                                                importToShopifyMutation.mutate(undefined, {
                                                    onSettled: () => {
                                                        toast.dismiss(loadingToast);
                                                    }
                                                });
                                            }}
                                            className="py-4"
                                        >
                                            <div className="flex items-center text-[#96bf47]">
                                                <FontAwesomeIcon icon={faShopify} className="mr-2" />
                                                Import to Shopify
                                            </div>
                                        </DropdownMenuItem>

                                        {productData?.shopify_product_url && (
                                            <>
                                                <DropdownMenuItem asChild className="py-4">
                                                    <Link
                                                        href={productData?.shopify_product_url || ''}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center"
                                                    >
                                                        <FontAwesomeIcon icon={faStore} className="mr-2" />
                                                        View on your store
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem asChild className="py-4">
                                                    <Link
                                                        href={`https://admin.shopify.com/store/${productData.shopify_product_url?.split('.')[0].replace('https://', '')}/products/${productData.shopify_product_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center"
                                                    >
                                                        <FontAwesomeIcon icon={faPencil} className="mr-2" />
                                                        Edit on Shopify
                                                    </Link>
                                                </DropdownMenuItem>
                                            </>
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
                                    onDelete={async () => await deleteProductMutation.mutate(productData.id)}
                                    title="Delete Product"
                                    description={`Are you sure you want to delete "${productData.product_title}"? This action cannot be undone.`}
                                />
                            </div>
                        </div>
                    </div>
                    {productData.target_audience && (
                        <div className="border-t border-gray-200 p-6">
                            <h2 className="text-xl font-semibold mb-3 text-gray-900">
                                Your Ideal Customer Profile
                            </h2>
                            <div className="text-gray-700 leading-relaxed">
                                <p className="mb-2 font-semibold">
                                    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-md border-l-4 border-blue-500">
                                        {productData.target_audience}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Understanding your target audience helps optimize your marketing and sales strategies.
                                </p>
                            </div>
                        </div>
                    )}

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
                        {productData?.product_reviews &&
                            productData?.product_reviews.map((review, index) => (
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


