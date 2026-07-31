# Design: Venice-to-Athens Drive Planner

## Overview

A single-page React app replacing `src/App.tsx`. The component tree is split into two main panels controlled by a shared `currentDay` state at the root. The left panel renders a fully inline SVG route map; the right panel is an Ember chat surface using the shadcn chat kit. All AI responses are simulated with `setTimeout` and hardcoded sequences from `src/data/mock-itinerary.ts`.

No backend, no external API, no router — one screen, one state slice, all mock.

---

## Component Architecture

```
App (root)
├── AppHeader           — full-width header bar, trip name, Ember status
├── MapPanel            — left 55%, SVG route map
│   ├── RouteMap        — the inline SVG with stops, polyline, decorative fills
│   │   ├── <CountryFills />   — decorative SVG paths (Italy, Slovenia, Croatia…)
│   │   ├── <RouteLine />      — polyline through all stop coordinates
│   │   └── <StopMarker />     — per-stop: circle, label, active/visited/future style
│   └── DayControls     — Prev/Next buttons + "Day N of 14 · City, Country" label
└── ChatPanel           — right 45%, Ember conversation
    ├── MessageScrollerProvider
    │   ├── MessageScroller
    │   │   ├── MessageScrollerViewport
    │   │   │   └── MessageScrollerContent
    │   │   │       └── (MessageScrollerItem per message)
    │   │   │           ├── EmberMessage    — AI bubble with avatar
    │   │   │           ├── UserMessage     — user bubble, right-aligned
    │   │   │           ├── DecisionMessage — Ember bubble + option buttons
    │   │   │           └── TypingIndicator — animated three dots
    │   │   └── MessageScrollerButton       — scroll-to-bottom affordance
    └── ChatInput       — text field + send button at bottom
```

---

## Data Layer: `src/data/mock-itinerary.ts`

### Types

```typescript
export interface ItineraryDay {
  day: number;           // 1–14
  date: string;          // "June 14, 2025"
  stop: string;          // "Venice"
  country: string;       // "Italy"
  lat: number;           // approx latitude for SVG projection
  lng: number;           // approx longitude for SVG projection
  driveHours: number;    // hours of driving from previous stop
  highlights: string[];  // 2–3 things to see/do
  decisionRequired: boolean;
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  consequence: string;
}

export interface RouteDecision {
  id: string;
  dayIndex: number;      // 0-based index into ITINERARY
  title: string;
  question: string;      // Ember's opening message text
  options: DecisionOption[];
}

export interface EmberMessage {
  text: string;
  delayMs: number;       // delay before this message appears
}
```

### The 14-Day Itinerary

| Day | Stop         | Country    | Drive Hrs | Decision? |
|-----|--------------|------------|-----------|-----------|
| 1   | Venice       | Italy      | 0         | false     |
| 2   | Trieste      | Italy      | 1.5       | false     |
| 3   | Ljubljana    | Slovenia   | 1.0       | true      |
| 4   | Zagreb       | Croatia    | 2.0       | false     |
| 5   | Plitvice     | Croatia    | 2.5       | true      |
| 6   | Split        | Croatia    | 2.5       | true      |
| 7   | Dubrovnik    | Croatia    | 2.5       | false     |
| 8   | Kotor        | Montenegro | 1.5       | true      |
| 9   | Tirana       | Albania    | 4.0       | true      |
| 10  | Ohrid        | N. Macedonia | 3.0     | false     |
| 11  | Thessaloniki | Greece     | 3.5       | false     |
| 12  | Meteora      | Greece     | 3.0       | true      |
| 13  | Delphi       | Greece     | 4.0       | false     |
| 14  | Athens       | Greece     | 2.0       | false     |

Decision days: 3, 5, 6, 8, 9, 12 (6 decision days, meeting requirement 3.3).

### SVG Coordinate Projection

Map bounds: lng 12–24 (west–east), lat 36–46 (south–north).  
Map SVG viewport: 600 × 500.

