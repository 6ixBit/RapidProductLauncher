import { NextResponse } from 'next/server';

interface ShopifyConfig {
  shopDomain: string;
  adminApiKey: string;
}

export async function createProduct(
  { shopDomain, adminApiKey }: ShopifyConfig,
  product: {
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    variants: {
      price: number;
    }[];
  },
) {
  try {
    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-01/products.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': adminApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product }),
      },
    );

    const data = await response.json();

    // Log the response for debugging
    console.log('Shopify API Response:', data);

    if (!response.ok) {
      console.error('Shopify API Error:', data);
      throw new Error(`Shopify API error: ${JSON.stringify(data)}`);
    }

    return data.product;
  } catch (error) {
    console.error('Error in createProduct function:', error);
    throw error; // Rethrow the error after logging
  }
}

export async function POST(request: Request) {
  let { shopify_store_url, admin_api_key, product } = await request.json();
  try {
    const createdProduct = await createProduct(
      { shopDomain: shopify_store_url, adminApiKey: admin_api_key },
      product,
    );
    return NextResponse.json(createdProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product', message: error },
      { status: 500 },
    );
  }
}
