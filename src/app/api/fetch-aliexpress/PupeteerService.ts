import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import puppeteer from 'puppeteer-core';

export class PuppeteerService {
  private static readonly BROWSER_WS_ENDPOINT =
    'wss://brd-customer-hl_a6602661-zone-rapid_product_launcher:ejn9gv5hnxa3@brd.superproxy.io:9222';

  private static readonly s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });

  static async extractProductDetails(url: string) {
    const browser = await puppeteer.connect({
      browserWSEndpoint: this.BROWSER_WS_ENDPOINT,
    });

    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2 * 60 * 1000);

      await page.goto(url, {
        waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
      });

      // Extract image URLs with logging
      console.log('Starting image extraction...');
      const imageUrls = await page.evaluate(() => {
        const images = document.querySelectorAll('.pdp-info-left img');
        console.log(`Found ${images.length} images`);

        // Try multiple selectors and attributes
        return Array.from(images).map((img) => {
          const element = img as HTMLImageElement;
          const src = element.src;
          const dataSrc = element.getAttribute('data-src');
          const originalSrc = element.getAttribute('data-original');

          // Return all possible sources for logging
          return {
            src,
            dataSrc,
            originalSrc,
          };
        });
      });

      console.log('Raw image data:', JSON.stringify(imageUrls, null, 2));

      // Upload images to S3
      const s3Urls = await Promise.all(
        imageUrls.map(async (imageUrl, index) => {
          try {
            console.log(`Uploading image ${index + 1}:`, imageUrl);

            const imageResponse = await fetch(imageUrl.src, {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                Referer: 'https://aliexpress.com',
              },
            });

            if (!imageResponse.ok) {
              throw new Error(`Failed to fetch image: ${imageResponse.status}`);
            }

            const imageBuffer = await imageResponse.arrayBuffer();
            const key = `products/${Date.now()}-${index}.jpg`;

            await this.s3Client.send(
              new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME || '',
                Key: key,
                Body: Buffer.from(imageBuffer),
                ContentType: 'image/jpeg',
              }),
            );

            return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
          } catch (error) {
            console.error(`Failed to upload image ${index + 1}:`, error);
            return null;
          }
        }),
      );

      const successfulUrls = s3Urls.filter(
        (url): url is string => url !== null,
      );
      console.log('Successfully uploaded images:', successfulUrls.length);

      return {
        pdpBodyTopHtml: await page.evaluate(() => {
          const pdpBodyTopDiv = document.querySelector('div.pdp-body-top');
          if (!pdpBodyTopDiv) {
            throw new Error('Could not find product details div');
          }
          return pdpBodyTopDiv.outerHTML;
        }),
        imageUrls: successfulUrls,
      };
    } finally {
      await browser.close();
    }
  }
}
