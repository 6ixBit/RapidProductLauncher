import { z } from 'zod';

export const requestSchema = z.object({
  language: z.string(),
  url: z.string().url(),
  source: z.string(),
  user_id: z.string(),
  organization_id: z.string(),
});

export const ProductInfo = z.object({
  title: z.string(),
  price: z.string(),
  description: z.string(),
  subHeading: z.string(),
  targetAudience: z.string(),
  keyPoints: z.array(z.string()),
  reviews: z.array(
    z.object({
      name: z.string(),
      content: z.string(),
    }),
  ),
  adCopy: z.object({
    facebook: z.array(
      z.object({
        description: z.string(),
        subHeading: z.string(),
      }),
    ),
    instagram: z.array(
      z.object({
        caption: z.string(),
      }),
    ),
  }),
});
