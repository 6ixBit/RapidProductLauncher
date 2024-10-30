import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ProductInfo } from './schema';

export class OpenAIService {
  private static readonly API_KEY = process.env.OPENAI_API_KEY;
  private static readonly openai = new OpenAI({ apiKey: this.API_KEY });

  static async generateProductInfo(htmlContent: string, language: string) {
    const prompt = `
        Extract the following information from the product markup:
        - Product Title (provide a concise and intuitive name, keep it short focus on the product)
        - Product Price (format as $ followed by the value, e.g., $7.8)
        - Product Description
        - Three Key Points about the product
        - Subheader for marketing copy (a catchy phrase or brief description)
        - Generate 5 customer reviews in a UGC style, with sentiments ranging from 3 to 5 stars with customers names.
        
        Additionally, generate ad copy:
        - Exactly 3 Facebook Ads, each with:
          * A compelling description (max 125 characters)
          * An attention-grabbing sub-heading (max 40 characters)
          * Optimize for Facebook's audience with engaging, conversion-focused copy
        
        - 3 Instagram captions, each:
          * Engaging and visual-focused (max 200 characters)
          * Include relevant hashtags
          * Optimize for Instagram's style with emojis and casual tone
  
        Product Markup: ${htmlContent}
        Output in ${language}
      `;

    const completion = await this.openai.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content:
            'Follow the instructions and extract the product information from the product markup',
        },
        { role: 'user', content: prompt },
      ],
      response_format: zodResponseFormat(ProductInfo, 'product'),
    });

    return completion.choices[0].message.parsed;
  }
}
