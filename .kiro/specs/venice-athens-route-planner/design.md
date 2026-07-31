# Design: Venice-to-Athens Route Planner

## Overview

A split-screen React app replacing `src/App.tsx`. The left panel is an illustrated SVG route map with 14+ labeled stops and animated day-by-day highlighting. The right panel is a chat surface where the AI teammate **Ember** proactively raises route decisions using the **Decide** humorphic pattern. All AI behavior is mocked with `setTimeout` and hardcoded sequences — no backend, no API keys.

---

## Architecture

```
src/
├── App.tsx                          ← split-screen shell, replaced entirely
├── data/
│   └── mock-itinerary.ts            ← new: 14-day data, stops, decisions
└── components/
    ├── ui/                          ← existing shadcn kit (unchanged)
    └── route-planner/               ← new feature components
        ├── RouteMap.tsx             ← SVG map panel
        ├── RouteStop.tsx            ← individual stop dot + label
        ├── DayNav.tsx               ← day selector strip
        ├── EmberChat.tsx            ← chat panel shell
        ├── DecisionCard.tsx         ← option card inside a bubble
        └── TypingIndicator.tsx      ← three-dot animation
```

### Data Flow

```
mock-itinerary.ts
      │
      ▼
App.tsx  (activeDay, selectedOptions state)
   │                │
   ▼                ▼
RouteMap        EmberChat
(receives        (receives activeDay,
 activeDay,       onDayAdvance callback,
 stops data)      itinerary decisions)
```

State lives in `App.tsx` and is passed down as props. No external state library is needed for this scope.

---

## Components

### `App.tsx` (replaced)

Top-level shell. Owns:
- `activeDay: number` — 1-indexed current day (1–14)
- `selectedOptions: Record<string, number>` — maps `decisionId → chosen option index`
- `chatMessages: ChatMessage[]` — the live chat thread

Renders a `<div className="flex h-dvh">` with two children: `<RouteMap>` (left, `w-[55%]`) and `<EmberChat>` (right, `flex-1`). On mobile (`md:` breakpoint), switches to `flex-col`.

---

### `src/data/mock-itinerary.ts`

Single source of truth. Exports:

```typescript
export interface Stop {
  id: string;
  name: string;
  day: number;               // which day this stop belongs to
  x: number;                 // SVG coordinate (0–500 viewBox)
  y: number;                 // SVG coordinate (0–600 viewBox)
  country: string;
  description: string;
  driveFromPrev: string;     // e.g. "~2.5 hrs"
}

export interface DecisionOption {
  label: string;
  consequence: string;       // short outcome description
}

export interface DecisionPoint {
  id: string;
  day: number;
  question: string;
  options: DecisionOption[];
  recommendedIndex: number;
}

export interface DayEntry {
  day: number;
  title: string;             // e.g. "Day 3 — Trieste to Split"
  stops: Stop[];
  decision?: DecisionPoint;
}

export interface Itinerary {
  title: string;
  totalDays: number;
  days: DayEntry[];
}

export const itinerary: Itinerary = { ... };  // 14 days, 14+ stops
```

The 14 stops span: Venice → Trieste → Ljubljana → Zagreb → Split → Dubrovnik → Kotor → Tirana → Ohrid → Thessaloniki → Meteora → Delphi → Nafplio → Athens.

SVG coordinates map onto a 500×600 viewBox. The route runs roughly top-left (Venice ~x:80,y:60) to bottom-right (Athens ~x:340,y:530), curving down the Adriatic coast then turning east.

---

### `RouteMap.tsx`

```typescript
interface RouteMapProps {
  days: DayEntry[];
  activeDay: number;
  onStopClick?: (stop: Stop) => void;
}
```

Renders an `<svg viewBox="0 0 500 600" className="w-full h-full">` containing:

