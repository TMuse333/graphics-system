import { SourceHandler, FetchedContent } from '../types';

/**
 * Google Drive Source Handler
 * Handles shared links - no API auth needed for public links
 *
 * Transforms:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   → https://drive.google.com/uc?export=download&id=FILE_ID
 */
export const googleDriveSource: SourceHandler = {
  type: 'google-drive',

  detect(url: string): boolean {
    return url.includes('drive.google.com') || url.includes('docs.google.com');
  },

  async fetch(url: string): Promise<FetchedContent> {
    const fileId = extractFileId(url);
    if (!fileId) {
      throw new Error('Could not extract file ID from Google Drive URL');
    }

    const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    const response = await fetch(directUrl, {
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Drive file: ${response.status}`);
    }

    // Check if we got a virus scan warning page (large files)
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      // Try with confirm parameter for large files
      const confirmUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`;
      const confirmResponse = await fetch(confirmUrl, { redirect: 'follow' });

      if (!confirmResponse.ok || (confirmResponse.headers.get('content-type') || '').includes('text/html')) {
        throw new Error('Google Drive file requires manual confirmation or is not publicly accessible');
      }

      const buffer = Buffer.from(await confirmResponse.arrayBuffer());
      const filename = extractFilename(confirmResponse.headers.get('content-disposition')) || `${fileId}`;

      return {
        files: [{
          data: buffer,
          filename,
          mimeType: confirmResponse.headers.get('content-type') || 'application/octet-stream',
          originalUrl: url,
        }],
        metadata: {
          title: filename,
        },
      };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const filename = extractFilename(response.headers.get('content-disposition')) || `${fileId}`;

    return {
      files: [{
        data: buffer,
        filename,
        mimeType: contentType || 'application/octet-stream',
        originalUrl: url,
      }],
      metadata: {
        title: filename,
      },
    };
  },
};

function extractFileId(url: string): string | null {
  // Handle /file/d/FILE_ID/view format
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return fileMatch[1];

  // Handle /open?id=FILE_ID format
  const openMatch = url.match(/[?&]id=([^&]+)/);
  if (openMatch) return openMatch[1];

  // Handle /d/FILE_ID format (shortened)
  const shortMatch = url.match(/\/d\/([^/]+)/);
  if (shortMatch) return shortMatch[1];

  return null;
}

function extractFilename(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null;

  // Try filename*= (RFC 5987)
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;\n]+)/i);
  if (utf8Match) return decodeURIComponent(utf8Match[1]);

  // Try filename=
  const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
  if (match) return match[1];

  return null;
}
