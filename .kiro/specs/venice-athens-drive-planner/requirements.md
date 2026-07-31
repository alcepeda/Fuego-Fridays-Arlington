# Requirements: Venice-to-Athens Drive Planner

## Overview

A split-screen React app that replaces `src/App.tsx`. The left panel shows an illustrated SVG route map of a Venice-to-Athens road trip with 14+ labeled stops. The right panel is a chat surface where AI teammate "Ember" proactively surfaces route decisions using the Decide humorphic pattern. All AI responses and itinerary data are fully mocked.

---

## User Stories

### 1. Split-Screen Layout

**As a** traveler planning a Venice-to-Athens road trip,
**I want** a split-screen interface with a map on the left and a chat on the right,
**so that** I can see where I am on the route while discussing decisions with my AI teammate.

#### Acceptance Criteria

- 1.1 The app renders as a full-viewport split-screen: left panel (map) and right panel (chat), with no page scroll on the outer layout.
- 1.2 The left panel occupies approximately 55% of viewport width on desktop and collapses to a compact top strip on mobile (below md breakpoint).
- 1.3 The right panel occupies approximately 45% of viewport width on desktop and fills the remaining space on mobile.
- 1.4 A narrow header bar spans full width above both panels, showing the trip name ("Venice → Athens") and Ember's status indicator.

---

### 2. SVG Route Map

**As a** traveler,
**I want** to see an illustrated SVG route map of the Venice-to-Athens drive,
**so that** I can visualize the full journey and each day's progress.

#### Acceptance Criteria

- 2.1 The map renders as an inline SVG (not an external image) within the left panel, scaling responsively to fill the panel.
- 2.2 The map includes at least 14 labeled stops along the route: Venice, Trieste, Ljubljana, Zagreb, Split, Dubrovnik, Kotor, Tirana, Ohrid, Thessaloniki, Meteora, Delphi, Corinth, Athens.
- 2.3 Each stop is represented by a circular marker with the city name label; the size and style distinguish between major stops and minor waypoints.
- 2.4 A continuous route polyline connects all stops in geographic order from Venice to Athens, rendered in a styled stroke (e.g., dashed or colored).
- 2.5 The map includes simplified coastal and country outlines as decorative SVG paths to provide geographic context.
- 2.6 The currently active day's stop(s) are highlighted — the active stop marker pulses or glows to distinguish it from inactive stops.
- 2.7 Previously visited stops are rendered in a muted/completed style; future stops in a lighter/upcoming style.
- 2.8 Clicking a stop marker on the map scrolls the chat to the message related to that stop's decision, or displays a tooltip with the day and stop name.
- 2.9 Day-by-day navigation controls (Previous Day / Next Day buttons, or a day slider) allow the user to advance or rewind the highlighted day.

---

### 3. Full 14-Day Itinerary Data

**As a** developer,
**I want** complete itinerary data in `src/data/mock-itinerary.ts`,
**so that** both the map and chat can reference a single consistent data source.

#### Acceptance Criteria

- 3.1 `src/data/mock-itinerary.ts` exports a `ITINERARY` array of 14 day objects.
- 3.2 Each day object contains: `day` (number 1–14), `date` (string), `stop` (city name), `country`, `lat` and `lng` (approximate coordinates for SVG projection), `driveHours` (number), `highlights` (string array), and `decisionRequired` (boolean flag).
- 3.3 At least 6 of the 14 days are flagged with `decisionRequired: true`, representing moments where Ember will proactively raise a route decision in chat.
- 3.4 The data file also exports a `ROUTE_DECISIONS` array of pre-scripted decision objects, each with: `id`, `dayIndex`, `title`, `question` (Ember's opening message), `options` (array of 2–3 choices with label and description), and `consequence` (a string describing the downstream impact of each option).
- 3.5 The data file exports `EMBER_SEQUENCES`: a record keyed by decision ID, each containing an array of follow-up messages Ember sends after the user picks an option.

---

### 4. Ember Chat Panel (Decide Pattern)

**As a** traveler,
**I want** an AI teammate named Ember who proactively raises route decisions in the chat,
**so that** I feel like I'm collaborating with a knowledgeable travel companion rather than using a tool.

#### Acceptance Criteria

- 4.1 The right panel is a full-height chat surface built with the shadcn chat kit (`Message`, `MessageScroller`, `Bubble`, `Marker`) — no custom chat scaffolding from scratch.
- 4.2 On initial load (after a ~1.5 second delay), Ember sends a first proactive message welcoming the user and introducing the first decision.
- 4.3 When the active day advances to a `decisionRequired` day, Ember proactively sends a decision question message without the user typing anything.
- 4.4 Each decision message from Ember includes inline option buttons (2–3 choices) the user can tap to respond — no free-text input required for decisions.
- 4.5 After the user taps an option, Ember sends a follow-up confirmation message (from `EMBER_SEQUENCES`) after a ~800ms simulated thinking delay.
- 4.6 Ember's messages show her avatar (initials "EM" or a flame icon) and name. User responses show as right-aligned bubbles with "You" label.
- 4.7 The chat auto-scrolls to the latest message when a new message is added.
- 4.8 A free-text input field at the bottom of the chat panel allows the user to send custom messages; Ember responds with a canned contextual reply after ~1 second.
- 4.9 Ember's messages that are "thinking" (being composed) display a typing indicator (three animated dots) before the bubble appears.
- 4.10 Decision option buttons become disabled (grayed out) after the user has made a choice, preserving the decision history visually.

---

### 5. Day Navigation and Map Sync

**As a** traveler,
**I want** the map highlight and chat to stay in sync as I advance through the itinerary,
**so that** I always know which day I'm looking at.

#### Acceptance Criteria

- 5.1 The current day state is managed at the top-level component and passed down to both the map and the chat panel.
- 5.2 Advancing to a new day via the navigation controls updates the map highlight immediately and, if that day has `decisionRequired: true`, queues Ember's proactive message.
- 5.3 A day counter ("Day 3 of 14 · Split, Croatia") is displayed, either in the header or at the top of the map panel.
- 5.4 The Previous Day button is disabled on Day 1; the Next Day button is disabled on Day 14.
- 5.5 When a stop is clicked on the map, the active day jumps to that stop's day.

---

### 6. Visual Design and Animation

**As a** traveler,
**I want** the app to feel warm, illustrated, and travel-inspired,
**so that** planning the trip feels delightful rather than utilitarian.

#### Acceptance Criteria

- 6.1 The overall color palette follows the existing Tailwind theme from `src/index.css`: paper background (`--background`), ink foreground, fuego-500 orange accent.
- 6.2 The active stop on the map pulses using a Framer Motion `animate` loop (scale and opacity).
- 6.3 New chat messages animate in with a subtle fade+slide using Framer Motion.
- 6.4 The route polyline on the map is rendered in fuego-500 orange with a partial "traveled" segment highlighted more boldly up to the current stop.
- 6.5 Country/sea fill areas on the map use muted, warm-toned colors to evoke a vintage travel illustration.
- 6.6 The header includes the fuego brand gradient (`bg-thermal` utility class) as a subtle accent element.
