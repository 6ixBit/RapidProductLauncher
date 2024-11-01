'use client';

import { TabsNavigation } from '@/components/TabsNavigation';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Code, Heart, ImageIcon, MessageCircle, SquarePen } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AdCreative {
    ad_description: string;
    ad_sub_heading: string | null;
    created_at: string;
    html_template_id: string;
    id: number;
    platform: string;
}

const InstagramCreativesPage = () => {
    const params = useParams();
    const productID = params?.productId as string;
    const supabase = supabaseUserClientComponentClient;
    const [adCreatives, setAdCreatives] = useState<AdCreative[]>([]);
    const [productImages, setProductImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch ad creatives
            const { data: adData, error: adError } = await supabase
                .from('ad_creatives')
                .select('*')
                .eq('html_template_id', productID)
                .eq('platform', 'instagram');

            if (adError) {
                console.error('Error fetching ad creatives:', adError);
                return;
            }

            // Fetch images
            const { data: templateData, error: templateError } = await supabase
                .from('html_templates')
                .select('image_urls')
                .eq('id', productID)
                .single();

            if (templateError) {
                console.error('Error fetching template:', templateError);
                return;
            }

            setAdCreatives(adData || []);
            setProductImages(templateData?.image_urls || []);
        };

        fetchData();
    }, [productID]);

    // Helper function to get image for creative
    const getImageForCreative = (index: number) => {
        if (!productImages.length)
            return 'https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/product_placeholder_image.png';
        return productImages[index % productImages.length];
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
        {
            label: "Media Center",
            href: `/product/${productID}/media-center`,
            icon: <ImageIcon style={{ color: '#4B5563' }} />
        }
    ];

    const InstagramAdComponent = ({
        username,
        description,
        imageUrl,
        profileUrl,
    }) => {
        return (
            <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-300">
                <div className="flex flex-col p-4">
                    <div className="flex items-center">
                        <Image
                            src={profileUrl}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <div className="ml-3">
                            <p className="font-bold">{username}</p>
                            <p className="text-xs text-gray-500">Sponsored</p>
                        </div>
                    </div>
                </div>
                <div className="relative h-72">
                    <Image
                        src={imageUrl}
                        alt={description}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className="p-4">
                    <div className="flex items-center mb-2 justify-between">
                        <div className="flex items-center">
                            <button className="text-red-500 mr-4">
                                <Heart fill="red" />
                            </button>
                            <button className="text-gray-500">
                                <MessageCircle className="transform scale-x-[-1]" />
                            </button>
                        </div>
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded text-xs hover:bg-blue-600 flex items-center"
                            onClick={() => {
                                navigator.clipboard.writeText(description);
                                toast.success('Ad description copied to clipboard!');
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                            >
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                            COPY
                        </button>
                    </div>
                    <div className="text-sm text-gray-600 mt-4 max-h-20 overflow-y-auto">
                        <span className="font-bold">{username}</span> {description}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-2">
            <TabsNavigation tabs={tabs} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {adCreatives.map((ad, index) => (
                    <div key={ad.id} className="flex flex-col">
                        <InstagramAdComponent
                            username="RapidProductLauncher"
                            description={ad.ad_description}
                            imageUrl={getImageForCreative(index)}
                            profileUrl="https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/product_placeholder_image.png"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstagramCreativesPage;
