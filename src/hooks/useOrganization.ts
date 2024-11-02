import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { useQuery } from '@tanstack/react-query';
import { useBrandmagicSupabaseClient } from './useAppSupabaseClient';

export function useOrganization() {
  const supabase = useBrandmagicSupabaseClient();
  const user = useLoggedInUser();

  return useQuery({
    queryKey: ['userOrganization', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user found');

      const { data: orgMember, error } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('member_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (error) {
        throw error;
      }

      return orgMember;
    },
    enabled: !!user?.id,
  });
}
