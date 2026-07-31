# Requirements: Venice-to-Athens Route Planner

## Overview

A split-screen React app where the left panel displays an illustrated SVG route map of a 14-day Venice-to-Athens drive, and the right panel hosts a chat interface where an AI teammate named "Ember" proactively surfaces route decisions. The humorphic pattern is **Decide**: Ember weighs options and formalizes choices on behalf of the traveler, initiating decision conversations rather than waiting to be asked.

---

## Requirement 1 — SVG Route Map Panel

**User Story:** As a traveler, I want to see a visual route map of my 14-day drive from Venice to Athens, so that I can understand the overall journey at a glance.

### Acceptance Criteria

1. WHEN the app loads THEN the system SHALL render a left panel containing an SVG map with 14 or more labeled stop markers (dots) positioned along a drawn route line.
2. WHEN stop markers are rendered THEN the system SHALL display each stop's name as a visible label adjacent to its dot.
3. WHEN a day is active THEN the system SHALL highlight the stops belonging to that day in a distinct accent color (fuego orange) while leaving other stops in a muted state.
4. WHEN a stop is the current focus THEN the system SHALL animate a pulse ring around that stop's dot.
5. WHEN the map is rendered THEN the system SHALL draw a continuous polyline or path connecting all stops in geographic order from Venice to Athens.

---

## Requirement 2 — Itinerary Data Model

**User Story:** As a developer, I want a complete 14-day itinerary data file, so that both the map and chat panels have a single source of truth for all stops, decisions, and route details.

### Acceptance Criteria

1. WHEN the mock itinerary is loaded THEN the system SHALL contain at least 14 day entries, each with at least one named stop.
2. WHEN a stop is defined THEN the system SHALL include: id, name, day number, SVG coordinates (x, y), country, a short description, and an estimated drive time from the previous stop.
3. WHEN a decision point is defined THEN the system SHALL include: the day it occurs on, a question for the traveler, two or more named options each with a consequence description, and a recommended option index.
4. WHEN the itinerary data is imported THEN the system SHALL export a typed TypeScript interface for Stop, DayEntry, DecisionPoint, and Itinerary.

---

## Requirement 3 — Ember Chat Panel (Decide Pattern)

**User Story:** As a traveler, I want an AI teammate named Ember to proactively raise route decisions in a chat panel, so that I can make informed choices without having to think of every question myself.

### Acceptance Criteria

1. WHEN the app loads THEN the system SHALL render a right panel containing a chat surface built with the existing shadcn chat kit (Message, Bubble, MessageScroller components).
2. WHEN the app loads THEN the system SHALL display Ember's avatar (a small flame icon or "E" initials) alongside each of Ember's messages.
3. WHEN a new day begins THEN the system SHALL have Ember proactively open with a day-briefing message after a short delay (300–800 ms), without waiting for user input.
4. WHEN a decision point is reached for the active day THEN the system SHALL have Ember present a decision question with two or more tappable option cards inside the chat bubble.
5. WHEN the user taps a decision option THEN the system SHALL replace the option cards with a confirmation message from Ember acknowledging the choice, and mark the option as selected.
6. WHEN a user types a free-text reply THEN the system SHALL respond with a contextually plausible canned reply from Ember after a 600–1200 ms simulated thinking delay.
7. WHEN a message is being "typed" by Ember THEN the system SHALL display a typing indicator (three animated dots) until the message appears.

---

## Requirement 4 — Split-Screen Layout and Navigation

**User Story:** As a traveler, I want to navigate through the days of the trip and see the map and chat update together, so that the two panels always show consistent information.

### Acceptance Criteria

1. WHEN the app renders THEN the system SHALL display a split-screen layout with the map panel on the left (roughly 55% width on desktop) and the chat panel on the right (roughly 45% width).
2. WHEN the user advances to the next day THEN the system SHALL update the active day highlight on the map and trigger Ember's next briefing in the chat.
3. WHEN the user selects a specific day via a day navigation control THEN the system SHALL jump to that day on the map and load the appropriate chat state.
4. WHEN the viewport is narrow (mobile) THEN the system SHALL stack the panels vertically with the map on top and the chat below.
5. WHEN a day changes THEN the system SHALL smoothly animate the map highlight transition using Framer Motion.

---

## Requirement 5 — Interaction Polish and Accessibility

**User Story:** As a traveler, I want the interface to feel alive and responsive, so that interacting with Ember feels like collaborating with a real teammate.

### Acceptance Criteria

1. WHEN the app is in its initial state THEN the system SHALL show a welcome message from Ember introducing herself and the journey.
2. WHEN a decision is pending THEN the system SHALL display a subtle pulsing badge or indicator on the chat panel header to draw attention.
3. WHEN an option card is hovered THEN the system SHALL show a hover state that signals it is interactive.
4. WHEN a message arrives THEN the system SHALL auto-scroll the chat to the latest message.
5. WHEN interactive elements are rendered THEN the system SHALL include appropriate aria-labels and role attributes for screen reader accessibility.
