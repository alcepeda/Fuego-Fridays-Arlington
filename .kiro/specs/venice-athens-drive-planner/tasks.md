# Implementation Plan: Venice-to-Athens Drive Planner

## Overview

Build the split-screen Venice-to-Athens drive planner in TypeScript/React, replacing `src/App.tsx`. Work proceeds in four passes: (1) data layer, (2) SVG map, (3) chat panel with Ember's Decide pattern, (4) wiring everything together in App.tsx with shared state.

## Tasks

- [x] 1. Create the itinerary data file
  - [x] 1.1 Create `src/data/mock-itinerary.ts` with all types and data
    - Export `ItineraryDay`, `DecisionOption`, `RouteDecision`, `EmberMessage` TypeScript interfaces
    - Export `ITINERARY`: array of 14 day objects (Venice → Athens) with `day`, `date`, `stop`, `country`, `lat`, `lng`, `driveHours`, `highlights`, `decisionRequired`
    - Export `ROUTE_DECISIONS`: 6 decision objects for days 3 (Ljubljana), 5 (Plitvice), 6 (Split), 8 (Kotor), 9 (Tirana), 12 (Meteora) — each with `id`, `dayIndex`, `title`, `question`, and `options` array (2–3 choices with `id`, `label`, `description`, `consequence`)
    - Export `EMBER_SEQUENCES`: record keyed by decision ID, each containing `EmberMessage[]` (text + delayMs) for follow-up replies
    - Export `CANNED_REPLIES`: array of 5+ contextual free-text responses Ember can cycle through
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2. Build the SVG route map
  - [x] 2.1 Create `src/components/RouteMap.tsx`
    - Render an inline SVG with `viewBox="0 0 600 500"` and `preserveAspectRatio="xMidYMid meet"`
    - Layer 1: sea background fill rect `#d4e8f0`
    - Layer 2: simplified country outline `<path>` elements for Italy, Slovenia/Croatia/Balkans, Montenegro/Albania/N.Macedonia, Greece — use simple polygon approximations, warm muted fill colors
    - Layer 3: dashed route polyline connecting all 14 stop coordinates (fuego-500 orange, `strokeDasharray="6 3"`, strokeWidth 2)
    - Layer 4: solid "traveled" overlay polyline from stop 0 to `currentDay - 1` (fuego-500, strokeWidth 3, solid)
    - Layer 5: stop markers — `<circle>` + `<text>` label for each stop, styled by visited/active/future status
    - Layer 6: active stop Framer Motion pulse ring (scale+opacity loop animation)
    - Accept props: `currentDay: number`, `onStopClick: (day: number) => void`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 6.2, 6.4, 6.5_

  - [x] 2.2 Create `src/components/MapPanel.tsx`
    - Render `RouteMap` inside a left-panel container
    - Add `DayControls`: Prev/Next buttons + `"Day N of 14 · City, Country"` label
    - Disable Prev on day 1, Next on day 14
    - Accept props: `currentDay`, `onDayChange`, `onStopClick`
    - _Requirements: 2.9, 5.3, 5.4_

