import { SourceHandler, ContentSource, IngestError } from '../types';
import { paragonSource } from './paragon';
import { dropboxSource } from './dropbox';
import { googleDriveSource } from './google-drive';
import { directSource } from './direct';

// Register all source handlers in priority order
// More specific handlers should come first
const sourceHandlers: SourceHandler[] = [
  paragonSource,
  dropboxSource,
  googleDriveSource,
  directSource, // Fallback - should be last
];

/**
 * Detect the source type for a given URL
 */
export function detectSource(url: string): ContentSource {
  for (const handler of sourceHandlers) {
    if (handler.detect(url)) {
      return {
        type: handler.type,
        url,
        detected: true,
      };
    }
  }

  return {
    type: 'direct',
    url,
    detected: false,
  };
}

/**
 * Get the handler for a given source type
 */
export function getSourceHandler(type: string): SourceHandler {
  const handler = sourceHandlers.find((h) => h.type === type);
  if (!handler) {
    throw new IngestError(
      `No handler found for source type: ${type}`,
      'UNSUPPORTED_SOURCE'
    );
  }
  return handler;
}

/**
 * Get all registered source handlers
 */
export function getAllSourceHandlers(): SourceHandler[] {
  return [...sourceHandlers];
}

// Re-export individual sources
export { paragonSource } from './paragon';
export { dropboxSource } from './dropbox';
export { googleDriveSource } from './google-drive';
export { directSource } from './direct';
