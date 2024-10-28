import puppeteer from 'puppeteer-core';

export class PuppeteerService {
  private static readonly BROWSER_WS_ENDPOINT =
    'wss://brd-customer-hl_a6602661-zone-rapid_product_launcher:ejn9gv5hnxa3@brd.superproxy.io:9222';

  static async extractProductDetails(url: string) {
    const browser = await puppeteer.connect({
      browserWSEndpoint: this.BROWSER_WS_ENDPOINT,
    });

    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2 * 60 * 1000);

      await page.goto(url, {
        waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
        timeout: 60000,
      });

      const pdpBodyTopHtml = await page.evaluate(() => {
        const pdpBodyTopDiv = document.querySelector('div.pdp-body-top');
        if (!pdpBodyTopDiv) {
          throw new Error('Could not find product details div');
        }
        return pdpBodyTopDiv.outerHTML;
      });

      return pdpBodyTopHtml;
    } finally {
      await browser.close();
    }
  }
}
