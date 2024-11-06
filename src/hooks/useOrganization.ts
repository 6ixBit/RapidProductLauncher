import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { supabaseUserClientComponentClient } from '@/supabase-clients/user/supabaseUserClientComponentClient';
import { useQuery } from '@tanstack/react-query';

export function useOrganization() {
  const user = useLoggedInUser();

  return useQuery({
    queryKey: ['userOrganization', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user found');

      const { data: orgMember, error } = await supabaseUserClientComponentClient
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
