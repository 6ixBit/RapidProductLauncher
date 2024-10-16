import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import puppeteer from 'puppeteer-core';
import { z } from 'zod';

const requestSchema = z.object({
  language: z.string(),
  url: z.string().url(),
  source: z.string(),
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
});

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    apiKey:
      'sk-tiRVySScnfxbodRLjjgx-nK-u9U14DlfUXW3EF6YYeT3BlbkFJclkod64vNHuuB91taCOuFX-WzFULHZrjHn9BvfsV4A',
  });
  let browser;

  try {
    const body = await req.json();
    const { language, url, source } = requestSchema.parse(body);

    browser = await puppeteer.connect({
      browserWSEndpoint:
        'wss://brd-customer-hl_a6602661-zone-rapid_product_launcher:ejn9gv5hnxa3@brd.superproxy.io:9222',
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const pdpBodyTopHtml = await page.evaluate(() => {
      const pdpBodyTopDiv = document.querySelector('div.pdp-body-top');
      return pdpBodyTopDiv ? pdpBodyTopDiv.outerHTML : null;
    });

    console.log('PDP Body Top HTML:', pdpBodyTopHtml);

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

    // Construct the absolute URL for the generate route
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const generateProductTemplateUrl = `${protocol}://${host}/api/generate/product-description-template`;

    // Send the productInfo to the generate route
    const response = await fetch(generateProductTemplateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productInfo),
    });

    const html = cleanHTML((await response.json()).template); // Assuming the HTML is in the 'template' field
    console.log('Generated HTML:', html);

    // Return the generated HTML and product info to the client
    return NextResponse.json({
      message: 'Data received and parsed successfully',
      html,
      productInfo,
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

function cleanHTML(html: string): string {
  return html.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
}
