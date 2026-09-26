import puppeteer, { Browser, Page } from 'puppeteer';
import { SourceHandler, FetchedContent, IngestMetadata } from '../types';

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browserInstance;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

/**
 * Paragon MLS Source Handler
 * Scrapes listing pages and extracts images + metadata
 */
export const paragonSource: SourceHandler = {
  type: 'paragon',

  detect(url: string): boolean {
    return url.includes('paragon') || url.includes('zsvc.paragon.ice.com');
  },

  async fetch(url: string, options?: { maxFiles?: number }): Promise<FetchedContent> {
    const maxFiles = options?.maxFiles || 50;
    let page: Page | null = null;

    try {
      const browser = await getBrowser();
      page = await browser.newPage();

      await page.setViewport({ width: 1280, height: 900 });

      // Capture image responses as they load
      const capturedImages = new Map<string, Buffer>();
      await page.setRequestInterception(true);

      page.on('request', (request) => {
        request.continue();
      });

      page.on('response', async (response) => {
        const responseUrl = response.url();
        if (responseUrl.includes('zimg.paragon.ice.com') && responseUrl.includes('ParagonImages')) {
          try {
            const buffer = await response.buffer();
            capturedImages.set(responseUrl, buffer);
          } catch {
            // Response might not have a body
          }
        }
      });

      // Navigate and wait for content
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('img[alt="Listing photo."]', { timeout: 15000 });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Collect image URLs
      const imageUrls: string[] = [];
      const seenUrls = new Set<string>();

      const collectImages = async () => {
        const newImages = await page!.evaluate(() => {
          const images: string[] = [];
          document.querySelectorAll('img[alt="Listing photo."]').forEach((img) => {
            const src = (img as HTMLImageElement).src;
            if (src && src.includes('paragon')) {
              images.push(src);
            }
          });
          document.querySelectorAll('[class*="thumbnail"] img, [class*="carousel"] img, [class*="gallery"] img, [class*="strip"] img').forEach((img) => {
            const src = (img as HTMLImageElement).src;
            if (src && src.includes('paragon')) {
              images.push(src);
            }
          });
          return images;
        });

        for (const src of newImages) {
          if (!seenUrls.has(src) && imageUrls.length < maxFiles) {
            seenUrls.add(src);
            const highRes = src.replace(/\/\d+\/\d+\/\d+\/\d+\//, '/1280/960/');
            imageUrls.push(highRes);
          }
        }
      };

      await collectImages();

      // Click through carousel to get more images
      for (let i = 0; i < 20 && imageUrls.length < maxFiles; i++) {
        const nextButton = await page.$('[class*="next"], [class*="chevron-right"], [aria-label*="next"], button[class*="right"]');
        if (!nextButton) break;

        try {
          await nextButton.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          await collectImages();
        } catch {
          break;
        }
      }

      // Extract metadata from page
      const metadata = await page.evaluate((sourceUrl: string, collectedImageUrls: string[]): IngestMetadata => {
        let mlsNumber = '';
        let address = '';
        let city = '';
        const province = 'PE';
        let price = 0;
        let beds: number | null = null;
        let baths: number | null = null;
        let sqft: number | null = null;
        let lotSize: string | null = null;
        let description: string | null = null;

        const parsePrice = (text: string | null): number => {
          if (!text) return 0;
          const cleaned = text.replace(/[^0-9.]/g, '');
          return parseFloat(cleaned) || 0;
        };

        // Look for address
        const addressEl = document.querySelector('[class*="address"], [class*="street"], h1, h2');
        if (addressEl) {
          address = addressEl.textContent?.trim() || '';
        }

        // Look for price
        const priceEl = document.querySelector('[class*="price"], [class*="Price"]');
        if (priceEl) {
          price = parsePrice(priceEl.textContent);
        }

        // Extract from page text
        const detailsText = document.body.innerText;

        const bedsMatch = detailsText.match(/(\d+)\s*(?:bed|bedroom|br)/i);
        if (bedsMatch) beds = parseInt(bedsMatch[1]);

        const bathsMatch = detailsText.match(/(\d+(?:\.\d+)?)\s*(?:bath|bathroom|ba)/i);
        if (bathsMatch) baths = parseFloat(bathsMatch[1]);

        const sqftMatch = detailsText.match(/([\d,]+)\s*(?:sq\.?\s*ft|sqft|square feet)/i);
        if (sqftMatch) sqft = parseInt(sqftMatch[1].replace(/,/g, ''));

        const mlsMatch = detailsText.match(/MLS[#:\s]*(\d+)/i);
        if (mlsMatch) mlsNumber = mlsMatch[1];

        // Extract MLS from image URL if not found
        if (!mlsNumber && collectedImageUrls.length > 0) {
          const urlMatch = collectedImageUrls[0].match(/\/(\d{9,})-[a-f0-9-]+\.[a-zA-Z]+$/i);
          if (urlMatch) mlsNumber = urlMatch[1];
        }

        const lotMatch = detailsText.match(/([\d.]+)\s*(?:acres?|ac)/i);
        if (lotMatch) lotSize = `${lotMatch[1]} acres`;

        // Extract city from address
        const cityMatch = address.match(/,\s*([^,]+),?\s*(?:PE|PEI|Prince Edward Island)?$/i);
        if (cityMatch) {
          city = cityMatch[1].trim();
          address = address.replace(/,\s*[^,]+,?\s*(?:PE|PEI|Prince Edward Island)?$/i, '').trim();
        }

        const descEl = document.querySelector('[class*="description"], [class*="remarks"]');
        if (descEl) {
          description = descEl.textContent?.trim() || null;
        }

        return {
          mlsNumber,
          address,
          city,
          province,
          price,
          beds,
          baths,
          sqft,
          lotSize,
          description: description || undefined,
          title: address || `MLS# ${mlsNumber}`,
        };
      }, url, imageUrls);

      // Build file list from captured images
      const files: FetchedContent['files'] = [];

      for (let i = 0; i < imageUrls.length; i++) {
        const imgUrl = imageUrls[i];
        let buffer: Buffer | undefined;

        // Find captured buffer by matching hash
        for (const [capturedUrl, capturedBuffer] of capturedImages) {
          const capturedHash = capturedUrl.match(/\/([a-f0-9]{32})\//)?.[1];
          const imgHash = imgUrl.match(/\/([a-f0-9]{32})\//)?.[1];
          if (capturedHash && imgHash && capturedHash === imgHash) {
            buffer = capturedBuffer;
            break;
          }
        }

        if (buffer) {
          const filename = `${String(i + 1).padStart(2, '0')}.jpg`;
          files.push({
            data: buffer,
            filename,
            mimeType: 'image/jpeg',
            originalUrl: imgUrl,
          });
        }
      }

      await page.close();
      await closeBrowser();

      return { files, metadata };
    } catch (error) {
      if (page) await page.close();
      await closeBrowser();
      throw error;
    }
  },
};
