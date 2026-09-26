# Agent App Vision

> This listing-graphics app is evolving into a full "Agent App" - a single platform for managing real estate agent clients.

## Current State

```
listing-graphics/
├── Graphics Studio     ✓ Built
│   └── Create listing graphics (new, sold, open house, etc.)
├── Carousel Templates  ✓ Built
│   └── 7 carousel formats for social content
├── Proposal Pages      ✓ Built
│   └── /proposal/[agentId] - pitch page for new clients
└── PNG Export          ✓ Built
    └── Puppeteer-based rendering
```

## Planned Features

### 1. Insights Capture (Next)
See: `docs/INSIGHTS_CAPTURE.md`

- Capture agent expertise via chat
- Store knowledge for carousel content
- Make content sound like them, not templates

### 2. Website Management (Future)

Currently Greg's website lives at `/syntellic/clients/greg-caseley/`.

**Goal:** Manage client websites from this agent app.

```
/[agentId]/website/
├── Pages           - Edit page content
├── Blog            - Manage posts
├── Listings        - Sync from MLS or manual
├── Settings        - Domain, SEO, analytics
└── Deploy          - Push to Vercel/Netlify
```

**Key pieces to port from greg-caseley:**
- Page templates (home, about, listings, blog)
- Blog post system
- Listing display components
- Contact forms

**Architecture options:**

A. **Monorepo**: Client sites as packages in this repo
B. **Template repo**: Clone for each client, manage via API
C. **Headless CMS**: Content in this app, sites pull via API

### 3. Content Calendar (Future)

- Schedule carousels for auto-posting
- Track what's been posted
- See upcoming content

### 4. Analytics Dashboard (Future)

- Pull Instagram insights via Meta Graph API
- Show performance per post
- Identify what's working

### 5. Client Portal (Future)

- Greg logs in to see his content
- Request graphics
- Review scheduled posts
- See analytics

## File Structure Evolution

```
listing-graphics/ (rename to agent-app?)
├── src/
│   ├── app/
│   │   ├── [agentId]/
│   │   │   ├── studio/        # Graphics studio
│   │   │   ├── carousels/     # Carousel creation
│   │   │   ├── insights/      # Knowledge capture
│   │   │   ├── website/       # Website management
│   │   │   ├── calendar/      # Content calendar
│   │   │   └── analytics/     # Performance tracking
│   │   ├── proposal/          # Pitch pages
│   │   └── api/
│   ├── lib/
│   │   ├── templates/         # Graphics + carousel templates
│   │   ├── insights/          # Knowledge extraction
│   │   ├── website/           # Website components (from greg-caseley)
│   │   └── integrations/      # Instagram, MLS, etc.
│   └── components/
└── public/
    ├── agents/[agentId]/      # Agent assets
    └── images/pei/            # Shared PEI imagery
```

## Client Data Model

```typescript
interface AgentClient {
  id: string;                    // 'greg-caseley'
  name: string;                  // 'Greg Caseley'
  brokerage: string;             // 'RE/MAX Harbourside'

  // Contact
  phone: string;
  email: string;
  website: string;

  // Branding
  theme: Theme;
  headshotUrl: string;
  logoUrl: string;

  // Features enabled
  features: {
    graphics: boolean;           // Listing graphics
    carousels: boolean;          // Answer carousels
    website: boolean;            // Website management
    insights: boolean;           // Knowledge capture
    analytics: boolean;          // Instagram insights
  };

  // Subscription
  plan: 'graphics-only' | 'carousels' | 'full';

  // Integrations
  instagram?: {
    accountId: string;
    accessToken: string;
  };
  mls?: {
    provider: string;
    agentId: string;
  };
}
```

## Migration Path

### Phase 1: Current (Graphics + Carousels)
- Listing graphics studio
- Carousel templates
- Proposal pages
- Manual workflow

### Phase 2: Insights
- Port /collect from Interact
- Store knowledge per agent
- Feed into carousel content

### Phase 3: Website
- Port templates from greg-caseley
- Multi-tenant website management
- Deploy via Vercel API

### Phase 4: Integrations
- Instagram API for analytics
- MLS integration for listings
- Calendly for scheduling

## PEI Images

Copied to `/public/images/pei/`:

```
pei/
├── brand/
│   ├── greg-headshot.jpg
│   └── remax-harbourside-logo.png
├── properties/
│   ├── 11-thompson-point-road-01.png
│   ├── 2-laura-lane-01.png
│   ├── 2-laura-lane-02.png
│   ├── 71-morrison-lane-01.png
│   ├── 71-morrison-lane-02.png
│   ├── 71-morrison-lane-03.png
│   ├── lot1-main.png
│   ├── lot12-main.png
│   ├── lot13-main.png
│   └── ...
└── scenery/
    ├── property-hero.jpg
    ├── travel-promo.jpg
    └── listing-promo.jpg
```

Use in carousels:
```typescript
// Property images
src: '/images/pei/properties/71-morrison-lane-01.png'

// Scenery/hero images
src: '/images/pei/scenery/property-hero.jpg'
```
