
'use client';

import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Code, SquarePen } from 'lucide-react';
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

    return (
        <div className="max-w-6xl mx-auto px-4 py-2">
            <TabsNavigation tabs={tabs} />
            <div>Facebook Creatives</div>
        </div>
    );
};

export default FacebookCreativesPage;