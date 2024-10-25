// utils/shopify.ts
interface ShopifyConfig {
  shopDomain: string; // e.g. 'your-store.myshopify.com'
  adminApiKey: string;
}

export async function validateShopifyAccess({
  shopDomain,
  adminApiKey,
}: ShopifyConfig) {
  try {
    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-01/shop.json`,
      {
        headers: {
          'X-Shopify-Access-Token': adminApiKey,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return !!data.shop; // Will be true if we got valid shop data
  } catch (error) {
    return false;
  }
}

export async function createProduct(
  { shopDomain, adminApiKey }: ShopifyConfig,
  productData: any,
) {
  const response = await fetch(
    `https://${shopDomain}/admin/api/2024-01/products.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': adminApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: productData,
      }),
    },
  );

  return response.json();
}
