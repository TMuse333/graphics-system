import { CDNProvider } from '../types';
import { VercelBlobCDN } from './vercel-blob';

export type CDNProviderType = 'vercel-blob' | 'cloudinary' | 's3';

// Default to Vercel Blob - can be swapped via env var later
const PROVIDER = (process.env.CDN_PROVIDER || 'vercel-blob') as CDNProviderType;

let cdnInstance: CDNProvider | null = null;

/**
 * Get the configured CDN provider
 * Currently supports: vercel-blob
 * Future: cloudinary, s3
 */
export function getCDN(): CDNProvider {
  if (cdnInstance) return cdnInstance;

  switch (PROVIDER) {
    case 'vercel-blob':
      cdnInstance = new VercelBlobCDN();
      break;
    // Future providers:
    // case 'cloudinary':
    //   cdnInstance = new CloudinaryCDN();
    //   break;
    // case 's3':
    //   cdnInstance = new S3CDN();
    //   break;
    default:
      cdnInstance = new VercelBlobCDN();
  }

  return cdnInstance;
}

export { VercelBlobCDN } from './vercel-blob';
