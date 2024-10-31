import { Product } from '@/app/(dynamic-pages)/(authenticated-pages)/products/page';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const languageToEmoji = (language: string) => {
    switch (language.toLowerCase()) {
        case 'english':
            return '🇬🇧';
        case 'spanish':
            return '🇪🇸';
        case 'french':
            return '🇫🇷';
        case 'german':
            return '🇩🇪';
        case 'italian':
            return '🇮🇹';
        default:
            return '❓'; // Default emoji for unknown languages
    }
};


export const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/product/${product.id}/info`}>
        <div className="border rounded-lg p-3 shadow-md text-sm cursor-pointer hover:shadow-lg transition-shadow">
            <Image
                src={product.thumbnail_url || ''}
                alt={product.product_title}
                width={150}
                height={150}
                className="w-full h-32 object-cover mb-2 rounded"
            />
            <h2 className="font-semibold truncate">{product.product_title}</h2>
            <p className="text-md font-semibold text-green-600 mb-3">{product.product_price}</p>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="text-sm text-gray-400 p-1 rounded mr-2">
                        Generated in {languageToEmoji(product.language || 'Unknown')}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {`This product page was generated in ${product.language || 'an unknown language'}.`}
                </TooltipContent>
            </Tooltip>
            <div className="flex justify-between items-center text-xs mt-6">
                <div className="flex items-center">
                    <Link
                        href={product.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink size={14} className="mr-1" />
                        Sourcing URL
                    </Link>
                </div>
                {product.is_imported_to_shopify && (
                    <Link
                        href={product.shopify_product_url || ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Badge variant="shopify">
                            <FontAwesomeIcon icon={faShopify} className="mr-1" />
                            Imported
                        </Badge>
                    </Link>
                )}
            </div>
        </div>
    </Link>
);