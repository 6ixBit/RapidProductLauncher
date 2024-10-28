import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OpenAIService } from './OpenAIService';
import { PuppeteerService } from './PupeteerService';
import { requestSchema } from './schema';
import {
  cleanHTML,
  saveAdCreativesToDB,
  saveImagesToDb,
  saveProductTemplateToDB,
} from './utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { language, url, source, user_id, organization_id } =
      requestSchema.parse(body);

    const product = await PuppeteerService.extractProductDetails(url);
    if (!product) {
      return NextResponse.json(
        { error: 'Failed to extract product data' },
        { status: 560 },
      );
    }

    const productInfo = await OpenAIService.generateProductInfo(
      product.pdpBodyTopHtml,
      language,
    );

    const baseUrl = `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`;
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

    if (productID) {
      if (productInfo?.adCopy) {
        await saveAdCreativesToDB(productID, productInfo.adCopy);
      }
      if (product.imageUrls?.length) {
        await saveImagesToDb(productID, product.imageUrls);
      }
    }

    return NextResponse.json({
      productID,
      productInfo,
      html,
      imageUrls: product.imageUrls,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 },
      );
    }
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
