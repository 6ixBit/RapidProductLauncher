// decline invitation
import { NextApiRequest, NextApiResponse } from 'next';
import { errors } from '@/utils/errors';
import { createSupabaseUserServerPagesClient } from '@/supabase-clients/user/createSupabaseUserServerPagesClient';

async function DeclineInvitationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabaseClient = createSupabaseUserServerPagesClient({
    req,
    res,
  });
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  const user = data?.session?.user;

  if (!user) {
    res.status(401).send('Please login to manage organization invitation.');
    return;
  }

  const { invitationId } = req.query;

  if (typeof invitationId === 'string') {
    const invitationResponse = await supabaseClient
      .from('organization_join_invitations')
      .update({
        status: 'finished_declined',
        invitee_user_id: user.id, // Add this information here, so that our database function can add this id to the team members table
      })
      .eq('id', invitationId)
      .select('*')
      .single();

    if (invitationResponse.error) {
      errors.add(invitationResponse.error);
      res.status(400).json({ error: 'Access denied.' });
      return;
    } else {
      res.redirect('/dashboard');
    }
  } else {
    res.status(400).json({ error: 'Invalid invitation ID' });
  }
}

export default DeclineInvitationHandler;
