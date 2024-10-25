'use client';

import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Code, Heart, MessageCircle, SquarePen } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { TabsNavigation } from '@/components/TabsNavigation';

const InstagramCreativesPage = () => {
    const params = useParams();
    const productID = params?.productId as string;

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

    const adComponents = [
        { id: 1, username: 'RapidProductLauncher', description: 'Check out this amazing product!', imageUrl: 'https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/Hc28c56baf7eb4b549e5ed454e9023bf3Y.jpeg', profileUrl: 'https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/product_placeholder_image.png' },
        { id: 2, username: 'RapidProductLauncher', description: 'Limited time offer!', imageUrl: 'https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/Hc28c56baf7eb4b549e5ed454e9023bf3Y.jpeg', profileUrl: 'https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/product_placeholder_image.png' },
        { id: 3, username: 'RapidProductLauncher', description: 'Experience the difference with our product. We are on the mission to do anything. Yes, it was my son who done that. Everyone found out what was going on. Lil boosie said come on mayn. Make them people do their job. Thats the copes over here.', imageUrl: 'https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/Hc28c56baf7eb4b549e5ed454e9023bf3Y.jpeg', profileUrl: 'https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/product_placeholder_image.png' },
    ];

    const InstagramAdComponent = ({ username, description, imageUrl, profileUrl }) => {
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
                        style={{ objectFit: "cover" }}
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
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
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
                {adComponents.map(ad => (
                    <div key={ad.id} className="flex flex-col">
                        <InstagramAdComponent
                            username={ad.username}
                            description={ad.description}
                            imageUrl={ad.imageUrl}
                            profileUrl={ad.profileUrl}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstagramCreativesPage;
