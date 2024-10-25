'use client';

import { TabsNavigation } from '@/components/TabsNavigation/TabsNavigation';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Liquid } from 'liquidjs';
import { Code, SquarePen } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { liquidTemplate_1_edited } from './templates';

const engine = new Liquid();



const mockData = {
    product: {
        title: 'Example Product',
        price: 19.99,
        compare_at_price: 24.99,
        description: 'This is an example product description.',
        images: [
            { alt: 'Product Image 1', url: 'https://images.stockcake.com/public/1/3/5/1357c015-9880-4fd7-a212-20b874e97880_large/cat-enjoying-sunlight-stockcake.jpg' },
            { alt: 'Product Image 2', url: 'https://images.stockcake.com/public/3/5/3/35384791-8bff-43b8-aa92-009e56cd8c1a_large/jet-over-desert-stockcake.jpg' },
            { alt: 'Product Image 3', url: 'https://images.stockcake.com/public/1/3/5/1357c015-9880-4fd7-a212-20b874e97880_large/cat-enjoying-sunlight-stockcake.jpg' },
            { alt: 'Product Image 2', url: 'https://images.stockcake.com/public/3/5/3/35384791-8bff-43b8-aa92-009e56cd8c1a_large/jet-over-desert-stockcake.jpg' }
        ],
        available: true,
        options_with_values: [
            {
                name: 'Size',
                values: ['Small', 'Medium', 'Large'],
                selected_value: 'Medium'
            }
        ],
        type: 'T-Shirt',
        tags: ['Cotton', 'Comfortable', 'Casual']
    },
};

const ClientSideRenderer = ({ html }: { html: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.innerHTML = html;
            const scripts = containerRef.current.getElementsByTagName('script');
            Array.from(scripts).forEach(script => {
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(script.innerHTML));
                script.parentNode?.replaceChild(newScript, script);
            });
        }
    }, [html]);

    return <div ref={containerRef} />;
};

const TemplatePage = () => {
    const params = useParams();
    const productID = params?.productId as string;
    const [renderedHtml, setRenderedHtml] = useState('');



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


    useEffect(() => {
        engine.parseAndRender(liquidTemplate_1_edited, mockData)
            .then(html => setRenderedHtml(html));
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-2">
            <TabsNavigation tabs={tabs} />
            <ClientSideRenderer html={renderedHtml} />
        </div>
    );
};

export default TemplatePage;