Projection formula (applied to each stop's lat/lng):
```
svgX = (lng - 12) / (24 - 12) * 600
svgY = (1 - (lat - 36) / (46 - 36)) * 500
```

Stop SVG coordinates (pre-computed):

| Stop         | lng   | lat   | svgX  | svgY  |
|--------------|-------|-------|-------|-------|
| Venice       | 12.3  | 45.4  | 15    | 46    |
| Trieste      | 13.8  | 45.6  | 90    | 36    |
| Ljubljana    | 14.5  | 46.1  | 125   | 11    |
| Zagreb       | 16.0  | 45.8  | 200   | 26    |
| Plitvice     | 15.6  | 44.9  | 180   | 71    |
| Split        | 16.4  | 43.5  | 220   | 141   |
| Dubrovnik    | 18.1  | 42.6  | 305   | 190   |
| Kotor        | 18.8  | 42.4  | 340   | 200   |
| Tirana       | 19.8  | 41.3  | 390   | 255   |
| Ohrid        | 20.8  | 41.1  | 440   | 265   |
| Thessaloniki | 22.9  | 40.6  | 545   | 290   |
| Meteora      | 21.6  | 39.7  | 480   | 335   |
| Delphi       | 22.5  | 38.5  | 525   | 395   |
| Athens       | 23.7  | 37.9  | 585   | 425   |

---

## State Management

All state lives in `App.tsx` (no external state library).

```typescript
// App-level state
const [currentDay, setCurrentDay] = useState(1);  // 1-based
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [isEmberTyping, setIsEmberTyping] = useState(false);
const [decidedDays, setDecidedDays] = useState<Set<number>>(new Set());
```

### `ChatMessage` type (local to App/ChatPanel)

```typescript
type ChatRole = "ember" | "user";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  decisionId?: string;       // if this is a decision prompt
  chosenOptionId?: string;   // set when user picks an option
  isTyping?: boolean;        // true = show typing indicator
}
```

---

## Key Behaviors

### Initial Load Sequence

1. App mounts → `messages = []`, `isEmberTyping = false`.
2. `useEffect` on mount: after 1500ms, push a typing indicator, then after 800ms replace it with Ember's welcome message + Day 1 introduction.
3. If Day 1 has `decisionRequired`, queue the first decision message.

### Day Advance Sequence

When `currentDay` changes (via Prev/Next buttons or map stop click):

1. Map immediately re-renders with the new active stop highlighted.
2. If the new day has `decisionRequired` AND that day hasn't been decided yet, Ember proactively sends a decision message after ~1200ms delay.
3. The typing indicator pattern: `isEmberTyping = true` → visible dots → after delay, `isEmberTyping = false` → message appended.

### Decision Resolution Sequence

1. User taps an option button in a `DecisionMessage`.
2. A `UserMessage` is appended immediately showing the chosen option label as the user's reply.
3. The chosen option is recorded: `decidedDays.add(dayIndex)`, `message.chosenOptionId = optionId`.
4. All option buttons in that decision card become disabled.
5. Ember typing indicator appears for ~800ms.
6. Ember's follow-up messages from `EMBER_SEQUENCES[decisionId]` are sent sequentially, each with its own `delayMs` offset.

### Free-Text Input

1. User types and hits Enter or the Send button.
2. A `UserMessage` is appended immediately.
3. Ember typing indicator for ~1000ms, then a canned contextual reply based on current day.

---

## Component Details

### `RouteMap` SVG

The SVG has `viewBox="0 0 600 500"` and `preserveAspectRatio="xMidYMid meet"`.

Layers (bottom to top):
1. Sea/background fill — `#d4e8f0` (light blue)
2. Country outline fills — warm muted tones per country (Italy `#e8d5b7`, Balkans `#d9c9a8`, Greece `#dcc9a0`)
3. Route polyline — all 14 stops connected, `stroke="#ff6200"` (fuego-500), `strokeWidth=2`, `strokeDasharray="6 3"`
4. Traveled route overlay — a second polyline from stop 0 to `currentDay - 1`, `stroke="#ff6200"`, `strokeWidth=3`, solid (no dash)
5. Stop markers — circle + label, styled by status
6. Active stop pulse ring — Framer Motion `animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}` loop

#### Stop marker styles:
- **visited** (day < currentDay): filled circle `#ff6200`, muted label
- **active** (day === currentDay): filled circle `#ff6200` + pulse ring, bold label
- **future** (day > currentDay): outlined circle `#ece9e4`, light label

### `EmberMessage` / `DecisionMessage`

Uses shadcn primitives:
```tsx
<Message align="start">
  <MessageAvatar>
    <Avatar>
      <AvatarFallback className="bg-fuego-500 text-white text-xs">EM</AvatarFallback>
    </Avatar>
  </MessageAvatar>
  <MessageContent>
    <MessageHeader>Ember</MessageHeader>
    <Bubble variant="secondary">
      <BubbleContent>{text}</BubbleContent>
    </Bubble>
    {/* For DecisionMessage: */}
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map(opt => (
        <Button key={opt.id} variant="outline" size="sm" disabled={!!chosenOptionId} onClick={() => onDecide(opt.id)}>
          {opt.label}
        </Button>
      ))}
    </div>
  </MessageContent>
</Message>
```

### `TypingIndicator`

Three dots animated with Framer Motion staggered scale/opacity bounce:
```tsx
<Message align="start">
  <MessageAvatar>...</MessageAvatar>
  <MessageContent>
    <Bubble variant="secondary">
      <BubbleContent>
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <motion.div key={i} className="w-2 h-2 rounded-full bg-muted-foreground"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </div>
      </BubbleContent>
    </Bubble>
  </MessageContent>
</Message>
```

### `UserMessage`

```tsx
<Message align="end">
  <MessageContent>
    <Bubble variant="default" align="end">
      <BubbleContent>{text}</BubbleContent>
    </Bubble>
  </MessageContent>
</Message>
```

---

## File Structure

```
src/
├── App.tsx                         ← replaced with split-screen root
├── data/
│   └── mock-itinerary.ts           ← new: 14-day data + decisions + Ember sequences
├── components/
│   ├── AppHeader.tsx               ← new: top bar
│   ├── MapPanel.tsx                ← new: left panel wrapper + DayControls
│   ├── RouteMap.tsx                ← new: inline SVG
│   ├── ChatPanel.tsx               ← new: right panel chat surface
│   ├── EmberMessage.tsx            ← new: Ember bubble
│   ├── DecisionMessage.tsx         ← new: Ember bubble + option buttons
│   ├── UserMessage.tsx             ← new: user bubble
│   └── TypingIndicator.tsx         ← new: three-dot animation
│   └── ui/                         ← existing shadcn components (unchanged)
```

---

## Correctness Properties

No formal property-based tests are applicable — this is a front-end UI/UX component with no algorithmic invariants to verify. Correctness is validated through component-level unit tests and visual inspection.

---

## Constraints

- No new npm packages beyond what's already installed.
- No backend, no fetch calls, no external data.
- `src/components/ui/` files are not modified.
- The shadcn chat kit (`Message`, `MessageScroller`, `Bubble`, `Marker`) is used directly — no rebuild from scratch.
- Framer Motion is used only for the pulse animation and message enter animations.
