import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { getFullGraphicData } from '@/lib/db';
import { getTemplate } from '@/lib/templates';

// For local development, use regular puppeteer
// For production (Vercel), use @sparticuz/chromium
const isDev = process.env.NODE_ENV === 'development';

async function getBrowser() {
  if (isDev) {
    return puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  // Production: use @sparticuz/chromium
  const chromium = await import('@sparticuz/chromium');
  return puppeteer.launch({
    args: chromium.default.args,
    executablePath: await chromium.default.executablePath(),
    headless: true,
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const graphicId = searchParams.get('graphicId');
  const scale = parseInt(searchParams.get('scale') || '1', 10);

  if (!graphicId) {
    return NextResponse.json({ error: 'graphicId is required' }, { status: 400 });
  }

  if (scale < 1 || scale > 3) {
    return NextResponse.json({ error: 'scale must be 1, 2, or 3' }, { status: 400 });
  }

  // Verify the graphic exists
  const data = await getFullGraphicData(graphicId);
  if (!data) {
    return NextResponse.json({ error: 'Graphic not found' }, { status: 404 });
  }

  const template = getTemplate(data.graphic.templateId);
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const [width, height] = template.size;

  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    // Set viewport to template size with device scale factor
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: scale,
    });

    // Build the render URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const renderUrl = `${baseUrl}/render/${graphicId}`;

    await page.goto(renderUrl, { waitUntil: 'networkidle0' });

    // Wait for fonts to load
    await page.waitForFunction(
      () => document.body.dataset.fontsReady === 'true',
      { timeout: 10000 }
    ).catch(() => {
      console.warn('Font loading timeout, continuing anyway');
    });

    // Screenshot the #stage element
    const stage = await page.$('#stage');
    if (!stage) {
      throw new Error('Stage element not found');
    }

    const screenshot = await stage.screenshot({
      type: 'png',
      omitBackground: false,
    });

    await browser.close();

    // Generate filename
    const filename = `${data.listing.address.replace(/[^a-z0-9]/gi, '-')}-${data.graphic.variant}-${scale}x.png`;

    // Convert Uint8Array to Buffer for NextResponse
    const buffer = Buffer.from(screenshot);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Render error:', error);
    if (browser) await browser.close();
    return NextResponse.json(
      { error: 'Failed to render graphic', details: String(error) },
      { status: 500 }
    );
  }
}
