'use client';

import { TabsNavigation } from '@/components/TabsNavigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Code, SquarePen } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from "sonner";

interface AdCreative {
    ad_description: string;
    ad_sub_heading: string | null;
    created_at: string;
    html_template_id: string;
    id: number;
    platform: string;
}

const FacebookCreativesPage = () => {
    const params = useParams();
    const productID = params?.productId as string;
    const supabase = supabaseUserClientComponentClient;
    const [adCreatives, setAdCreatives] = useState<AdCreative[]>([]);
    const SPONSORED_TEXT = 'Sponsored';

    // Add useEffect to fetch data
    useEffect(() => {
        const fetchAdCreatives = async () => {
            const { data, error } = await supabase
                .from('ad_creatives')
                .select('*')
                .eq('html_template_id', productID)
                .eq('platform', 'facebook');

            if (error) {
                console.error('Error fetching ad creatives:', error);
                return;
            }

            setAdCreatives(data || []);
        };

        fetchAdCreatives();
    }, [productID]);

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
            icon: <FontAwesomeIcon icon={faInstagram} size="lg" style={{ color: '#E1306C' }} />
        },
    ];

    const FacebookAdComponent = ({ title, subheading, description, imageUrl, logoUrl }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const maxLength = 70; // Maximum number of characters to show initially

        const toggleExpansion = () => {
            setIsExpanded(!isExpanded);
        };

        const renderDescription = () => {
            if (description.length <= maxLength) {
                return <p className="text-sm text-gray-600 mt-3">{description}</p>;
            }

            if (isExpanded) {
                return (
                    <>
                        <p className="text-sm text-gray-600 mt-3">{description}</p>
                        <button onClick={toggleExpansion} className="text-blue-500 text-sm mt-2">Show less</button>
                    </>
                );
            }

            return (
                <>
                    <p className="text-sm text-gray-600 mt-3">
                        {description.slice(0, maxLength)}...
                    </p>
                    <button onClick={toggleExpansion} className="text-blue-500 text-sm mt-2">Show more</button>
                </>
            );
        };
        return (
            <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-300">
                <div className="p-4">
                    <div className="flex items-center">
                        <div className="mr-3 flex-shrink-0">
                            <Image
                                src={logoUrl}
                                alt="Logo"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{title}</h2>
                            <p className="text-sm text-gray-400">{SPONSORED_TEXT}</p>
                        </div>
                    </div>
                    {renderDescription()}
                </div>
                <div className="relative h-72">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex-grow mr-4">
                            <p className="text-sm text-gray-400">RapidProductLauncher.ai</p>
                            <p className="text-xs text-gray-600 mt-1 break-words">{subheading}</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="bg-blue-500 text-white px-3 py-2 rounded text-xs hover:bg-blue-600 flex-shrink-0 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                    <span className="inline-block align-middle">COPY</span>
                                </button>

                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={async () => {
                                    await navigator.clipboard.writeText(description);
                                    toast.success('Description copied to clipboard');
                                }}>
                                    Copy Description
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={async () => {
                                    await navigator.clipboard.writeText(subheading || '');
                                    toast.success('Sub Heading copied to clipboard');
                                }}>
                                    Copy Sub Heading
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        );
    };

    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${type} copied to clipboard`);
        } catch (err) {
            toast.error('Failed to copy to clipboard');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-2">
            <TabsNavigation tabs={tabs} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {adCreatives.map(ad => (
                    <div key={ad.id} className="flex flex-col">
                        <FacebookAdComponent
                            title={"Rapid Product Launcher"}
                            subheading={ad.ad_sub_heading}
                            description={ad.ad_description}
                            imageUrl={"https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/Hc28c56baf7eb4b549e5ed454e9023bf3Y.jpeg"}
                            logoUrl={"https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/product_placeholder_image.png"}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FacebookCreativesPage;
