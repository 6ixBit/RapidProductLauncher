'use client';

import { TabsNavigation } from '@/components/TabsNavigation';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NavigationTabs } from '../../tabs';
import { Carousel } from './Carousel';

const ProductPreviewPage = () => {
  const params = useParams();
  const productID = params?.productId as string;
  const supabase = supabaseUserClientComponentClient;
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');

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

  useEffect(() => {
    if (descriptionRef.current && productData?.htmlCode) {
      let shadow: ShadowRoot;

      // Check if shadow root already exists
      if (descriptionRef.current.shadowRoot) {
        shadow = descriptionRef.current.shadowRoot;
        // Clear existing content
        shadow.innerHTML = '';
      } else {
        // Create new shadow root if none exists
        shadow = descriptionRef.current.attachShadow({ mode: 'open' });
      }

      // Extract style and content from the HTML
      const styleMatch = productData.htmlCode.match(/<style>([\s\S]*?)<\/style>/);
      const contentMatch = productData.htmlCode.match(/<body>([\s\S]*?)<\/body>/);

      const styles = styleMatch ? styleMatch[1] : '';
      const content = contentMatch ? contentMatch[1] : productData.htmlCode;

      // Create and append style element
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      shadow.appendChild(styleElement);

      // Create and append content container
      const contentContainer = document.createElement('div');
      contentContainer.innerHTML = content;
      shadow.appendChild(contentContainer);
    }
  }, [productData?.htmlCode]);

  // Set initial variant when data loads
  useEffect(() => {
    if (productData?.variants && productData.variants.length > 0) {
      setSelectedVariant(productData.variants[0]);
    }
  }, [productData?.variants]);

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
      <TabsNavigation tabs={NavigationTabs(productID)} />
      <div className="flex flex-col w-full">
        {productData?.images && productData.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            {/* Left Column - Carousel */}
            <div className="w-full md:h-fit md:sticky md:top-4">
              <Carousel images={productData.images} />
            </div>

            {/* Right Column - Product Details & Description */}
            <div className="flex flex-col gap-8">
              {/* Product Details Section */}
              <div className="flex flex-col gap-4">
                {/* Title and Rating Row */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#f6ad55] text-xl">★★★★★</span>
                    <span className="text-gray-600 font-semibold">

                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {productData.title}
                  </h1>

                </div>

                <div className="text-2xl font-semibold text-gray-900">
                  {productData.price}
                </div>

                {productData?.variants && productData.variants.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="variant-select" className="text-sm font-medium text-gray-700">
                      Select Variant
                    </label>
                    <select
                      id="variant-select"
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                    >
                      {productData.variants.map((variant: string, index: number) => (
                        <option key={index} value={variant}>
                          {variant}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors mt-4">
                  ADD TO CART
                </button>
              </div>

              {/* Description Section */}
              <div ref={descriptionRef} className="product-description" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPreviewPage;