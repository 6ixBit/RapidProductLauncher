'use server';
import { supabaseAdminClient } from '@/supabase-clients/admin/supabaseAdminClient';

export async function getOrganizationsTotalPages({
  query = '',
  limit = 10,
}: {
  query?: string;
  limit?: number;
}) {
  const { data, error } = await supabaseAdminClient.rpc(
    'app_admin_get_all_organizations_count',
    {
      search_query: query,
    },
  );
  if (error) throw error;
  return Math.ceil(data / limit);
}

export async function getPaginatedOrganizationList({
  limit = 10,
  page,
  query,
}: {
  page?: number;
  query?: string;
  limit?: number;
}) {
  const { data, error } = await supabaseAdminClient.rpc(
    'app_admin_get_all_organizations',
    {
      page: page,
      search_query: query,
      page_size: limit,
    },
  );
  if (error) throw error;
  if (!data) {
    throw new Error('No data');
  }
  return data;
}
