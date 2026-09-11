# System Analysis: Unified Content Platform

## Executive Summary

You have three scattered but valuable codebases that can be unified into a powerful demo:

1. **listing-graphics** - Graphics generation + client portal (current)
2. **syntellic/services/intel** - Calendar, scheduling, content planning
3. **video-system** - Meta API integration, video automation

**MVP for Demo**: Bulk graphic generation + calendar view + fake analytics = "scalable, trackable system"

---

## Existing Code Inventory

### 1. listing-graphics (Current Project)
**Path**: `~/Desktop/projects/listing-graphics`

| Feature | Status | Key Files |
|---------|--------|-----------|
| Template registry | 4 templates, ~10 variants | `src/lib/templates/index.ts` |
| Agent management | CRUD | `src/lib/store.ts` |
| Client portal | Intake + dashboard | `src/app/portal/[agentId]/page.tsx` |
| Package tracking | Working | `src/lib/types.ts` |
| PNG export | html2canvas | `src/lib/downloadPng.ts` |
| History seeding | Greg's 18 graphics | `public/history/` |

**Limitation**: localStorage only - no multi-user, no real database

---

### 2. syntellic/services/intel (Calendar + Scheduling)
**Path**: `~/Desktop/syntellic/services/intel`

#### Master Calendar
**File**: `src/app/admin/master-calendar/page.tsx`

```typescript
// Existing features:
- Month/week view toggle
- Drag-and-drop scheduling
- Filter by account/status/content type
- Create item modal
- AI "Generate Ideas" modal
- Day detail panel
```

#### Calendar Components
**Path**: `src/components/calendar/`

| Component | What it does |
|-----------|--------------|
| `MonthGrid.tsx` | Full month view with drag-drop |
| `WeekGrid.tsx` | Week view |
| `CalendarStats.tsx` | Stats summary |
| `CreateItemModal.tsx` | Add new content item |
| `ItemDetailModal.tsx` | View/edit item |
| `DayDetailPanel.tsx` | Sidebar for day details |

#### Calendar Types
**File**: `src/types/calendar.ts`

```typescript
interface CalendarEvent {
  _id?: string;
  accountId: string;
  timestamp: Date;
  eventType: string;       // 'graphic', 'video', 'post'
  source: string;
  category: 'activity' | 'conversion' | 'milestone';
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

interface CalendarDay {
  date: string;
  accountId: string;
  content: {
    scheduled: ScheduledItem[];
    published: ScheduledItem[];
    inProgress: ScheduledItem[];
  };
  stats: { totalEvents, conversions, activities, milestones };
}
```

#### Content Calendar API
**Path**: `src/app/api/content-calendar/`

- `route.ts` - GET/POST content items
- `[id]/route.ts` - Update/delete items
- `generate-ideas/route.ts` - AI-powered content suggestions
- `complete/route.ts` - Mark items complete
- `stats/route.ts` - Calendar stats

**Database**: MongoDB via `src/lib/mongodb/contentCalendar.ts`

---

### 3. video-system (Meta API + Video Automation)
**Path**: `~/Desktop/video-system`

#### Meta API Integration
**Path**: `src/app/api/meta/`

| Endpoint | Function |
|----------|----------|
| `insights/route.ts` | Fetch Instagram post insights |
| `posts/route.ts` | Get posts list |
| `upload/route.ts` | Upload to Instagram |
| `status/route.ts` | Check connection status |

#### Key Types
**File**: `src/lib/meta/types.ts`

```typescript
interface InstagramPost {
  instagramId: string;
  caption?: string;
  mediaType: "VIDEO" | "IMAGE" | "CAROUSEL_ALBUM";
  mediaUrl: string;
  permalink: string;
  timestamp: string;
  likes?: number;
  comments?: number;
}

interface InstagramInsights {
  postId: string;
  impressions: number;
  reach: number;
  engagement: number;
  videoViews?: number;
}
```

#### Existing Meta API Code (Working)
**File**: `src/app/api/meta/insights/route.ts`

```typescript
// Already fetches from real Instagram API:
- Paginated post fetching
- Date range filtering
- Per-post insights (impressions, reach, engagement, video_views)
- Error handling for failed insight fetches
```

**Env vars needed**:
```env
INSTAGRAM_ID=
INSTAGRAM_ACCESS_TOKEN=
```

---

## MVP Demo Proposal

### Goal
Show the marketing director: "I can generate 20-30 graphics in minutes, schedule them on a calendar, and track performance."

### Three Screens to Build/Integrate

#### Screen 1: Bulk Generation Wizard
**New feature in listing-graphics**

```
┌─────────────────────────────────────────────────────────┐
│  BULK GENERATE                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Agents Selected: Greg Caseley, [Dad], Agent 3, Agent 4 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ LISTINGS TO PROCESS (12)                        │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ ☑ 1104 New Orleans Rd    → Just Listed, Open Ho │   │
│  │ ☑ 11 Thompson Road       → Just Listed          │   │
│  │ ☑ 71 Morrison Lane       → Price Drop, Open Hou │   │
│  │ ...                                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Templates: ☑ Social Square  ☑ Open House  ☐ Flier    │
│  Variants:  ☑ Just Listed ☑ Open House ☑ Price Drop   │
│                                                         │
│  ═══════════════════════════════════════════════════   │
│  Will generate: 28 graphics                             │
│                                                         │
│  [ Generate All ]                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Implementation**:
1. Multi-select agents/listings
2. Template + variant selection
3. Preview count before generation
4. Batch create graphics
5. Progress indicator

#### Screen 2: Content Calendar
**Port from intel service (simplified)**

```
┌─────────────────────────────────────────────────────────┐
│  CONTENT CALENDAR                    September 2026     │
├─────────────────────────────────────────────────────────┤
│  Sun    Mon    Tue    Wed    Thu    Fri    Sat         │
│  ─────────────────────────────────────────────────────  │
│   1      2      3      4      5      6      7          │
│         🟢     🟢            🟡                         │
│         Greg   Greg          Greg                       │
│                                                         │
│   8      9     10     11     12     13     14          │
│  🟢     🟢     🟡     🟢            🟢                  │
│  Dad    Greg   Dad    Greg          Dad                 │
│                                                         │
└─────────────────────────────────────────────────────────┘

