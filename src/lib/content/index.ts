/**
 * Content Ingestion System
 *
 * A unified system for ingesting content from various sources
 * and uploading to your CDN.
 *
 * Supported sources:
 * - Paragon MLS (listing pages with image carousels)
 * - Dropbox (shared links)
 * - Google Drive (shared links)
 * - Direct URLs (images, files)
 *
 * @example
 * import { ingest } from '@/lib/content';
 *
 * const result = await ingest({
 *   url: 'https://zsvc.paragon.ice.com/s/goto/...',
 *   folder: 'listings/202623440',
 * });
 *
 * console.log(result.files); // CDN URLs ready to use
 */

// Main functions
export { ingest, ingestUrls } from './ingest';

// Source detection
export { detectSource, getSourceHandler, getAllSourceHandlers } from './sources';

// CDN
export { getCDN } from './cdn';

// Types
export type {
  ContentSourceType,
  ContentSource,
  CDNFile,
  CDNUploadOptions,
  CDNProvider,
  IngestRequest,
  IngestResult,
  IngestMetadata,
  FetchedContent,
  SourceHandler,
} from './types';

export { IngestError } from './types';
