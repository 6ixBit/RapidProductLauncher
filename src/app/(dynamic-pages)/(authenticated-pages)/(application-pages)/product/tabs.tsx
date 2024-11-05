import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Eye, ImageIcon, SquarePen } from 'lucide-react';

export const NavigationTabs = (productID: string) => [
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