🟢 = scheduled    🟡 = in progress    🔵 = posted
```

**Implementation**:
- Port `MonthGrid.tsx` from intel
- Adapt to work with graphics (not generic content items)
- Store scheduled date on Graphic type
- Show all agents color-coded

#### Screen 3: Performance Dashboard (Mockup)
**Fake data for demo, real API hooks for later**

```
┌─────────────────────────────────────────────────────────┐
│  PERFORMANCE                         Last 30 Days       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TOTAL GRAPHICS PUBLISHED    TOTAL REACH    ENGAGEMENT │
│        47                      12.4K           3.2%    │
│       ↑12%                     ↑23%           ↑0.4%   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  TOP PERFORMING POSTS                                   │
│  ┌────────────────────────────────────────────────────┐│
│  │ 🖼️ 71 Morrison - Just Listed     2.1K reach  4.1% ││
│  │ 🖼️ 1104 New Orleans - Open House 1.8K reach  3.8% ││
│  │ 🖼️ Salt Wind Way - New Listing   1.4K reach  2.9% ││
│  └────────────────────────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Implementation**:
- Seed fake performance data for demo
- Design for future Meta API integration
- Show the potential tracking capability

---

## Files to Reuse

### From intel (calendar)
```
src/components/calendar/MonthGrid.tsx     → Port as CalendarMonth.tsx
src/components/calendar/utils.ts          → Copy date utilities
src/components/calendar/constants.ts      → Adapt content types
src/types/calendar.ts                     → Simplify for graphics
```

### From video-system (meta api)
```
src/lib/meta/types.ts                     → Copy types
src/app/api/meta/insights/route.ts        → Reference for later
docs/META_API.md                          → API documentation
```

---

## Data Model Changes

### Add to Graphic type
```typescript
interface Graphic {
  // existing fields...

  // New: Scheduling
  scheduledFor?: string;        // ISO date
  publishedAt?: string;         // When actually posted
  platform?: 'instagram' | 'facebook';

  // New: Performance (for future)
  instagramPostId?: string;
  metrics?: {
    impressions?: number;
    reach?: number;
    engagement?: number;
  };
}
```

### Add ScheduledItem for calendar
```typescript
interface ScheduledItem {
  _id: string;
  type: 'graphic' | 'video';
  graphicId?: string;
  videoId?: string;
  agentId: string;
  title: string;
  scheduledFor: string;
  status: 'draft' | 'scheduled' | 'published';
  platform: 'instagram' | 'facebook';
}
```

---

## Implementation Priority

### Phase 1: Demo MVP (Focus Here)
1. **Bulk generation wizard** - Show scale
2. **Calendar view** - Show scheduling
3. **Fake analytics** - Show tracking potential

### Phase 2: Production (After Demo Closes)
1. Supabase for real database
2. Auth for multi-user
3. Real Meta API integration
4. File hosting (Cloudinary/S3)

### Phase 3: Full Integration
1. Port full intel calendar
2. Connect video-system
3. Unified dashboard
4. Real analytics

---

## Demo Script

1. **Open listing-graphics** → "Here's the system I built"
2. **Show Greg's history** → "18 graphics delivered over 5 months"
3. **Add 3 fake agents** → "Now let's scale this"
4. **Bulk generate 25 graphics** → "One click, all agents, all listings"
5. **Open calendar** → "Everything scheduled and tracked"
6. **Open analytics** → "And I can measure what's working"
7. **Close**: "This is what I want to build for RE/MAX Nova"

---

## Long-Term Vision: "Intel for Content"

The syntellic/intel app was meant to be the "all-seeing mind" of a business. For this use case:

```
                    ┌─────────────────┐
                    │   INTEL CORE    │
                    │  (Orchestrator) │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   GRAPHICS    │   │    VIDEO      │   │   ANALYTICS   │
│   SERVICE     │   │   SERVICE     │   │   SERVICE     │
├───────────────┤   ├───────────────┤   ├───────────────┤
│ - Templates   │   │ - AE Automati │   │ - Meta API    │
│ - Generation  │   │ - Captions    │   │ - GA4         │
│ - Export      │   │ - Publishing  │   │ - Reporting   │
└───────────────┘   └───────────────┘   └───────────────┘
        │                    │                    │
        └────────────────────┴────────────────────┘
                             │
                    ┌────────┴────────┐
                    │    CALENDAR     │
                    │  (Master View)  │
                    │                 │
                    │ Graphics + Video│
                    │ All Agents      │
                    │ All Platforms   │
                    └─────────────────┘
```

But for now: **Focus on the demo.** Bulk generation + calendar + fake analytics.

---

## Environment Variables Needed

### For Demo (minimal)
```env
# None - all localStorage
```

### For Production (later)
```env
# Database
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Meta API
INSTAGRAM_ID=
INSTAGRAM_ACCESS_TOKEN=

# File Storage
CLOUDINARY_URL=
```

---

## Next Step

Build the **Bulk Generation Wizard** first. It's the most impressive demo feature:
- Shows scale capability
- Proves system thinking
- Visual impact (20+ graphics appearing)
- Sets up calendar population
