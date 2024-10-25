import { NextResponse } from 'next/server';
import { createProduct, validateShopifyAccess } from './utils';

export async function POST(request: Request) {
  const { shopDomain, adminApiKey, productData } = await request.json();

  if (!shopDomain || !adminApiKey) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

  try {
    const isValid = await validateShopifyAccess({ shopDomain, adminApiKey });

    if (isValid) {
      // Store the credentials securely if valid
      // You might want to encrypt the API key before storing
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to validate credentials' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const { shopDomain, adminApiKey, productData } = await request.json();

  if (!shopDomain || !adminApiKey || !productData) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

  try {
    const product = await createProduct(
      { shopDomain, adminApiKey },
      {
        title: productData.title,
        body_html: productData.description,
        vendor: productData.vendor,
        product_type: productData.productType,
        variants: [
          {
            price: productData.price,
            sku: productData.sku,
            inventory_quantity: productData.quantity,
          },
        ],
      },
    );

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 },
    );
  }
}
