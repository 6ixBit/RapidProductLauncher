import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ??
    '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',
  {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-11-15',
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: 'Nextbase',
      version: '0.1.0',
    },
  },
);
