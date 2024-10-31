import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';

export const getConnectedShopifyStores = async (userId: string) => {
  try {
    const { data, error } = await supabaseUserClientComponentClient
      .from('shopify_integrations')
      .select('id, shopify_store_url, admin_api_key, myshopify_domain')
      .eq('user_id', userId)
      .eq('is_connected', true)
      .single();

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
  shopifyStoreId: number | null,
  shopifyProductUrl: string | null,
) => {
  try {
    // Update the product to mark it as imported to Shopify
    const { error: updateError } = await supabaseUserClientComponentClient
      .from('html_templates')
      .update({
        is_imported_to_shopify: true,
        shopify_store_id: shopifyStoreId,
        shopify_product_url: shopifyProductUrl,
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
