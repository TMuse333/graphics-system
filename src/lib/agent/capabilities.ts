/**
 * Agent Capabilities Registry
 * Defines everything the agent can do
 */

import { Capability, InputDef } from './types';
import { GRAPHIC_TYPES, GraphicTypeId } from '../content/graphicTypes';

// ============================================================================
// Shared Input Definitions
// ============================================================================

const urlInput: InputDef = {
  id: 'url',
  type: 'url',
  label: 'Link',
  required: true,
  placeholder: 'Paste Paragon, Dropbox, or Google Drive link...',
  parseHints: ['http', 'https', 'paragon', 'dropbox', 'drive.google'],
};

const agentInput: InputDef = {
  id: 'agentIds',
  type: 'agent-ids',
  label: 'Agent',
  required: true,
  default: 'sender',
  parseHints: ['with', 'for', 'co-listed'],
};

const topicInput: InputDef = {
  id: 'topic',
  type: 'topic',
  label: 'Topic',
  required: true,
  placeholder: 'e.g., Buyer objections, First-time homebuyer tips...',
};

// ============================================================================
// Capabilities
// ============================================================================

export const CAPABILITIES: Capability[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // Ingest Content (retrieve from link, upload to CDN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ingest-content',
    name: 'Retrieve Content',
    description: 'Fetch images and data from a link (Paragon MLS, Dropbox, Google Drive) and upload to your CDN',
    icon: 'Download',
    intents: [
      'get content from',
      'fetch',
      'retrieve',
      'scrape',
      'grab images from',
      'pull from',
      'ingest',
    ],
    inputs: [
      urlInput,
      {
        id: 'maxFiles',
        type: 'enum',
        label: 'Max images',
        required: false,
        options: ['5', '10', '25', '50'],
        default: '10',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Create Listing Graphic (needs a property URL)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'create-listing-graphic',
    name: 'Listing Graphic',
    description: 'Create a graphic for a real estate listing (Just Listed, Open House, Sold, etc.)',
    icon: 'Image',
    intents: [
      'graphic for',
      'make a post',
      'create graphic',
      ...GRAPHIC_TYPES.flatMap(g => g.intents),
    ],
    inputs: [
      urlInput,
      {
        id: 'graphicType',
        type: 'enum',
        label: 'Type',
        required: true,
        options: GRAPHIC_TYPES.map(g => g.id),
        placeholder: 'What kind of graphic?',
      },
      agentInput,
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Create Content Graphic (carousel, no listing needed)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'create-content-graphic',
    name: 'Content Carousel',
    description: 'Create educational or marketing carousel (no listing needed)',
    icon: 'Layers',
    intents: [
      'carousel',
      'slides',
      'tips',
      'content graphic',
      'buyer objections',
      'seller tips',
      'market update',
      'educational',
    ],
    inputs: [
      topicInput,
      {
        id: 'slideCount',
        type: 'enum',
        label: 'Slides',
        required: false,
        options: ['5', '7', '10'],
        default: '7',
      },
      agentInput,
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Update Website
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'update-website',
    name: 'Update Website',
    description: 'Add or update a listing on the agent website',
    icon: 'Globe',
    intents: [
      'update website',
      'add to site',
      'update listing on site',
      'refresh website',
      'publish to website',
    ],
    inputs: [
      urlInput,
      {
        id: 'action',
        type: 'enum',
        label: 'Action',
        required: true,
        options: ['add', 'update', 'remove'],
        default: 'add',
      },
    ],
  },
];

// ============================================================================
// Helpers
// ============================================================================

/**
 * Find capability by intent phrase
 */
export function matchCapability(text: string): Capability | undefined {
  const lower = text.toLowerCase();

  // Score each capability by how many intents match
  const scored = CAPABILITIES.map(cap => {
    const matches = cap.intents.filter(intent => lower.includes(intent));
    const bestMatch = matches.sort((a, b) => b.length - a.length)[0];
    return { cap, score: bestMatch?.length || 0 };
  });

  const best = scored.sort((a, b) => b.score - a.score)[0];
  return best.score > 0 ? best.cap : undefined;
}

/**
 * Get capability by ID
 */
export function getCapability(id: string): Capability | undefined {
  return CAPABILITIES.find(c => c.id === id);
}

/**
 * Get graphic type options for listing graphics
 */
export function getGraphicTypeOptions(propertyType: 'residential' | 'land' | 'commercial'): GraphicTypeId[] {
  return GRAPHIC_TYPES
    .filter(g => g.appliesTo.includes(propertyType))
    .map(g => g.id);
}

/**
 * Build LLM context for capabilities
 */
export function getCapabilitiesContext(): string {
  return CAPABILITIES.map(cap =>
    `- ${cap.name}: ${cap.description}\n  Triggers: ${cap.intents.slice(0, 5).join(', ')}...`
  ).join('\n');
}
