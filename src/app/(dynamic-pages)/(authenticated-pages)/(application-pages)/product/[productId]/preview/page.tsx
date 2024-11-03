'use client';

import { TabsNavigation } from '@/components/TabsNavigation';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { Eye, ImageIcon, SquarePen } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Carousel } from './Carousel';

interface ImageVariant {
  text: string;
  imageUrl: string;
}

const ProductPreviewPage = () => {
  const params = useParams();
  const productID = params?.productId as string;
  const supabase = supabaseUserClientComponentClient;

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
      icon: <Eye />,
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

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product-preview', productID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('html_templates')
        .select(`
          html_code, 
          image_urls, 
          product_title,
          product_price,
          variants
        `)
        .eq('id', productID)
        .single();

      if (error) throw error;

      return {
        htmlCode: data.html_code,
        images: data.image_urls || [],
        title: data.product_title,
        price: data.product_price,
        variants: data.variants
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">Error loading preview</div>
      </div>
    );
  }

  console.log('variants', productData?.variants);

  return (
    <div className="max-w-6xl mx-auto px-4 py-2">
      <TabsNavigation tabs={tabs} />
      <div className="flex flex-col w-full">
        {productData?.images && productData.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            <div className="w-full">
              <Carousel images={productData.images} />
            </div>
            <div className="flex flex-col gap-4 p-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {productData.title}
              </h1>
              <div className="text-2xl font-semibold text-gray-900">
                {productData.price}
              </div>

              {productData.variants && productData.variants.length > 0 && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="variant-select" className="text-sm font-medium text-gray-700">
                    Select Variant
                  </label>
                  <select
                    id="variant-select"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={productData.variants[0]}
                    disabled
                  >
                    <option value={productData.variants[0]}>
                      {productData.variants[0]}
                    </option>
                  </select>
                </div>
              )}

              <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors mt-4">
                Add to Cart
              </button>
            </div>
          </div>
        )}
        <div className="flex-1">
          <iframe
            srcDoc={productData?.htmlCode}
            className="w-full min-h-[800px] border-0"
            title="Product Preview"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewPage;