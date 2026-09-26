/**
 * Agent System Types
 * Defines capabilities, inputs, and orchestration flow
 */

// ============================================================================
// Input Types - What the agent can receive
// ============================================================================

export type InputType =
  | 'url'           // Paragon link, Dropbox, etc.
  | 'image'         // Dropped/uploaded image
  | 'text'          // Free text prompt
  | 'topic'         // Content topic for carousels
  | 'date'          // Date picker
  | 'time-range'    // Time range (2-4pm)
  | 'money'         // Price input
  | 'enum'          // Select from options
  | 'agent-ids';    // Select agent(s)

export interface InputDef {
  id: string;
  type: InputType;
  label: string;
  required: boolean;
  options?: string[];         // For enum type
  default?: string;
  placeholder?: string;
  parseHints?: string[];      // Phrases to extract from free text
}

// ============================================================================
// Capability Types - What the agent can do
// ============================================================================

export type CapabilityId =
  | 'ingest-content'
  | 'create-listing-graphic'
  | 'create-content-graphic'
  | 'update-website';

export interface Capability {
  id: CapabilityId;
  name: string;
  description: string;
  icon: string;                // Lucide icon name
  intents: string[];           // Phrases that trigger this
  inputs: InputDef[];          // What it needs to run
  subCapabilities?: Capability[]; // Nested options
}

// ============================================================================
// Conversation Types - Agent ↔ User flow
// ============================================================================

export type MessageRole = 'user' | 'agent';

export interface AgentMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;

  // Agent can attach structured data
  data?: {
    type: 'options' | 'form' | 'preview' | 'result';
    payload: unknown;
  };
}

export interface ConversationState {
  messages: AgentMessage[];

  // Current context
  resolvedCapability?: CapabilityId;
  collectedInputs: Record<string, unknown>;
  pendingInputs: InputDef[];

  // Ingested content (if any)
  ingestedContent?: {
    id: string;
    source: string;
    files: { cdnUrl: string; filename: string }[];
    metadata: Record<string, unknown>;
  };
}

// ============================================================================
// Action Types - What the agent decides to do
// ============================================================================

export type AgentAction =
  | { type: 'ask'; question: string; options?: string[]; inputDef?: InputDef }
  | { type: 'confirm'; summary: string; action: string }
  | { type: 'execute'; capability: CapabilityId; inputs: Record<string, unknown> }
  | { type: 'show-result'; result: unknown }
  | { type: 'error'; message: string };

// ============================================================================
// Request/Response for orchestrator
// ============================================================================

export interface OrchestrationRequest {
  message: string;              // User's input
  attachments?: {
    type: 'url' | 'image';
    value: string;
  }[];
  conversationState: ConversationState;
  agentContext: {
    id: string;
    name: string;
  };
}

export interface OrchestrationResponse {
  action: AgentAction;
  updatedState: ConversationState;
}
