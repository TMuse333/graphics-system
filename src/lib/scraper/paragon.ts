import puppeteer, { Browser, Page } from 'puppeteer';
import { ScrapedListing, ScrapedImage, ScrapeResult } from './types';

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
 * Scrape a Paragon MLS listing page
 * Handles both direct URLs and short links (zsvc.paragon.ice.com/s/goto/...)
 */
export async function scrapeParagonListing(url: string): Promise<ScrapeResult> {
  let page: Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    // Set a reasonable viewport
    await page.setViewport({ width: 1280, height: 900 });

    // Capture image responses
    const capturedImages = new Map<string, Buffer>();
    await page.setRequestInterception(true);

    page.on('request', (request) => {
      request.continue();
    });

    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('zimg.paragon.ice.com') && url.includes('ParagonImages')) {
        try {
          const buffer = await response.buffer();
          capturedImages.set(url, buffer);
        } catch {
          // Response might not have a body
        }
      }
    });

    // Navigate and wait for content
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for listing content to load
    await page.waitForSelector('img[alt="Listing photo."]', { timeout: 15000 });

    // Give the page a moment to fully render
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Click through the carousel to load all images
    const imageUrls: string[] = [];
    const seenUrls = new Set<string>();

    // First, collect any currently visible images
    const collectImages = async () => {
      const newImages = await page!.evaluate(() => {
        const images: string[] = [];
        document.querySelectorAll('img[alt="Listing photo."]').forEach((img) => {
          const src = (img as HTMLImageElement).src;
          if (src && src.includes('paragon')) {
            images.push(src);
          }
        });
        // Also check for thumbnail images
        document.querySelectorAll('[class*="thumbnail"] img, [class*="carousel"] img, [class*="gallery"] img, [class*="strip"] img').forEach((img) => {
          const src = (img as HTMLImageElement).src;
          if (src && src.includes('paragon')) {
            images.push(src);
          }
        });
        return images;
      });

      for (const src of newImages) {
        if (!seenUrls.has(src)) {
          seenUrls.add(src);
          // Upgrade resolution - the URL format has /1280/960/640/480/ or similar
          const highRes = src.replace(/\/\d+\/\d+\/\d+\/\d+\//, '/1280/960/');
          imageUrls.push(highRes);
        }
      }
    };

    await collectImages();

    // Try to click through carousel to get more images (up to 20 clicks)
    for (let i = 0; i < 20; i++) {
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

    // Build downloaded images from captured responses
    const downloadedImages: ScrapedImage[] = [];
    for (const imgUrl of imageUrls) {
      // Check if we captured this image (original or high-res version)
      let base64: string | undefined;

      // Try to find a captured version of this image
      for (const [capturedUrl, buffer] of capturedImages) {
        // Match by the unique hash part of the URL
        const capturedHash = capturedUrl.match(/\/([a-f0-9]{32})\//)?.[1];
        const imgHash = imgUrl.match(/\/([a-f0-9]{32})\//)?.[1];
        if (capturedHash && imgHash && capturedHash === imgHash) {
          base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
          break;
        }
      }

      downloadedImages.push({ url: imgUrl, base64 });
    }

    // Extract all text data from the page
    const listing = await page.evaluate((sourceUrl: string, collectedImages: ScrapedImage[]) => {
      // Helper to get text content safely
      const getText = (selector: string): string | null => {
        const el = document.querySelector(selector);
        return el?.textContent?.trim() || null;
      };

      // Helper to parse price
      const parsePrice = (text: string | null): number => {
        if (!text) return 0;
        const cleaned = text.replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
      };

      // Try to find listing details
      let address = '';
      let city = '';
      let province = 'PE';
      let price = 0;
      let beds: number | null = null;
      let baths: number | null = null;
      let sqft: number | null = null;
      let lotSize: string | null = null;
      let propertyType: string | null = null;
      let description: string | null = null;
      let mlsNumber = '';

      // Look for address in common locations
      const addressEl = document.querySelector('[class*="address"], [class*="street"], h1, h2');
      if (addressEl) {
        address = addressEl.textContent?.trim() || '';
      }

      // Look for price
      const priceEl = document.querySelector('[class*="price"], [class*="Price"]');
      if (priceEl) {
        price = parsePrice(priceEl.textContent);
      }

      // Look for property details in various formats
      const detailsText = document.body.innerText;

      // Try to extract beds
      const bedsMatch = detailsText.match(/(\d+)\s*(?:bed|bedroom|br)/i);
      if (bedsMatch) beds = parseInt(bedsMatch[1]);

      // Try to extract baths
      const bathsMatch = detailsText.match(/(\d+(?:\.\d+)?)\s*(?:bath|bathroom|ba)/i);
      if (bathsMatch) baths = parseFloat(bathsMatch[1]);

      // Try to extract sqft
      const sqftMatch = detailsText.match(/([\d,]+)\s*(?:sq\.?\s*ft|sqft|square feet)/i);
      if (sqftMatch) sqft = parseInt(sqftMatch[1].replace(/,/g, ''));

      // Try to extract MLS number
      const mlsMatch = detailsText.match(/MLS[#:\s]*(\d+)/i);
      if (mlsMatch) mlsNumber = mlsMatch[1];

      // If no MLS from text, try to get from image URL
      // Format: /202623440-uuid.JPG
      if (!mlsNumber && collectedImages.length > 0) {
        const urlMatch = collectedImages[0].url.match(/\/(\d{9,})-[a-f0-9-]+\.[a-zA-Z]+$/i);
        if (urlMatch) mlsNumber = urlMatch[1];
      }

      // Look for description
      const descEl = document.querySelector('[class*="description"], [class*="remarks"], [class*="details"] p');
      if (descEl) {
        description = descEl.textContent?.trim() || null;
      }

      // Try to find lot size
      const lotMatch = detailsText.match(/([\d.]+)\s*(?:acres?|ac)/i);
      if (lotMatch) lotSize = `${lotMatch[1]} acres`;

      // Try to extract city from address or page
      const cityMatch = address.match(/,\s*([^,]+),?\s*(?:PE|PEI|Prince Edward Island)?$/i);
      if (cityMatch) {
        city = cityMatch[1].trim();
        address = address.replace(/,\s*[^,]+,?\s*(?:PE|PEI|Prince Edward Island)?$/i, '').trim();
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
        propertyType,
        description,
        images: collectedImages,
        scrapedAt: new Date().toISOString(),
        sourceUrl,
      };
    }, url, downloadedImages);

    await page.close();

    return {
      success: true,
      listing,
    };
  } catch (error) {
    if (page) await page.close();

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if a URL is a Paragon MLS link
 */
export function isParagonUrl(url: string): boolean {
  return url.includes('paragon') || url.includes('zsvc.paragon.ice.com');
}
