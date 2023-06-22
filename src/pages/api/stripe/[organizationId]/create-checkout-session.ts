import { createOrRetrieveCustomer } from '@/utils/supabase-admin';
import { withUserLoggedInApi } from '@/utils/api-routes/wrappers/withUserLoggedInApi';
import { NextApiRequest, NextApiResponse } from 'next';
import { AppSupabaseClient } from '@/types';
import { Session, User } from '@supabase/supabase-js';
import { getURL } from '@/utils/helpers';
import { stripe } from '@/utils/stripe';
import { errors } from '@/utils/errors';
import { z } from 'zod';
import { handleError } from '@/utils/api-routes/handle-error';

const requestPayloadSchema = z.object({
  priceId: z.string(),
  isTrial: z.boolean().optional().default(false),
});

const TRIAL_DAYS = 14;
const TRIAL_DURATION = TRIAL_DAYS * 24 * 60 * 60; // 14 days in seconds

export type RequestPayload = z.infer<typeof requestPayloadSchema>;

async function createCheckoutSession(
  req: NextApiRequest,
  res: NextApiResponse,
  supabaseServerClient: AppSupabaseClient,
  _: Session,
  user: User
) {
  if (req.method === 'POST') {
    const { organizationId } = req.query;
    const { priceId, isTrial } = requestPayloadSchema.parse(req.body);
    if (typeof organizationId !== 'string') {
      return res.status(400).json({
        error: { statusCode: 400, message: 'Invalid organization id' },
      });
    }
    if (typeof priceId !== 'string') {
      return res
        .status(400)
        .json({ error: { statusCode: 400, message: 'Invalid price id' } });
    }
    try {
      const { data, error } = await supabaseServerClient
        .from('organizations')
        .select('id, title')
        .eq('id', organizationId)
        .single();

      if (error) {
        return res
          .status(500)
          .json({ error: { statusCode: 500, message: error.message } });
      }

      if (!data) {
        return res.status(404).json({
          error: { statusCode: 404, message: 'Organization not found' },
        });
      }

      const customer = await createOrRetrieveCustomer({
        organizationId: organizationId,
        organizationTitle: data.title,
        email: user.email || '',
      });
      if (!customer) throw Error('Could not get customer');
      if (isTrial) {
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          billing_address_collection: 'required',
          customer,
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          allow_promotion_codes: true,
          subscription_data: {
            trial_period_days: TRIAL_DAYS,
            trial_settings: {
              end_behavior: {
                missing_payment_method: 'cancel',
              },
            },
            metadata: {},
          },
          success_url: `${getURL()}/organization/${organizationId}/settings/billing`,
          cancel_url: `${getURL()}/organization/${organizationId}/settings/billing`,
        });

        return res.status(200).json({ sessionId: stripeSession.id });
      } else {
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          billing_address_collection: 'required',
          customer,
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          allow_promotion_codes: true,
          subscription_data: {
            trial_from_plan: true,
            metadata: {},
          },
          success_url: `${getURL()}/organization/${organizationId}/settings/billing`,
          cancel_url: `${getURL()}/organization/${organizationId}/settings/billing`,
        });

        return res.status(200).json({ sessionId: stripeSession.id });
      }
    } catch (error: unknown) {
      handleError(error, res);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export default withUserLoggedInApi(createCheckoutSession);
