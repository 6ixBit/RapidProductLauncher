import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';

export const getConnectedShopifyStores = async (userId: string) => {
  try {
    const { data, error } = await supabaseUserClientComponentClient
      .from('shopify_integrations')
      .select('id, shopify_store_url, admin_api_key, myshopify_domain')
      .eq('user_id', userId)
      .eq('is_connected', true);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching Shopify integration:', error);
    return { data: null, error };
  }
};

export const productHasBeenImportedToShopify = async (
  productId: string,
  shopifyProductUrl: string | null,
  shopifyProductId: string | null,
) => {
  try {
    // Update the product to mark it as imported to Shopify
    const { error: updateError } = await supabaseUserClientComponentClient
      .from('html_templates')
      .update({
        is_imported_to_shopify: true,
        shopify_product_url: shopifyProductUrl,
        shopify_product_id: shopifyProductId,
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Error updating product:', updateError);
      return null;
    }

    return true;
  } catch (error) {
    console.error('Error in updating product import status:', error);
    return null;
  }
};

export const addToProductShopifyIntegrations = async (
  productId: string,
  shopifyStoreId: number,
  productUrl: string,
  shopifyProductId: string,
  shopifyProductHandle: string,
) => {
  try {
    // Update the product to mark it as imported to Shopify in our ref table
    const { error: updateError } = await supabaseUserClientComponentClient
      .from('product_shopify_integrations')
      .insert({
        product_id: productId,
        shopify_integration_id: shopifyStoreId,
        product_url: productUrl,
        shopify_product_id: shopifyProductId,
        shopify_product_handle: shopifyProductHandle,
      });

    if (updateError) {
      console.error('Error updating product:', updateError);
      return null;
    }

    return true;
  } catch (error) {
    console.error('Error in updating product import status:', error);
    return null;
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const deleteProduct = async (productId: string) => {
  try {
    const { error } = await supabaseUserClientComponentClient
      .from('html_templates')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return { success: false, error };
  }
};

export const getProductShopifyStores = async (productId: string) => {
  try {
    const { data, error } = await supabaseUserClientComponentClient
      .from('product_shopify_integrations')
      .select(
        `
        shopify_integration_id,
        product_url,
        shopify_product_id,
        shopify_product_handle,
        shopify_integrations (
          id,
          shopify_store_url,
          myshopify_domain,
          admin_api_key
        )
      `,
      )
      .eq('product_id', productId);

    if (error) {
      console.error('Error fetching product stores:', error);
      return { data: null, error };
    }

    // Transform the data to get the stores directly with product_url
    const stores = data.map((item) => ({
      ...item.shopify_integrations,
      product_url: item.product_url,
      shopify_product_id: item.shopify_product_id,
      shopify_product_handle: item.shopify_product_handle,
    }));
    return { data: stores, error: null };
  } catch (error) {
    console.error('Error in getProductShopifyStores:', error);
    return { data: null, error };
  }
};

export const cleanStoreUrl = (url: string) => {
  return url.replace(/^(https?:\/\/)?(www\.)?/, '');
};

export const getProductData = async (supabase: any, productID: string) => {
  const { data, error } = await supabase
    .from('html_templates')
    .select('*')
    .eq('id', productID)
    .single();

  if (error) throw error;
  return data;
};

export const getUserOrganization = async (supabase: any, userId: string) => {
  const { data: orgMember, error } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('member_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (error) throw error;
  return orgMember.organization_id;
};

export const generateNewProduct = async (
  source: string,
  url: string,
  language: string,
  userId: string,
  organizationId: string,
): Promise<string> => {
  const response = await fetch('/api/fetch-aliexpress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source,
      url,
      language,
      user_id: userId,
      organization_id: organizationId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();
  if (!data.productID) {
    throw new Error('Product ID not received in the response');
  }

  return data.productID;
};
