/**
 * Content Ingestion System Types
 * Designed to be extractable as a standalone package
 */

// ============================================================================
// Source Types
// ============================================================================

export type ContentSourceType =
  | 'paragon'      // MLS listing pages
  | 'dropbox'      // Dropbox shared links
  | 'google-drive' // Google Drive shared links
  | 'direct'       // Direct URLs (images, files)
  | 'upload';      // Direct file uploads

export interface ContentSource {
  type: ContentSourceType;
  url: string;
  detected: boolean;
}

// ============================================================================
// CDN Types
// ============================================================================

export interface CDNFile {
  id: string;
  cdnUrl: string;
  originalUrl?: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

export interface CDNUploadOptions {
  folder: string;
  filename?: string;
  contentType?: string;
}

export interface CDNProvider {
  upload(data: Buffer | Blob, options: CDNUploadOptions): Promise<CDNFile>;
  delete(url: string): Promise<void>;
  list(folder: string): Promise<CDNFile[]>;
}

// ============================================================================
// Ingest Types
// ============================================================================

export interface IngestRequest {
  url: string;
  folder?: string;           // CDN folder to organize files into
  maxFiles?: number;         // Limit number of files to ingest
  metadata?: Record<string, unknown>; // Additional metadata to attach
  preview?: boolean;         // If true, fetch but don't upload (for testing)
}

export interface IngestResult {
  id: string;
  source: ContentSourceType;
  sourceUrl: string;
  files: CDNFile[];
  metadata: IngestMetadata;
  ingestedAt: string;
  preview?: boolean;  // True if this was a preview (no CDN upload)
}

export interface IngestMetadata {
  // Common fields
  title?: string;
  description?: string;

  // MLS-specific (Paragon)
  mlsNumber?: string;
  address?: string;
  city?: string;
  province?: string;
  price?: number;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  lotSize?: string | null;
  propertyType?: string | null;

  // Generic
  [key: string]: unknown;
}

// ============================================================================
// Source Handler Interface
// ============================================================================

export interface FetchedContent {
  files: {
    data: Buffer;
    filename: string;
    mimeType: string;
    originalUrl?: string;
  }[];
  metadata: IngestMetadata;
}

export interface SourceHandler {
  type: ContentSourceType;
  detect(url: string): boolean;
  fetch(url: string, options?: { maxFiles?: number }): Promise<FetchedContent>;
}

// ============================================================================
// Error Types
// ============================================================================

export class IngestError extends Error {
  constructor(
    message: string,
    public code: 'UNSUPPORTED_SOURCE' | 'FETCH_FAILED' | 'UPLOAD_FAILED' | 'INVALID_URL',
    public sourceUrl?: string
  ) {
    super(message);
    this.name = 'IngestError';
  }
}
