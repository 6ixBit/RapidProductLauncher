import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import puppeteer, { Page } from 'puppeteer-core';

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

  private static async extractCarouselImages(page: Page): Promise<string[]> {
    console.log('Starting image extraction from carousel...');

    // Wait for thumbnails to be present
    await page.waitForSelector('.slider--item--FefNjlj');
    const thumbnails = await page.$$('.slider--item--FefNjlj');

    if (!thumbnails.length) {
      console.error('❌ Could not find carousel thumbnails');
      return [];
    }

    const maxImages = Math.min(5, thumbnails.length);
    console.log(
      `📷 Found ${thumbnails.length} thumbnails, will process ${maxImages}`,
    );

    const images: string[] = [];

    for (let i = 0; i < maxImages; i++) {
      try {
        console.log(`Processing thumbnail ${i + 1}/${maxImages}`);

        // Click the thumbnail using Puppeteer
        await thumbnails[i].click();

        // Wait for main image to load
        await page.waitForSelector('[class*="magnifier--image-"]', {
          timeout: 60000,
        });

        // Get the main image src using Puppeteer
        const mainImageSrc = await page.$eval(
          '[class*="magnifier--image-"]',
          (img: HTMLImageElement) => img.src,
        );

        const fullResUrl = mainImageSrc.replace(/_\d+x\d+\.jpg_\.webp$/, '');

        if (!images.includes(fullResUrl)) {
          console.log(
            `✅ Got image ${i + 1}: ${fullResUrl.substring(0, 50)}...`,
          );
          images.push(fullResUrl);
        } else {
          console.log(`⚠️ Duplicate image found for thumbnail ${i + 1}`);
        }

        // Wait a bit for next interaction
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Error processing thumbnail ${i + 1}:`, error);
      }
    }

    console.log(`🎉 Extraction complete. Found ${images.length} unique images`);
    return images;
  }

  private static async uploadImageToS3(
    imageUrl: string,
    index: number,
  ): Promise<string | null> {
    try {
      console.log(`Uploading image ${index + 1}:`, imageUrl);
      const imageResponse = await fetch(imageUrl, {
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
  }

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

      const imageUrls = await this.extractCarouselImages(page);
      console.log('Found images:', imageUrls.length);

      const s3Urls = await Promise.all(
        imageUrls.map((url, index) => this.uploadImageToS3(url, index)),
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
