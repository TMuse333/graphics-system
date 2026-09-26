# Insights Capture System

> Reference doc for porting knowledge extraction from Interact into listing-graphics.

## Overview

Capture Greg's actual expertise via a simple web chat, then use that knowledge to create carousels that sound like him.

```
Greg chats → Answers questions → Knowledge extracted → Stored → Feeds carousel content
```

## Source: Interact App

Location: `/Users/thomasmusial/Desktop/syntellic/services/interact`

Greg has used this before. The relevant piece is the `/collect` page - a web-based chat that asks structured questions and extracts knowledge.

## What To Port

### Core Types

From `interact/src/types/index.ts`:

```typescript
type ExtractedCategory =
  | 'features'      // Services offered
  | 'origin'        // How/why started
  | 'problem'       // Problems solved
  | 'vision'        // Goals, values
  | 'differentiator'// What makes unique
  | 'process'       // How they work
  | 'stories'       // Client success stories
  | 'data'          // Numbers, metrics
  | 'general';      // Other

interface ExtractedItem {
  category: ExtractedCategory;
  question: string;    // "How do you handle price objections?"
  answer: string;      // Greg's actual answer
  confidence: number;  // 0-1 quality score
  tags: string[];      // ['pricing', 'objections', 'sellers']
}

interface FlowQuestion {
  id: string;
  question: string;
  category: string;
  required: boolean;
  minQualityScore: number;
  followUps: string[];  // Probing questions if answer is weak
}

interface Flow {
  _id?: string;
  name: string;           // "Market Knowledge"
  description: string;
  questions: FlowQuestion[];
}
```

### Files To Port

| Interact Source | listing-graphics Target | Purpose |
|-----------------|------------------------|---------|
| `types/index.ts` | `lib/insights/types.ts` | Core types |
| `lib/extraction/extractor.ts` | `lib/insights/extractor.ts` | LLM extraction |
| `app/collect/page.tsx` | `app/[agentId]/insights/page.tsx` | Chat UI |
| `app/api/conversations/` | `app/api/insights/` | API routes |

### Files To Skip

- `lib/twilio/` - SMS (not needed)
- `lib/vapi/` - Voice calls (not needed)
- `lib/channels/` - Multi-channel routing (not needed)
- `app/calls/`, `app/sms/` - Channel UIs (not needed)
- `app/schedule/` - Scheduling system (not needed)
- `app/outbound/` - Lead outreach (not needed)

## Simplified Architecture

```
┌─────────────────────────────────────────────────────────┐
│  /greg-caseley/insights                                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Select Flow                                          │
│     ┌─────────────────────────────────────┐             │
│     │ ▼ Market Knowledge (6 questions)    │             │
│     │   Client Objections (4 questions)   │             │
│     │   Process & Timeline (5 questions)  │             │
│     └─────────────────────────────────────┘             │
│                                                          │
│  2. Chat Interface                                       │
│     ┌─────────────────────────────────────┐             │
│     │ 🤖 What's your take on the current  │             │
│     │    PEI market?                       │             │
│     │                                      │             │
│     │                    ┌───────────────┐ │             │
│     │                    │ It's balanced │ │             │
│     │                    │ right now...  │ │             │
│     │                    └───────────────┘ │             │
│     │                                      │             │
│     │ 🤖 That's helpful. Can you give a   │             │
│     │    specific example?                 │             │
│     └─────────────────────────────────────┘             │
│                                                          │
│  3. Extraction (automatic)                               │
│     → "Greg believes the PEI market is balanced..."     │
│     → Tags: [market, pei, current-conditions]           │
│     → Category: data                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Sample Flows for Greg

### Flow 1: Market Knowledge
```typescript
{
  name: "Market Knowledge",
  questions: [
    { question: "What's your take on the current PEI market?", category: "data" },
    { question: "What trends are you seeing with buyers right now?", category: "data" },
    { question: "What about sellers - what are they experiencing?", category: "data" },
    { question: "Any predictions for the next 6 months?", category: "vision" },
    { question: "What neighborhoods are getting the most interest?", category: "data" },
    { question: "What's the biggest misconception people have about the market?", category: "differentiator" },
  ]
}
```

### Flow 2: Client Objections
```typescript
{
  name: "Client Objections",
  questions: [
    { question: "When someone says 'I'm not ready yet', what do you tell them?", category: "process" },
    { question: "How do you handle price objections from sellers?", category: "process" },
    { question: "What about buyers who are nervous about the market?", category: "process" },
    { question: "How do you respond when someone says they want to wait and see?", category: "process" },
  ]
}
```

### Flow 3: Process & Timeline
```typescript
{
  name: "Process & Timeline",
  questions: [
    { question: "Walk me through what happens from offer to keys.", category: "process" },
    { question: "What's the typical timeline for a sale in PEI?", category: "process" },
    { question: "What surprises first-time buyers most about the process?", category: "stories" },
    { question: "What do you do differently than other agents?", category: "differentiator" },
    { question: "What's a recent success story you're proud of?", category: "stories" },
  ]
}
```

## How Knowledge Feeds Carousels

Once extracted, Greg's knowledge becomes carousel content:

| Extracted Item | Carousel Format |
|----------------|-----------------|
| Market data/predictions | MarketPulseCarousel |
| Objection responses | BuyerObjectionsCarousel, MythVsFactCarousel |
| Process explanations | ProcessTimelineCarousel |
| Client stories | ClientQuestionsCarousel |
| Comparisons/takes | ThisOrThatCarousel |

Example:
```
Extracted: "When clients say 'I need to think about it', I ask what
specifically they're uncertain about. Usually it's fear of making a
wrong decision, so I walk them through the risks of waiting."

