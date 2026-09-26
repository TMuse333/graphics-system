import { nanoid } from 'nanoid';
import { IngestRequest, IngestResult, IngestError, CDNFile } from './types';
import { getCDN } from './cdn';
import { detectSource, getSourceHandler } from './sources';

/**
 * Main ingest function
 *
 * Takes a URL from any supported source, fetches the content,
 * uploads to CDN, and returns structured result.
 *
 * @example
 * const result = await ingest({
 *   url: 'https://zsvc.paragon.ice.com/s/goto/...',
 *   folder: 'listings/202623440',
 * });
 */
export async function ingest(request: IngestRequest): Promise<IngestResult> {
  const { url, folder, maxFiles, metadata: additionalMetadata, preview } = request;

  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new IngestError('Invalid URL provided', 'INVALID_URL', url);
  }

  // Detect source type
  const source = detectSource(url);
  const handler = getSourceHandler(source.type);

  // Fetch content from source
  let fetchedContent;
  try {
    fetchedContent = await handler.fetch(url, { maxFiles });
  } catch (error) {
    throw new IngestError(
      `Failed to fetch from ${source.type}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'FETCH_FAILED',
      url
    );
  }

  // Generate unique ID for this ingest
  const ingestId = nanoid(12);

  // Determine folder path
  const cdnFolder = folder || `ingest/${ingestId}`;

  let uploadedFiles: CDNFile[] = [];

  if (preview) {
    // Preview mode: don't upload, just return file info
    uploadedFiles = fetchedContent.files.map((file, index) => ({
      id: `preview-${index}`,
      cdnUrl: `[preview] ${cdnFolder}/${file.filename}`,
      originalUrl: file.originalUrl,
      filename: file.filename,
      mimeType: file.mimeType,
      size: file.data.length,
    }));
  } else {
    // Upload files to CDN
    const cdn = getCDN();

    for (const file of fetchedContent.files) {
      try {
        const cdnFile = await cdn.upload(file.data, {
          folder: cdnFolder,
          filename: file.filename,
          contentType: file.mimeType,
        });

        uploadedFiles.push({
          ...cdnFile,
          originalUrl: file.originalUrl,
        });
      } catch (error) {
        throw new IngestError(
          `Failed to upload ${file.filename}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'UPLOAD_FAILED',
          url
        );
      }
    }
  }

  // Merge metadata
  const metadata = {
    ...fetchedContent.metadata,
    ...additionalMetadata,
  };

  return {
    id: ingestId,
    source: source.type,
    sourceUrl: url,
    files: uploadedFiles,
    metadata,
    ingestedAt: new Date().toISOString(),
    preview,
  };
}

/**
 * Quick helper to just get CDN URLs from a source
 * Useful when you just need the URLs, not the full result
 */
export async function ingestUrls(
  url: string,
  folder?: string
): Promise<string[]> {
  const result = await ingest({ url, folder });
  return result.files.map((f) => f.cdnUrl);
}
