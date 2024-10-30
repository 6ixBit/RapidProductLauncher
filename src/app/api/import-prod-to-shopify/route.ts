import { NextResponse } from 'next/server';

interface ShopifyConfig {
  shopDomain: string;
  adminApiKey: string;
}

interface ProductVariant {
  price: number;
}

interface ProductImage {
  src: string;
}

interface ProductPayload {
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  variants: ProductVariant[];
  images: ProductImage[];
}

async function createProduct(
  { shopDomain, adminApiKey }: ShopifyConfig,
  product: ProductPayload,
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

    if (!response.ok) {
      console.error('Shopify API Error:', data);
      throw new Error(`Shopify API error: ${JSON.stringify(data)}`);
    }

    return {
      id: data.product.id,
      handle: data.product.handle,
      title: data.product.title,
      url: `https://${shopDomain}/products/${data.product.handle}`,
    };
  } catch (error) {
    console.error('Error in createProduct function:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  const { shopify_store_url, admin_api_key, product } = await request.json();

  try {
    const productPayload: ProductPayload = {
      title: product.title,
      body_html: product.body_html,
      vendor: product.vendor,
      product_type: product.product_type,
      variants: [{ price: product.variants[0].price }],
      images: product.images?.map((url: string) => ({ src: url })) || [],
    };

    const createdProduct = await createProduct(
      { shopDomain: shopify_store_url, adminApiKey: admin_api_key },
      productPayload,
    );

    return NextResponse.json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        error: 'Failed to create product',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
