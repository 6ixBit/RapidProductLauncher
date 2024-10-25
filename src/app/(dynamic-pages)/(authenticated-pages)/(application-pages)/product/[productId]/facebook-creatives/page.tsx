'use client';

import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Code, SquarePen } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { TabsNavigation } from '@/components/TabsNavigation';

const FacebookCreativesPage = () => {
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
            icon: <FontAwesomeIcon icon={faFacebook} size="lg" />,
        },
        {
            label: 'Instagram Creatives',
            href: `/product/${productID}/instagram-creatives`,
            icon: <FontAwesomeIcon icon={faInstagram} size="lg" />
        },
    ];

    const adComponents = [
        { id: 1, title: 'Ad Title 1', subheading: 'Sponsored', description: 'Discover our amazing product that will change your life!' },
        { id: 2, title: 'Ad Title 2', subheading: 'Sponsored', description: 'Limited time offer! Don\'t miss out on this incredible deal.' },
        { id: 3, title: 'Ad Title 3', subheading: 'Sponsored', description: 'Experience the difference with our innovative solution.' },
        // Add more ad components as needed
    ];

    const FacebookAdComponent = ({ title, subheading, description, imageUrl, logoUrl }) => (
        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
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
                        <p className="text-sm text-gray-400">{subheading}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">{description}</p>
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
                <div className="flex justify-between items-start">
                    <div className="flex-grow mr-4">
                        <p className="text-sm text-gray-400">example.com</p>
                        <p className="text-xs text-gray-600 mt-1 break-words">Brief product description or call-to-action.</p>
                    </div>
                    <button className="bg-blue-500 text-white px-3 py-2 rounded text-xs hover:bg-blue-600 flex-shrink-0">
                        COPY NOW
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-2">
            <TabsNavigation tabs={tabs} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {adComponents.map(ad => (
                    <FacebookAdComponent key={ad.id} title={ad.title} subheading={ad.subheading} description={ad.description} imageUrl={"     https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/Hc28c56baf7eb4b549e5ed454e9023bf3Y.jpeg"} logoUrl={"https://s3.us-east-2.amazonaws.com/rapid-product-launcher.ai/product_placeholder_image.png"} />
                ))}
            </div>
        </div>
    );
};

export default FacebookCreativesPage;
