import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import puppeteer from 'puppeteer-core';
import { z } from 'zod';
import {
  cleanHTML,
  saveAdCreativesToDB,
  saveProductTemplateToDB,
} from './utils';

const requestSchema = z.object({
  language: z.string(),
  url: z.string().url(),
  source: z.string(),
  user_id: z.string(),
  organization_id: z.string(),
});

const ProductInfo = z.object({
  title: z.string(),
  price: z.string(),
  description: z.string(),
  subHeading: z.string(),
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

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    apiKey:
      'sk-tiRVySScnfxbodRLjjgx-nK-u9U14DlfUXW3EF6YYeT3BlbkFJclkod64vNHuuB91taCOuFX-WzFULHZrjHn9BvfsV4A',
  });
  let browser;

  try {
    const body = await req.json();
    const { language, url, source, user_id, organization_id } =
      requestSchema.parse(body);

    browser = await puppeteer.connect({
      browserWSEndpoint:
        'wss://brd-customer-hl_a6602661-zone-rapid_product_launcher:ejn9gv5hnxa3@brd.superproxy.io:9222',
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    let pdpBodyTopHtml;

    try {
      console.log('Navigating to URL:', url);
      await page.goto(url, {
        waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
        timeout: 60000,
      });

      // Log the page HTML to see what we're actually getting
      const pageContent = await page.content();
      console.log('Page HTML:', pageContent.substring(0, 500) + '...'); // Log first 500 chars

      // Check what selectors are available
      const availableSelectors = await page.evaluate(() => {
        // Log some common product container classes
        const selectors = [
          'div.pdp-body-top',
          'div.product-info',
          'div.product-detail',
          // Add more potential selectors
        ];

        return selectors.map((selector) => ({
          selector,
          exists: !!document.querySelector(selector),
          count: document.querySelectorAll(selector).length,
        }));
      });

      console.log('Available selectors:', availableSelectors);

      // Now try to get the product details
      pdpBodyTopHtml = await page.evaluate(() => {
        const pdpBodyTopDiv = document.querySelector('div.pdp-body-top');
        if (!pdpBodyTopDiv) {
          // Log all available div classes for debugging
          const allDivs = Array.from(document.querySelectorAll('div'));
          const classes = new Set(
            allDivs.map((div) => div.className).filter(Boolean),
          );
          console.log('Available div classes:', Array.from(classes));
          throw new Error(
            'Could not find product details div (div.pdp-body-top)',
          );
        }
        return pdpBodyTopDiv.outerHTML;
      });

      console.log('Successfully extracted PDP Body Top HTML');
    } catch (error) {
      console.error('Detailed error information:', {
        message: error.message,
        stack: error.stack,
        url: url,
        timestamp: new Date().toISOString(),
      });
      throw new Error(`Failed to extract product details: ${error.message}`);
    }

    if (!pdpBodyTopHtml) {
      return NextResponse.json(
        {
          error:
            'Failed to extract product data. Please check the URL or try again later.',
        },
        { status: 560 },
      );
    }

    // Prepare the prompt for the LLM
    const prompt = `
      Extract the following information from the product markup:
      - Product Title (provide a concise and intuitive name)
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

      Product Markup: ${pdpBodyTopHtml}
      Output in ${language}
    `;

    // Send the prompt to OpenAI
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: 'Extract the product information from the product markup.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: zodResponseFormat(ProductInfo, 'product'),
    });

    const productInfo = completion.choices[0].message.parsed;
    console.log(
      'Facebook Ad Copy:',
      JSON.stringify(productInfo?.adCopy.facebook, null, 2),
    );
    console.log(
      'Instagram Ad Copy:',
      JSON.stringify(productInfo?.adCopy.instagram, null, 2),
    );

    // Get the base URL from the request
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    // Send the productInfo to the generate route
    const response = await fetch(
      `${baseUrl}/api/generate/product-description-template`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productInfo),
      },
    );

    const html = cleanHTML((await response.json()).template);
    const productID = await saveProductTemplateToDB(
      html,
      productInfo,
      language,
      url,
      user_id,
      organization_id,
    );
    if (productID && productInfo?.adCopy) {
      await saveAdCreativesToDB(productID, productInfo.adCopy);
    }

    return NextResponse.json({
      productID,
      productInfo,
      html,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 },
      );
    }
    console.error('Error fetching or parsing data:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
