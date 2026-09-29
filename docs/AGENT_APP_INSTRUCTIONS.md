# Agent App - Claude Code Instructions

## Overview

Build a Next.js app called `agent-app` that handles all client interaction and orchestration for the Syntellic content system. This app sits between clients and the rendering/scheduling systems.

## Project Location

Create at: `/Users/thomasmusial/Desktop/projects/agent-app`

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      AGENT APP                          │
│            (Client interaction + orchestration)         │
├─────────────────────────────────────────────────────────┤
│  INBOUND:              │  OUTBOUND:                     │
│  - Form submissions    │  - Call listing-graphics API   │
│  - Email parsing       │  - Call strategy-app API       │
│  - SMS via Twilio      │  - Send notifications          │
└─────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌──────────────────┐         ┌─────────────────────┐
│ listing-graphics │         │    strategy-app     │
│ (pure renderer)  │         │ (scheduling/posting)│
│                  │         │                     │
│ Exposes:         │         │ Exposes:            │
│ - /api/formats   │         │ - /api/campaigns    │
│ - /api/render    │         │ - /api/posts        │
└──────────────────┘         └─────────────────────┘
```

## Key Concept: Questions Live in listing-graphics

The `listing-graphics` app is the authority on carousel formats. Each format has:
1. Rendering logic (React components)
2. **Questions** - what info is needed to generate that carousel

Agent app **fetches** these questions and presents them to clients. This keeps:
- Rendering knowledge in listing-graphics
- Client interaction in agent-app

### Example: listing-graphics exposes formats

```typescript
// listing-graphics/src/lib/templates/carouselFormats.ts
export const CAROUSEL_FORMATS = {
  'buyer-objections': {
    id: 'buyer-objections',
    name: 'Buyer Guide',
    description: 'Answer common buyer questions',
    icon: 'HelpCircle',
    color: '#3b82f6',
    questions: [
      {
        id: 'topics',
        type: 'multi-select',
        label: 'What buyer questions do you want to address?',
        options: [
          'Conditional offers',
          'Deposit amounts',
          'Home inspections',
          'Closing costs',
          'Multiple offers',
          'Financing approval'
        ]
      },
      {
        id: 'custom',
        type: 'textarea',
        label: 'Any specific questions your clients ask?',
        placeholder: 'e.g., "How long does closing take in PEI?"'
      }
    ]
  },
  'market-pulse': {
    id: 'market-pulse',
    name: 'Market Stats',
    description: 'Local market updates and trends',
    icon: 'TrendingUp',
    color: '#10b981',
    questions: [
      {
        id: 'areas',
        type: 'multi-select',
        label: 'Which areas should we cover?',
        options: [] // Dynamic - fetched from agent's territory
      },
      {
        id: 'metrics',
        type: 'multi-select',
        label: 'What metrics matter most?',
        options: [
          'Average price',
          'Days on market',
          'Inventory levels',
          'Price trends',
          'Sales volume'
        ]
      }
    ]
  },
  // ... more formats
};

// listing-graphics/src/app/api/formats/route.ts
export async function GET() {
  return Response.json(CAROUSEL_FORMATS);
}
```

### Agent app fetches and presents

```typescript
// agent-app/src/app/submit/[agentId]/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function SubmitPage() {
  const [formats, setFormats] = useState(null);

  useEffect(() => {
    // Fetch format definitions from listing-graphics
    fetch('http://localhost:3003/api/formats')
      .then(res => res.json())
      .then(setFormats);
  }, []);

  // Render dynamic form based on fetched questions
  // ...
}
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: SQLite with Drizzle ORM (simple, file-based)
- **Email**: Resend or similar for inbound parsing
- **SMS**: Twilio (reference existing code in `/syntellic/services/interact/`)

## Data Models

### Message (inbound communications)

```typescript
interface Message {
  id: string;
  agentId: string;           // Which agent this is for
  channel: 'email' | 'sms' | 'form';
  from: string;              // Email address or phone
  content: string;           // Raw content
  parsedIntent?: string;     // AI-extracted intent
  parsedData?: object;       // AI-extracted structured data
  status: 'pending' | 'processed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
}
```

### Job (tasks to execute)

```typescript
interface Job {
  id: string;
  agentId: string;
  type: 'scrape_listing' | 'generate_carousel' | 'schedule_post' | 'send_review';
  input: object;             // Job-specific input data
  output?: object;           // Result after completion
  status: 'queued' | 'running' | 'completed' | 'failed';
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}
```

### AgentConfig (per-agent settings)

```typescript
interface AgentConfig {
  id: string;                // e.g., 'greg-caseley'
  name: string;
  email: string;
  phone?: string;
  territory: string[];       // Areas they cover
  listingsRepoPath?: string; // Path to their client repo
  strategyAccountId?: string;
  preferences: {
    carouselFormats: string[];    // Which formats they use
    postingDays: string[];        // e.g., ['tuesday', 'thursday']
    reviewRequired: boolean;      // Do they want to approve before posting?
  };
}
```

## Directory Structure

```
agent-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Dashboard
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   │
│   │   ├── submit/
│   │   │   └── [agentId]/
│   │   │       └── page.tsx            # Client-facing form
│   │   │
│   │   ├── review/
│   │   │   └── [jobId]/
│   │   │       └── page.tsx            # Review generated content
│   │   │
│   │   └── api/
│   │       ├── formats/
│   │       │   └── route.ts            # Proxy to listing-graphics
│   │       │
│   │       ├── inbound/
│   │       │   ├── email/
│   │       │   │   └── route.ts        # Webhook for inbound email
│   │       │   ├── sms/
│   │       │   │   └── route.ts        # Twilio webhook
│   │       │   └── form/
│   │       │       └── route.ts        # Form submission handler
│   │       │
│   │       ├── jobs/
│   │       │   ├── route.ts            # List/create jobs
│   │       │   ├── [jobId]/
│   │       │   │   └── route.ts        # Get/update job
│   │       │   └── process/
│   │       │       └── route.ts        # Trigger job processing
│   │       │
│   │       └── agents/
│   │           ├── route.ts            # List agents
│   │           └── [agentId]/
│   │               └── route.ts        # Get/update agent config
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts               # Drizzle schema
│   │   │   └── index.ts                # DB connection
│   │   │
│   │   ├── services/
│   │   │   ├── listing-graphics.ts     # API client for listing-graphics
│   │   │   ├── strategy.ts             # API client for strategy-app
│   │   │   ├── twilio.ts               # SMS handling
│   │   │   └── email.ts                # Email parsing
│   │   │
│   │   ├── jobs/
│   │   │   ├── processor.ts            # Job queue processor
│   │   │   ├── scrape-listing.ts       # Scrape MLS/Paragon
│   │   │   ├── generate-carousel.ts    # Call listing-graphics
│   │   │   └── schedule-post.ts        # Call strategy-app
│   │   │
│   │   └── ai/
│   │       └── parse-message.ts        # AI to extract intent from messages
│   │
│   └── components/
│       ├── DynamicForm.tsx             # Renders questions from formats
│       ├── JobStatus.tsx
│       └── ReviewCard.tsx
│
├── drizzle/
│   └── migrations/
│
├── package.json
├── tailwind.config.ts
├── drizzle.config.ts
└── .env.local
```

## Environment Variables

```env
# External services
LISTING_GRAPHICS_URL=http://localhost:3003
STRATEGY_APP_URL=http://localhost:3001

# Twilio
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1xxxxx

# Email (Resend)
RESEND_API_KEY=xxx
INBOUND_EMAIL_DOMAIN=agent.syntellic.com

# AI (for parsing messages)
ANTHROPIC_API_KEY=xxx

# Database
DATABASE_URL=file:./data/agent.db
```

## Key Flows to Implement

### 1. Form Submission Flow

```
Client visits /submit/greg-caseley
    ↓
Agent-app fetches formats from listing-graphics/api/formats
    ↓
Renders dynamic form based on format questions
    ↓
Client fills out, submits
    ↓
POST /api/inbound/form
    ↓
Creates Message record
    ↓
Creates Job: type='generate_carousel'
    ↓
Job processor calls listing-graphics/api/render
    ↓
If agent.preferences.reviewRequired:
    Creates Job: type='send_review' (emails agent preview link)
Else:
    Creates Job: type='schedule_post' (calls strategy-app)
```

### 2. Email Inbound Flow (Future)

```
Email arrives at greg@agent.syntellic.com
    ↓
Email provider webhook → POST /api/inbound/email
    ↓
Creates Message record
    ↓
AI parses intent: "new listing at 123 Main St"
    ↓
Creates Job: type='scrape_listing', input={address: '123 Main St'}
    ↓
Job processor scrapes Paragon/MLS
    ↓
Pushes to greg's listing repo
    ↓
Notifies greg via SMS
```

### 3. SMS Inbound Flow (Future)

```
SMS arrives via Twilio webhook
    ↓
POST /api/inbound/sms
    ↓
Creates Message record
    ↓
AI parses: "create a market stats carousel for Stratford"
    ↓
Creates Job accordingly
```

## First Implementation Priority

1. **Set up project** - Next.js, Tailwind, Drizzle
2. **Create /submit/[agentId] form** - Fetch formats from listing-graphics, render dynamic form
3. **Form submission handler** - Save to DB, create job
4. **Basic job processor** - Just logs for now, calls listing-graphics API
5. **Agent config** - Hardcode Greg's config initially

## API Contracts

### listing-graphics endpoints (to be created)

```
GET  /api/formats              → Returns all carousel format definitions with questions
POST /api/render/carousel      → Takes format + answers, returns image URL
```

### strategy-app endpoints (existing)

```
POST /api/campaigns/:id/posts  → Create scheduled post
GET  /api/accounts/:id         → Get account info
```

## Notes

- Start simple: hardcode Greg as the only agent
- SQLite is fine for now, can migrate to Postgres later
- The form should feel premium - match the proposal page styling
- Job processing can be synchronous initially, add queue later
- Reference existing Twilio code in `/syntellic/services/interact/`

## Commands to Start

```bash
cd /Users/thomasmusial/Desktop/projects
npx create-next-app@latest agent-app --typescript --tailwind --app --src-dir
cd agent-app
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```
