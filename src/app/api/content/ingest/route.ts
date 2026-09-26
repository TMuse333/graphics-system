import { NextRequest, NextResponse } from 'next/server';
import { ingest, detectSource, IngestError } from '@/lib/content';

/**
 * POST /api/content/ingest
 *
 * Ingest content from a URL (Paragon, Dropbox, Google Drive, direct)
 * and upload to CDN.
 *
 * Body:
 * {
 *   url: string;        // The source URL
 *   folder?: string;    // Optional CDN folder path
 *   maxFiles?: number;  // Optional limit on files to ingest
 * }
 *
 * Returns:
 * {
 *   success: true;
 *   data: IngestResult;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, folder, maxFiles, preview } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    const result = await ingest({ url, folder, maxFiles, preview });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof IngestError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          sourceUrl: error.sourceUrl,
        },
        { status: error.code === 'INVALID_URL' ? 400 : 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/content/ingest?url=...
 *
 * Detect the source type for a URL without ingesting.
 * Useful for previewing what will happen.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid URL' },
      { status: 400 }
    );
  }

  const source = detectSource(url);

  return NextResponse.json({
    success: true,
    data: source,
  });
}
