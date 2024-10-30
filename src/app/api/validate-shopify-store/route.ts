import { NextResponse } from 'next/server';
import { validateShopifyAccess } from './utils';

export async function POST(request: Request) {
  const { shopDomain, adminApiKey } = await request.json();

  if (!shopDomain || !adminApiKey) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

  try {
    const validationResponse = await validateShopifyAccess({
      shopDomain,
      adminApiKey,
    });

    if (validationResponse.isValid) {
      return NextResponse.json({
        success: true,
        myShopifyDomain: validationResponse.myShopifyDomain,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to validate credentials',
        message: error.message || error,
      },
      { status: 500 },
    );
  }
}
