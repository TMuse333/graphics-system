# Motion Templates

> **Status**: Designed, not yet implemented. Reference config exists and is validated against a working video.

## Concept

Animated vertical graphics (Instagram reels/stories) as declarative config over existing listing data. Not bespoke animations — short motion sequences driven by the same `Agent`, `Listing`, and `ContentData` props the static templates already use.

**Output**: 1080×1920, ~10s, looping, exported as video.

**Four beats**: Property establishes → Date/time → Address/specs → Agent contact.

## Motion Vocabulary

The entire system uses four primitives plus two globals:

| Primitive | Args | Effect |
|-----------|------|--------|
| `enter` | `at`, `dist` | Fade in + translateY |
| `draw` | `from`, `to` | Scale width 0→1 (rules, bars) |
| `leave` | `at` | Fade out |
| `riseOut` | `at` | translateY out |

**Globals**:
- Continuous slow push-in on the hero across full duration
- Black veil at loop seam so the wrap is invisible

## Layout Slots

Fixed positions — config declares slot, not coordinates:

```
eyebrow    y=1004   (gold text + rule, on opaque ink plate)
body       y=1136   (headline, chips)
band       y=986    (agent contact, full width)
tiles      right-aligned x≤920, y=300/580
```

## Config Structure

```json
{
  "size": [1080, 1920],
  "safeZone": "reels",
  "scenes": [
    {"name": "Arrive", "dur": 2.6},
    {"name": "When", "dur": 2.6},
    {"name": "Where", "dur": 2.6},
    {"name": "Close", "dur": 2.8}
  ],
  "blocks": [
    {
      "scene": "When",
      "slot": "body",
      "type": "headline",
      "lines": ["Saturday", "Sept 19"],
      "enter": {"at": 0.18, "dist": 54}
    }
  ]
}
```

Cue offsets are **relative to scene start**, not absolute seconds — retiming a scene doesn't break downstream beats.

## Safe Zone Validation

This is the key innovation. Platform safe zones:

| Platform | Max Right | Max Bottom | Notes |
|----------|-----------|------------|-------|
| Reels | 940px | 1500px | Action column x>940, caption band y>1620 |
| Stories | 1010px | 1670px | No action column |

**The problem**: Entrance animations violate zones mid-transition even when settled positions are legal. A band rising from 120px below dips into the caption zone on the way up.

**The solution**: Sweep the timeline at 0.05s intervals. For every block at every sample, with entrance/exit transforms applied, assert bounds stay within safe zone. Reject configs that violate at any frame.

```typescript
function validateConfig(config: MotionConfig): ValidationResult {
  for (let t = 0; t <= config.authoredTotal; t += 0.05) {
    for (const block of config.blocks) {
      const bounds = computeBoundsAtTime(block, t, config);
      if (bounds.right > safeZone.maxRight || bounds.bottom > safeZone.maxBottom) {
        return { valid: false, violation: { block, t, bounds } };
      }
    }
  }
  return { valid: true };
}
```

## Asset Rules

1. **Transparent-cutout portraits**: Must render as CSS `background-image`, not `<img>` — identical styles on `<img>` failed to composite
2. **Cutouts need light fill**: Dark-suited subject on near-black band reads as empty box

## Implementation Plan

When ready to build:

1. **Types**: `MotionConfig`, `MotionBlock`, `MotionPrimitive`, `SafeZone`
2. **Validator**: The sweep function (most valuable piece)
3. **Renderer**: React component taking config + clock position → frame
4. **Player**: Wraps renderer with `requestAnimationFrame` clock
5. **Registry**: Add `kind: 'motion'` to template registry

**Renderer choice**: Plain interpolation over single clock, not Framer Motion. Timing is fully declarative — no need for imperative orchestration. Smaller bundle, easier server-side export.

**Export**: Browser-based (MediaRecorder + canvas) for previews. Server-side (FFmpeg/Puppeteer) for bulk generation.

## Reference Files

- **Working config**: `/Users/thomasmusial/Downloads/open-house-reel.config.json`
- **Working video**: Google Drive (embedded in pitch page)
- **Video file**: `/Users/thomasmusial/Downloads/71 Morrison Lane - Open House Reel.mp4`

## Registry Entry (Future)

```typescript
'open-house-reel': {
  type: 'open-house-reel',
  name: 'Open House (Reel)',
  kind: 'motion',
  category: 'social',
  size: [1080, 1920],
  config: openHouseReelConfig,
  blurb: 'Vertical reel: property → date/time → address/specs → agent. 10.6s loop.',
}
```