1. **Background**: A subtle land-mass polygon (hand-tuned path) in `--secondary` fill.
2. **Route polyline**: `<polyline points={allStops.map(s => `${s.x},${s.y}`).join(' ')} />` — stroked with `--border`, strokeWidth 2.
3. **Active segment**: A second polyline over just the active day's stops, stroked with `--fuego-500`, animated with Framer Motion `pathLength` spring.
4. **Stop dots**: `<RouteStop>` for each stop.
5. **Day label**: A floating text element near the active stops showing the day title.

Uses Framer Motion `<motion.polyline>` with `initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}` keyed by `activeDay`.

---

### `RouteStop.tsx`

```typescript
interface RouteStopProps {
  stop: Stop;
  isActive: boolean;      // belongs to active day
  isCurrent: boolean;     // first stop of active day (pulse ring)
  onClick?: () => void;
}
```

Renders an SVG `<g>` at `(stop.x, stop.y)`:
- Pulse ring: `<motion.circle r={12} animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 2 }} />` — only when `isCurrent`.
- Main dot: `<circle r={5} fill={isActive ? "var(--fuego-500)" : "var(--muted-foreground)"}/>`.
- Label: `<text>` offset by +8px, font-size 10, color `--foreground` when active, `--muted-foreground` otherwise.

---

### `DayNav.tsx`

A horizontal scrollable strip of 14 day pills. Each pill shows the day number and a tiny country flag emoji. Active day gets a fuego-orange underline. Clicking a pill calls `onDayChange(day)` in App.tsx.

```typescript
interface DayNavProps {
  days: DayEntry[];
  activeDay: number;
  onDayChange: (day: number) => void;
}
```

---

### `EmberChat.tsx`

The right-panel chat surface.

```typescript
interface EmberChatProps {
  activeDay: number;
  itinerary: Itinerary;
  selectedOptions: Record<string, number>;
  onOptionSelect: (decisionId: string, optionIndex: number) => void;
  onDayAdvance: () => void;
}
```

Internal state:
- `messages: ChatMessage[]` — rendered thread
- `isTyping: boolean` — shows `<TypingIndicator>`
- `inputValue: string` — controlled text input

**Scripted message injection** — `useEffect` keyed on `activeDay`:

```typescript
useEffect(() => {
  // 1. Show typing indicator immediately
  setIsTyping(true);
  // 2. After 600ms, inject day briefing message
  const t1 = setTimeout(() => {
    setIsTyping(false);
    appendMessage(emberBriefing(activeDay));
  }, 600);
  // 3. After 1400ms, inject decision question (if day has one)
  const t2 = setTimeout(() => {
    const decision = getDecision(activeDay);
    if (decision) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        appendMessage(emberDecision(decision));
      }, 800);
    }
  }, 1400);
  return () => { clearTimeout(t1); clearTimeout(t2); };
}, [activeDay]);
```

Uses `MessageScrollerProvider > MessageScroller > MessageScrollerViewport > MessageScrollerContent` wrapping `MessageScrollerItem` elements. Each item renders a `<Message>` with `<MessageAvatar>`, `<MessageContent>`, and `<Bubble>`.

Free-text input: `<Textarea>` from shadcn + `<Button>` send. On submit, appends user message then triggers a canned Ember reply after 800ms.

---

### `DecisionCard.tsx`

Rendered inside an Ember `<Bubble>` when a `DecisionPoint` is active.

```typescript
interface DecisionCardProps {
  decision: DecisionPoint;
  selectedIndex?: number;
  onSelect: (index: number) => void;
}
```

Renders the question as a `<p>`, then maps `decision.options` to `<button>` cards. Each card shows the option label and consequence. The recommended option gets a small "Ember suggests" badge. When `selectedIndex` is defined, all buttons are disabled and the chosen option is highlighted with a fuego-orange border + checkmark.

---

### `TypingIndicator.tsx`

Three dots animated with Framer Motion staggered bounce:

```tsx
const dots = [0, 1, 2];
// Each dot: motion.span with y: [0, -4, 0], stagger 0.15s, repeat Infinity
```

