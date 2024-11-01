import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ProductInfo } from './schema';

export class OpenAIService {
  private static readonly API_KEY = process.env.OPENAI_API_KEY;
  private static readonly openai = new OpenAI({ apiKey: this.API_KEY });

  static async generateProductInfo(
    htmlContent: string,
    language: string,
    price: string,
    variants: {
      textVariants: string[];
      imageVariants: { text: string; imageUrl: string }[];
    },
  ) {
    const prompt = `
        Extract and enhance the following information from the product markup. Use the provided price of ${price} and available variants:
        Text Variants: ${variants.textVariants.join(', ')}
        Color/Image Variants: ${variants.imageVariants.map((v) => v.text).join(', ')}

        Extract and generate:
        - Product Title (provide a concise and intuitive name, keep it short focus on the product)
        - Product Price (use the provided price of ${price})
        - Product Description
        - Three Key Points about the product (mention variety of options if relevant)
        - Subheader for marketing copy (a catchy phrase mentioning price point or variety if compelling)
        - Generate target audience for internal use only (e.g. Women aged 25-35 who love fashion)
        - Generate 5 customer reviews in a UGC style with varying sentiment (e.g. "This product is decent, but could be better" to "Absolutely love this, best purchase ever!") with clear customer names (include mentions of specific variants or options in some reviews)
        
        Additionally, generate ad copy (do not reference target audience in any of these):
        - Exactly 3 Facebook Ads, each with:
          * A compelling description (max 125 characters) that focuses on benefits, features, or price point
          * An attention-grabbing sub-heading (max 40 characters)
          * Optimize for conversion with broad appeal
        
        - 3 Instagram captions, each:
          * Engaging and visual-focused (max 200 characters)
          * Include relevant hashtags
          * Optimize for Instagram's style with emojis and casual tone
          * Focus on product features, benefits, and value proposition
  
        Product Markup: ${htmlContent}
        Output in ${language}
      `;

    const completion = await this.openai.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content:
            'Follow the instructions precisely and extract the product information from the product markup',
        },
        { role: 'user', content: prompt },
      ],
      response_format: zodResponseFormat(ProductInfo, 'product'),
    });

    return completion.choices[0].message.parsed;
  }
}
