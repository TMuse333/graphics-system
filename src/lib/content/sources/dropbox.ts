import { SourceHandler, FetchedContent } from '../types';

/**
 * Dropbox Source Handler
 * Handles shared links - no API auth needed for public links
 *
 * Transforms:
 *   https://www.dropbox.com/s/abc123/photo.jpg?dl=0
 *   → https://dl.dropboxusercontent.com/s/abc123/photo.jpg
 */
export const dropboxSource: SourceHandler = {
  type: 'dropbox',

  detect(url: string): boolean {
    return url.includes('dropbox.com') || url.includes('dropboxusercontent.com');
  },

  async fetch(url: string): Promise<FetchedContent> {
    // Transform shared link to direct download URL
    const directUrl = transformDropboxUrl(url);

    const response = await fetch(directUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch Dropbox file: ${response.status}`);
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

function transformDropboxUrl(url: string): string {
  // Handle different Dropbox URL formats
  let directUrl = url;

  // www.dropbox.com → dl.dropboxusercontent.com
  if (url.includes('www.dropbox.com')) {
    directUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  }

  // Remove ?dl=0 or change to ?dl=1
  directUrl = directUrl.replace(/[?&]dl=0/, '?dl=1');
  if (!directUrl.includes('dl=1') && !directUrl.includes('dropboxusercontent')) {
    directUrl += directUrl.includes('?') ? '&dl=1' : '?dl=1';
  }

  return directUrl;
}
