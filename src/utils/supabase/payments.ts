import { AppSupabaseClient, AuthProvider, Table } from '@/types';

export const getActiveProductsWithPrices = async (
  supabase: AppSupabaseClient
) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    throw error;
  }

  return data || [];
};