- [x] 3. Build the Ember chat components
  - [x] 3.1 Create `src/components/TypingIndicator.tsx`
    - Wrap a `Message` + `MessageAvatar` (Avatar with "EM" fallback, fuego-500 background) + `MessageContent` + `Bubble variant="secondary"` + `BubbleContent`
    - Inside BubbleContent: three `motion.div` dots with staggered scale/opacity loop (delay: i * 0.2s, duration 0.8s, repeat Infinity)
    - _Requirements: 4.9_

  - [x] 3.2 Create `src/components/EmberMessage.tsx`
    - Accept `text: string` prop
    - Render `Message align="start"` with Avatar ("EM", fuego-500), `MessageHeader` ("Ember"), `Bubble variant="secondary"` containing the text
    - Wrap the whole component in `motion.div` with fade+slide-up enter animation (initial: opacity 0, y 8; animate: opacity 1, y 0; duration 0.25s)
    - _Requirements: 4.6, 6.3_

  - [x] 3.3 Create `src/components/UserMessage.tsx`
    - Accept `text: string` prop
    - Render `Message align="end"` with `Bubble variant="default" align="end"` containing the text
    - Wrap in `motion.div` with same fade+slide enter animation
    - _Requirements: 4.6, 6.3_

  - [x] 3.4 Create `src/components/DecisionMessage.tsx`
    - Accept `decision: RouteDecision`, `chosenOptionId: string | null`, `onChoose: (optionId: string) => void` props
    - Render like `EmberMessage` but below the text bubble, render a row of `Button variant="outline" size="sm"` for each option
    - Buttons are disabled when `chosenOptionId !== null`
    - The chosen option button gets a fuego-500 border highlight to show the selection
    - _Requirements: 4.4, 4.10_

  - [x] 3.5 Create `src/components/ChatPanel.tsx`
    - Accept `messages: ChatMessage[]`, `isEmberTyping: boolean`, `onSend: (text: string) => void`, `onDecide: (msgId: string, optionId: string) => void` props
    - Use `MessageScrollerProvider` > `MessageScroller` > `MessageScrollerViewport` > `MessageScrollerContent` as the scroll container
    - Map over `messages`: render `EmberMessage`, `UserMessage`, or `DecisionMessage` based on `role` and `decisionId`
    - Append `TypingIndicator` when `isEmberTyping === true`
    - Add `MessageScrollerButton` (scroll-to-bottom affordance)
    - `ChatInput` at the bottom: shadcn `Input` + Send `Button`; on Enter or click, call `onSend`
    - _Requirements: 4.1, 4.7, 4.8_

- [x] 4. Build the header
  - [x] 4.1 Create `src/components/AppHeader.tsx`
    - Full-width `<header>` with `bg-thermal` gradient strip (or a subtle fuego accent border-b)
    - Left: "Venice → Athens" title in bold
    - Center: current day label passed as prop (`"Day N · City, Country"`)
    - Right: Ember status badge ("Ember · Active") with a small flame or green dot indicator
    - _Requirements: 1.4, 6.6_

- [x] 5. Wire everything together in App.tsx
  - [x] 5.1 Rewrite `src/App.tsx` with split-screen layout and all state
    - Define `ChatMessage` interface (id, role, text, decisionId?, chosenOptionId?, isTyping?) locally
    - State: `currentDay` (useState 1), `messages` (useState []), `isEmberTyping` (useState false), `decidedDays` (useState Set)
    - `useEffect` on mount: 1500ms delay → typing indicator → 800ms → welcome + Day 1 intro message; if Day 1 has decision, queue it
    - `handleDayChange(day)`: update `currentDay`; if `ITINERARY[day-1].decisionRequired` and not in `decidedDays`, queue Ember decision message with 1200ms delay
    - `handleStopClick(day)`: calls `handleDayChange(day)` (requirement 5.5)
    - `handleDecide(msgId, optionId)`: append user message with option label, mark `decidedDays`, disable buttons, trigger Ember follow-up sequence from `EMBER_SEQUENCES`
    - `handleSend(text)`: append user message, trigger Ember canned reply after 1000ms
    - Layout: full-viewport flex-col (header + flex-row body); body = `MapPanel` (55%) + `ChatPanel` (45%)
    - Mobile: below `md`, map panel collapses to `h-48` strip at top, chat fills remaining height
    - _Requirements: 1.1, 1.2, 1.3, 5.1, 5.2, 5.4_

- [x] 6. Checkpoint — verify the app renders and interacts correctly
  - Ensure `npm run build` (tsc + vite build) passes with no type errors
  - Verify split-screen layout, map SVG, Ember initial message, day navigation, decision flow all work in the browser
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- No new npm packages — Framer Motion and all shadcn components are already installed
- `src/components/ui/` files must NOT be modified
- The chat kit (`MessageScroller`, `Message`, `Bubble`, etc.) is used directly from `@/components/ui`
- All Ember responses are hardcoded — no fetch, no AI API
- SVG country paths use simplified polygon approximations, not real GeoJSON

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "3.1", "3.2", "3.3", "4.1"] },
    { "id": 2, "tasks": ["2.2", "3.4", "3.5"] },
    { "id": 3, "tasks": ["5.1"] }
  ]
}
```
