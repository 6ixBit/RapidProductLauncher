'use client';

import { TabsNavigation } from '@/components/TabsNavigation';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Code, ExternalLink, ImageIcon, SquarePen } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const MediaCenterPage = () => {
  const params = useParams();
  const productID = params?.productId as string;
  const supabase = supabaseUserClientComponentClient;
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: templateData, error: templateError } = await supabase
        .from('html_templates')
        .select('image_urls')
        .eq('id', productID)
        .single();

      if (templateError) {
        console.error('Error fetching template:', templateError);
        return;
      }

      setProductImages(templateData?.image_urls || []);
    };

    fetchData();
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

  const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  const ImageCard = ({ imageUrl }: { imageUrl: string }) => {
    return (
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-300">
        <div className="relative h-72">
          <Image
            src={imageUrl}
            alt="Product image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="p-4 flex gap-2">
          <button
            onClick={() => openImageInNewTab(imageUrl)}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={16} />
            Download
          </button>

        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-2">
      <TabsNavigation tabs={tabs} />

      <div className="mt-6 mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Media Library</h2>
        <p className="text-gray-600 mt-1">Download and use these product images for your marketing campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {productImages.map((imageUrl, index) => (
          <div key={index} className="flex flex-col">
            <ImageCard imageUrl={imageUrl} />
          </div>
        ))}
      </div>

      {productImages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No images available for this product
        </div>
      )}
    </div>
  );
};

export default MediaCenterPage;