Rendered inside a `<Bubble variant="muted">` with Ember's avatar.

---

## Scripted Conversation Sequences

Each day has a hardcoded briefing string and an optional decision. A lookup map in `EmberChat.tsx`:

```typescript
const EMBER_BRIEFINGS: Record<number, string> = {
  1: "Good morning! We're leaving Venice today — the Ponte della Libertà is gorgeous at sunrise. Drive to Trieste is only 2 hours, so we have time for a coffee in Piazza Unità. Ready to roll?",
  2: "Trieste to Ljubljana — 1.5 hours through Slovenia. Ljubljana's old town is compact and walkable. I noticed the weather looks clear all day.",
  // ... all 14 days
};
```

Canned free-text replies cycle through a fixed pool of 6 responses using a rotating index, simulating a responsive but mocked AI.

---

## State Transitions (Decide Pattern)

The core humorphic loop for the Decide pattern:

```
App loads
  └→ Day 1 active
       └→ Ember opens with day briefing (auto, 600ms)
            └→ Ember raises decision question (auto, 1400ms)
                 └→ User picks option A or B
                      └→ Ember acknowledges + frames consequence
                           └→ User types message OR advances day
                                └→ Day 2 active → repeat
```

Each step is driven by `setTimeout` with no real AI — the UX IS the deliverable.

---

## SVG Map Coordinate Reference

ViewBox: `0 0 500 600`. Approximate stop positions:

| Stop | Day | x | y |
|------|-----|---|---|
| Venice | 1 | 82 | 62 |
| Trieste | 2 | 110 | 85 |
| Ljubljana | 3 | 108 | 70 |
| Zagreb | 4 | 140 | 95 |
| Plitvice | 5 | 148 | 120 |
| Split | 6 | 158 | 165 |
| Hvar | 7 | 154 | 185 |
| Dubrovnik | 8 | 172 | 218 |
| Kotor | 9 | 182 | 235 |
| Shkodër | 10 | 190 | 265 |
| Ohrid | 11 | 210 | 285 |
| Thessaloniki | 12 | 248 | 298 |
| Meteora | 13 | 262 | 340 |
| Delphi | 14 | 276 | 385 |
| Athens | 14 | 300 | 430 |

The polyline connecting these produces a route that sweeps down the eastern Adriatic coast, cuts east through the Balkans, then descends into Greece.

---

## Error Handling

- If `activeDay` is out of range (< 1 or > 14), clamp to valid bounds before rendering.
- If a `DecisionPoint` option index is out of range, log a warning and treat as no selection.
- If `setTimeout` callbacks fire after component unmount, the cleanup functions in `useEffect` return clears them.
- The SVG gracefully degrades if a stop's coordinates are missing by skipping that stop with a `console.warn`.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Stop count integrity

*For any* rendered SVG map, the number of stop marker elements (circles) SHALL equal the total number of stops defined in the itinerary data.

**Validates: Requirements 1.1**

### Property 2: Active day stop highlighting

*For any* active day value d (1–14), the set of highlighted stop markers SHALL be exactly the stops whose `day` field equals d, and no other stops SHALL be highlighted.

**Validates: Requirements 1.3**

### Property 3: Itinerary stop field completeness

*For any* stop in the itinerary data, the stop SHALL have defined, non-empty values for `id`, `name`, `day`, `x`, `y`, `country`, `description`, and `driveFromPrev`.

**Validates: Requirements 2.2**

### Property 4: Decision option completeness

*For any* decision point in the itinerary, all options SHALL have non-empty `label` and `consequence` fields, and `recommendedIndex` SHALL be a valid index into the `options` array.

**Validates: Requirements 2.3**

### Property 5: Decision selection is exclusive

*For any* `DecisionPoint` rendered with a `selectedIndex`, exactly one option SHALL be visually marked as chosen and all option buttons SHALL be disabled.

**Validates: Requirements 3.5**
