import { SourceHandler, FetchedContent } from '../types';

/**
 * Direct URL Source Handler
 * Handles direct image/file URLs
 */
export const directSource: SourceHandler = {
  type: 'direct',

  detect(url: string): boolean {
    // This is the fallback - accepts any URL
    // Other handlers should be checked first
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  async fetch(url: string): Promise<FetchedContent> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = Buffer.from(await response.arrayBuffer());

    // Extract filename from URL or content-disposition
    let filename = url.split('/').pop()?.split('?')[0] || 'file';
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
      if (match) filename = match[1];
    }

    // Add extension if missing
    if (!filename.includes('.')) {
      const ext = mimeToExtension(contentType);
      if (ext) filename += `.${ext}`;
    }

    return {
      files: [{
        data: buffer,
        filename,
        mimeType: contentType,
        originalUrl: url,
      }],
      metadata: {
        title: filename,
      },
    };
  },
};

function mimeToExtension(mimeType: string): string | null {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
  };
  return map[mimeType] || null;
}
