import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import { z } from 'zod';

const requestSchema = z.object({
  language: z.string(),
  url: z.string().url(),
  source: z.string(),
});

export async function POST(req: NextRequest) {
  let browser;
  try {
    const body = await req.json();
    const { language, url, source } = requestSchema.parse(body);

    console.log('Language:', language);
    console.log('URL:', url);
    console.log('Source:', source);

    browser = await puppeteer.connect({
      browserWSEndpoint:
        'wss://brd-customer-hl_a6602661-zone-rapid_product_launcher:ejn9gv5hnxa3@brd.superproxy.io:9222',
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Log the page outer HTML
    const pageHtml = await page.evaluate(
      () => document.documentElement.outerHTML,
    );
    console.log('Page HTML:', pageHtml);

    // Extract the title
    const title = await page.evaluate(() => {
      const titleElement = document.querySelector(
        'h1[data-pl="product-title"]',
      );
      return titleElement ? titleElement?.textContent?.trim() : null;
    });

    // Extract the price
    const price = await page.evaluate(() => {
      const priceElement = document.querySelector(
        'span.price--currentPriceText--V8_y_b5.pdp-comp-price-current.product-price-value',
      );
      return priceElement ? priceElement?.textContent?.trim() : null;
    });

    // Check if the extraction was successful
    if (!title || !price) {
      return NextResponse.json(
        {
          error:
            'Failed to extract product data. Please check the URL or try again later.',
        },
        { status: 599 },
      );
    }

    // Return the extracted data
    return NextResponse.json({
      message: 'Data received and parsed successfully',
      productData: {
        title,
        price,
      },
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
