# Content Bot Concept

> Reference doc for future implementation. Based on Syntellic Converse app architecture.

## Overview

A chatbot that sits on the listing-graphics website to:
1. **Match visitors to relevant carousels** based on their situation
2. **Collect real questions** for future carousel topics
3. **Book meetings** with Greg when engagement is high

## Source: Converse App

Location: `/Users/thomasmusial/Desktop/syntellic/products/converse`

### Key Components to Reuse

| Component | Location | Purpose |
|-----------|----------|---------|
| Node-based flows | `lib/nodes/types.ts` | Conversation building blocks |
| Voss tactics | `lib/tactics/definitions.ts` | Mirror, label, calibrated questions |
| State management | `lib/state/` | Track conversation progress |
| Intel integration | `lib/intel/` | LLM orchestration |
| MongoDB persistence | `lib/mongodb/` | Store conversations |

### Voss Tactics (Chris Voss - Never Split the Difference)

```typescript
// From lib/tactics/definitions.ts
mirror: "Repeat key words as question, ask to expand. Never offer options."
label: "Validate emotion with 'It sounds like...' without agreeing/disagreeing"
calibrated: "Ask 'How' or 'What' questions that give control. Never 'Why'."
confirm: "Summarize need as label, offer to look up info"
```

## Proposed Architecture

### Three Functions

1. **Content Retriever**
   - Match visitor needs → serve relevant carousel
   - Query by: audience (buyer/seller), topic, location, stage

2. **Question Receiver**
   - Collect questions visitors actually ask
   - Tag with topic, stage, frequency
   - Surface content gaps → future carousel topics

3. **Meeting Setter**
   - After 3+ turns or high-intent signals
   - "Want to talk through this with Greg?"
   - Calendly integration

### Flow Structure

```
ENTRY (button)
  "What brings you here?"
  [Buying] [Selling] [Just Looking] [Have a Question]
    ↓
DISCOVERY (voss/mirror)
  Extract: situation, timeline, location interest
    ↓
CONTENT MATCH (new node type)
  Query carousel registry
  "Here's something that might help..."
  [Show carousel preview]
    ↓
QUESTION CAPTURE (specifics)
  "What else are you wondering about?"
  Save to questions bank
    ↓
CTA (conditional)
  If engaged → "Book a call with Greg?"
```

### Data Models

```typescript
// Carousel content registry
interface CarouselContent {
  id: string;                    // 'market-pulse-q3-2026'
  templateId: string;            // 'MarketPulseCarousel'
  topic: string;                 // 'PEI Q3 Market Snapshot'
  audience: 'buyers' | 'sellers' | 'both';
  stage: 'research' | 'active' | 'ready';
  keywords: string[];            // ['market', 'prices', 'stats']
  embedUrl: string;
  previewFrameIndex: number;
}

// Question bank
interface VisitorQuestion {
  id: string;
  question: string;
  source: 'chatbot' | 'dm' | 'open-house';
  askedAt: Date;
  frequency: number;
  resolvedBy?: string;           // CarouselContent.id if answered
  suggestedTopic?: string;
  tags: string[];
}

// Visitor profile (built during conversation)
interface VisitorProfile {
  sessionId: string;
  type: 'buyer' | 'seller' | 'investor' | 'unknown';
  stage: 'researching' | 'planning' | 'active';
  interests: string[];
  questionsAsked: string[];
  carouselsViewed: string[];
  score: number;                 // Lead quality 0-100
  meetingBooked: boolean;
}
```

## Implementation Options

### Option A: Fork Converse
- Copy `/products/converse` → `/products/graphics-bot`
- Replace flow nodes with content-focused ones
- Keep Voss tactics for discovery
- Add carousel matching logic

### Option B: Build Into listing-graphics
- Add `/src/app/api/bot/route.ts`
- Lightweight, no full node system
- Use `carouselFormats.ts` as registry
- Store questions in MongoDB

### Option C: Converse as Shared Service
- Deploy Converse at `bot.syntellic.com`
- Configure Greg's account via templates
- Embed widget in graphics app
- Questions sync via Intel

## Quick Win: Question Collector

Minimal version to test value:

1. "Got a question?" floating button on site
2. Modal with text input
3. Save to questions collection
4. Weekly review → turn into carousels
5. No LLM needed initially

## Files to Reference

```
/syntellic/products/converse/
├── lib/
│   ├── chat/types.ts          # Request/response types
│   ├── nodes/types.ts         # Flow architecture
│   ├── tactics/definitions.ts # Voss tactics
│   ├── store.ts               # State management
│   └── mongodb/               # Persistence
├── app/
│   ├── api/chat/route.ts      # Chat endpoint
│   └── widget/[accountId]/    # Embeddable widget
└── INTERACT_FOR_CONVERSE.md   # Knowledge extraction spec
```

## Next Steps (When Ready)

1. [ ] Decide implementation option (A/B/C)
2. [ ] Build carousel content registry from existing templates
3. [ ] Create question collection endpoint
4. [ ] Design matching algorithm (keywords → carousels)
5. [ ] Add Calendly integration for CTA
6. [ ] Deploy widget to proposal page
7. [ ] Track: questions collected, carousels served, meetings booked
