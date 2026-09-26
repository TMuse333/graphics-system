import { put, del, list } from '@vercel/blob';
import { CDNProvider, CDNFile, CDNUploadOptions } from '../types';

/**
 * Vercel Blob CDN Provider
 *
 * Requires BLOB_READ_WRITE_TOKEN environment variable
 * Get it from: Vercel Dashboard → Storage → Blob → Tokens
 */
export class VercelBlobCDN implements CDNProvider {
  async upload(data: Buffer | Blob, options: CDNUploadOptions): Promise<CDNFile> {
    const pathname = options.folder
      ? `${options.folder}/${options.filename || this.generateFilename()}`
      : options.filename || this.generateFilename();

    const blob = await put(pathname, data, {
      access: 'public',
      contentType: options.contentType,
    });

    return {
      id: this.extractId(blob.url),
      cdnUrl: blob.url,
      filename: pathname.split('/').pop() || pathname,
      mimeType: options.contentType || 'application/octet-stream',
      size: Buffer.isBuffer(data) ? data.length : data.size,
    };
  }

  async delete(url: string): Promise<void> {
    await del(url);
  }

  async list(folder: string): Promise<CDNFile[]> {
    const { blobs } = await list({ prefix: folder });

    return blobs.map((blob) => ({
      id: this.extractId(blob.url),
      cdnUrl: blob.url,
      filename: blob.pathname.split('/').pop() || blob.pathname,
      mimeType: this.guessMimeType(blob.pathname),
      size: blob.size,
    }));
  }

  private generateFilename(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  }

  private extractId(url: string): string {
    // Extract a unique ID from the Vercel Blob URL
    const parts = url.split('/');
    return parts[parts.length - 1].split('.')[0];
  }

  private guessMimeType(pathname: string): string {
    const ext = pathname.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      pdf: 'application/pdf',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}
