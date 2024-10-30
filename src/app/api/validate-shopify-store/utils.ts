// utils/shopify.ts
interface ShopifyConfig {
  shopDomain: string; // e.g. 'your-store.myshopify.com'
  adminApiKey: string;
}

export async function validateShopifyAccess({
  shopDomain,
  adminApiKey,
}: ShopifyConfig) {
  // Ensure shopDomain has 'https://' appended if it isn't already
  let formattedShopDomain = shopDomain;

  if (!formattedShopDomain.includes('://')) {
    formattedShopDomain = `https://${formattedShopDomain}`;
  }

  // Make a test request to the Shopify API to validate the credentials
  const apiUrl = `${formattedShopDomain}/admin/api/2024-01/shop.json`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': adminApiKey,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return { isValid: false }; // Invalid credentials
  }

  const shopData = await response.json();
  const myShopifyDomain = shopData.shop.myshopify_domain; // Get the unique .myshopify.com domain

  return { isValid: true, myShopifyDomain }; // Return validity and the myshopify domain
}