→ Becomes BuyerObjectionsCarousel item:
   Objection: "I need to think about it"
   Response: "What specifically are you uncertain about? Usually it's
   fear of making a wrong decision - let's walk through the risks of
   waiting vs acting."
```

## Storage Options

### Option A: MongoDB (like Interact)
- Full-featured, supports querying
- Requires MongoDB connection
- Good if scaling to multiple agents

### Option B: Local JSON/localStorage
- Simple, no external deps
- Good for single-agent MVP
- Can upgrade later

### Option C: Existing store.ts
- Already have agent/listing storage
- Add `insights` collection
- Consistent with current approach

**Recommendation:** Start with Option C (extend store.ts), upgrade to MongoDB when needed.

## Implementation Steps

### Phase 1: Foundation
1. [ ] Create `lib/insights/types.ts` with core types
2. [ ] Create `lib/insights/flows.ts` with Greg's question flows
3. [ ] Create `lib/insights/store.ts` for persistence

### Phase 2: Extraction
4. [ ] Port `lib/extraction/extractor.ts` (LLM extraction logic)
5. [ ] Create `/api/insights/extract` route
6. [ ] Test extraction with sample answers

### Phase 3: Chat UI
7. [ ] Create `/app/[agentId]/insights/page.tsx`
8. [ ] Flow selector component
9. [ ] Chat interface component
10. [ ] Progress/completion tracking

### Phase 4: Integration
11. [ ] Connect extracted knowledge to carousel content
12. [ ] Add "Insights" link to agent dashboard
13. [ ] Show knowledge coverage in proposal

## API Design

```typescript
// Start a new insights session
POST /api/insights/sessions
{ agentId: string, flowId: string }
→ { sessionId: string, firstQuestion: string }

// Submit an answer
POST /api/insights/sessions/[sessionId]/answer
{ content: string }
→ { extracted: ExtractedItem[], nextQuestion?: string, isComplete: boolean }

// Get all extracted insights for an agent
GET /api/insights/[agentId]
→ { items: ExtractedItem[], byCategory: Record<string, ExtractedItem[]> }
```

## Environment Variables

```env
# For LLM extraction (already have?)
OPENAI_API_KEY=sk-...

# Optional: external knowledge service
KNOWLEDGE_API_URL=https://...
KNOWLEDGE_API_KEY=...
```

## Files Reference (Interact)

```
/syntellic/services/interact/
├── src/
│   ├── types/index.ts           # ✓ Port types
│   ├── lib/
│   │   ├── extraction/
│   │   │   ├── extractor.ts     # ✓ Port extraction logic
│   │   │   └── schemas.ts       # ✓ Port schemas
│   │   ├── conversation/        # Partial - simplify
│   │   ├── knowledge.ts         # Optional - external sync
│   │   ├── llm/                 # ✓ Port LLM utils
│   │   └── mongodb/             # Skip or simplify
│   └── app/
│       ├── collect/page.tsx     # ✓ Port and adapt UI
│       └── api/conversations/   # ✓ Simplify for insights API
```

## Next Steps

1. Create this reference doc ✓
2. Add insights section to proposal (explain to Greg)
3. When ready to build: follow Implementation Steps above
