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

      // Get all text content for regex matching
      const detailsText = document.body.innerText;

      // ========== ADDRESS EXTRACTION ==========
      // Try multiple Paragon-specific selectors
      const addressSelectors = [
        '.listing-address',
        '.property-address',
        '[data-testid="address"]',
        '.address-line',
        '.street-address',
        '[class*="AddressLine"]',
        '[class*="address-line"]',
        '[class*="streetAddress"]',
        'h1[class*="address"]',
        'h2[class*="address"]',
        // Paragon specific patterns
        '.listing-detail-address',
        '.listing-header h1',
        '.listing-header h2',
      ];

      for (const selector of addressSelectors) {
        const el = document.querySelector(selector);
        if (el?.textContent?.trim()) {
          address = el.textContent.trim();
          break;
        }
      }

      // Fallback: look for address pattern in text
      if (!address) {
        // Match various address patterns including "Lot X-X Street Name" and "123 Street Name"
        const addrPatterns = [
          // Lot format: "Lot 24-1 Blue Water Av"
          /(Lot\s+[\d-]+\s+[A-Za-z][A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Boulevard|Blvd|Way|Place|Pl|Crescent|Cres|Circle|Cir|Av)[^,\n]*)/i,
          // Standard format: "123 Street Name"
          /(\d+\s+[A-Za-z][A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Boulevard|Blvd|Way|Place|Pl|Crescent|Cres|Circle|Cir|Av)[^,\n]*)/i,
          // Paragon format: line after agent name, before city
          /(?:REALTY|REALTOR)\n([^\n]+)\n\n([A-Za-z\s]+),\s*(?:PE|NS|NB)/i,
        ];
        for (const pattern of addrPatterns) {
          const match = detailsText.match(pattern);
          if (match) {
            address = match[1].trim();
            break;
          }
        }
      }

      // ========== PRICE EXTRACTION ==========
      const priceSelectors = [
        '.listing-price',
        '.property-price',
        '[data-testid="price"]',
        '.price',
        '[class*="Price"]',
        '[class*="price"]',
        '.listing-detail-price',
      ];

      for (const selector of priceSelectors) {
        const el = document.querySelector(selector);
        if (el?.textContent) {
          const p = parsePrice(el.textContent);
          if (p > 10000) { // Sanity check - real estate prices
            price = p;
            break;
          }
        }
      }

      // Fallback: find price pattern in text ($XXX,XXX or CA$XXX,XXX)
      if (!price) {
        const pricePatterns = [
          /CA\$\s*([\d,]+(?:\.\d{2})?)/i,
          /\$\s*([\d,]+(?:\.\d{2})?)/,
          /(?:Price|Asking)[:\s]*\$?\s*([\d,]+)/i,
        ];
        for (const pattern of pricePatterns) {
          const match = detailsText.match(pattern);
          if (match) {
            const p = parsePrice(match[1]);
            if (p > 10000) {
              price = p;
              break;
            }
          }
        }
      }

      // ========== BEDS/BATHS/SQFT EXTRACTION ==========
      // Try to extract beds - multiple patterns
      const bedsPatterns = [
        /(\d+)\s*(?:bed|bedroom|br|BD)/i,
        /(?:bed|bedroom|br|BD)[:\s]*(\d+)/i,
        /(\d+)\s*(?:Bed|Beds)/,
      ];
      for (const pattern of bedsPatterns) {
        const match = detailsText.match(pattern);
        if (match) {
          beds = parseInt(match[1]);
          break;
        }
      }

      // Try to extract baths
      const bathsPatterns = [
        /(\d+(?:\.\d+)?)\s*(?:bath|bathroom|ba|BA)/i,
        /(?:bath|bathroom|ba|BA)[:\s]*(\d+(?:\.\d+)?)/i,
        /(\d+(?:\.\d+)?)\s*(?:Bath|Baths)/,
      ];
      for (const pattern of bathsPatterns) {
        const match = detailsText.match(pattern);
        if (match) {
          baths = parseFloat(match[1]);
          break;
        }
      }

      // Try to extract sqft
      const sqftPatterns = [
        /([\d,]+)\s*(?:sq\.?\s*ft|sqft|square feet|SF)/i,
        /(?:sq\.?\s*ft|sqft|SF)[:\s]*([\d,]+)/i,
        /(?:living area|area)[:\s]*([\d,]+)/i,
      ];
      for (const pattern of sqftPatterns) {
        const match = detailsText.match(pattern);
        if (match) {
          sqft = parseInt(match[1].replace(/,/g, ''));
          break;
        }
      }

      // ========== MLS NUMBER EXTRACTION ==========
      const mlsPatterns = [
        /LISTING\s*ID[#:\s]*\s*(\d+)/i,
        /Listing\s*ID[#:\s]*\s*(\d+)/i,
        /MLS[#:\s]*(\d+)/i,
        /MLS\s*(?:Number|#|No\.?)[:\s]*(\d+)/i,
        /(?:Property)\s*(?:ID|#)[:\s]*(\d+)/i,
      ];
      for (const pattern of mlsPatterns) {
        const match = detailsText.match(pattern);
        if (match) {
          mlsNumber = match[1];
          break;
        }
      }

      // If no MLS from text, try to get from image URL
      if (!mlsNumber && collectedImages.length > 0) {
        const urlMatch = collectedImages[0].url.match(/\/(\d{9,})-[a-f0-9-]+\.[a-zA-Z]+$/i);
        if (urlMatch) mlsNumber = urlMatch[1];
      }

      // ========== DESCRIPTION EXTRACTION ==========
      const descSelectors = [
        '.listing-description',
        '.property-description',
        '[class*="description"]',
        '[class*="remarks"]',
        '.public-remarks',
        '.listing-remarks',
      ];
      for (const selector of descSelectors) {
        const el = document.querySelector(selector);
        if (el?.textContent?.trim() && el.textContent.trim().length > 50) {
          description = el.textContent.trim();
          break;
        }
      }

      // ========== LOT SIZE EXTRACTION ==========
      const lotPatterns = [
        /([\d.]+)\s*(?:acres?|ac)/i,
        /lot[:\s]*([\d.]+)\s*(?:acres?|ac|sq\.?\s*ft|sqft)/i,
      ];
      for (const pattern of lotPatterns) {
        const match = detailsText.match(pattern);
        if (match) {
          lotSize = `${match[1]} acres`;
          break;
        }
      }

      // ========== CITY EXTRACTION ==========
      // Try to extract city from address or find it in text
      if (address) {
        const cityMatch = address.match(/,\s*([A-Za-z\s]+),?\s*(?:PE|PEI|NS|NB|Prince Edward Island|Nova Scotia|New Brunswick)?$/i);
        if (cityMatch) {
          city = cityMatch[1].trim();
          address = address.replace(/,\s*[A-Za-z\s]+,?\s*(?:PE|PEI|NS|NB|Prince Edward Island|Nova Scotia|New Brunswick)?$/i, '').trim();
        }
      }

      // Fallback: look for city pattern in text (City, PE postal)
      if (!city) {
        const cityPatterns = [
          /\n([A-Za-z\s]+),\s*(?:PE|PEI)\s+[A-Z]\d[A-Z]\s*\d[A-Z]\d/i,
          /([A-Za-z\s]+),\s*(?:PE|PEI|NS|NB)\s+[A-Z]\d[A-Z]/i,
        ];
        for (const pattern of cityPatterns) {
          const match = detailsText.match(pattern);
          if (match) {
            city = match[1].trim();
            break;
          }
        }
      }

      // Debug: capture some raw text for troubleshooting
      const debugSnippet = detailsText.substring(0, 500);

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
        _debug: debugSnippet, // Will be stripped before returning to client
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
