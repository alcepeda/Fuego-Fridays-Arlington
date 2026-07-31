# Requirements Document

## Introduction

A split-screen React application replacing `src/App.tsx` that simulates an AI travel-planning teammate named Ember helping a user plan a 14-day road trip from Venice to Athens. The left panel displays an illustrated SVG route map of the drive with 14+ labeled stops, a drawn route line connecting them, and day-by-day visual highlighting that updates as decisions are made. The right panel presents a chat surface — built on the existing shadcn/ui chat kit (Message, Bubble, MessageScroller) — where Ember proactively surfaces route decisions (coastal vs. inland variants, hotel tier trade-offs, extra-day allocation) without waiting for a user prompt. The user selects between options Ember presents; the itinerary data and map update to reflect each confirmed choice. All AI responses and itinerary data are mocked with hardcoded sequences and `setTimeout`. There is no backend and no API keys. The application follows the Decide humorphic pattern: the AI does the research, surfaces a clear recommendation with evidence, and gates confirmation behind an explicit human choice. The Fuego theme (orange `#ff6200` accent, paper `#faf9f7` background, warm ink typography) is preserved throughout.

## Glossary

- **App**: The root React component rendered at `src/App.tsx`.
- **RouteMap**: The left-panel SVG component that renders the Venice-to-Athens route, stop dots, labels, route line, and day highlight.
- **ChatPanel**: The right-panel component housing the Ember conversation thread.
- **Ember**: The mock AI travel-planning teammate. All Ember messages are simulated via `setTimeout` and hardcoded sequences.
- **Stop**: A geographic waypoint on the route (city or town) represented as a labeled dot on the RouteMap.
- **Day**: One calendar day in the 14-day itinerary, associated with one or more Stops.
- **DecisionCard**: A structured message component inside ChatPanel that presents two or more named options with supporting details and an accept button per option.
- **ActiveDay**: The currently highlighted Day on the RouteMap, updated by user decisions and Ember prompts.
- **ItineraryState**: The front-end state object holding the full ordered list of Stops, their per-Stop day assignment, accommodation choice, and route variant, updated when the user confirms a DecisionCard option.
- **RouteVariant**: A binary choice for a segment of the drive — e.g., coastal Adriatic road vs. inland motorway.
- **MockItinerary**: The hardcoded data file at `src/data/mock-itinerary.ts` containing all Stop definitions, driving distances, accommodation options, and POIs.
- **Fuego Theme**: The design token set defined in `src/index.css` — paper background (`#faf9f7`), ink foreground (`#1b1a18`), orange accent (`#ff6200` / `--fuego-500`).
- **DecisionSequence**: The hardcoded array of Ember decision prompts with their option sets, delivered in order via `setTimeout` as the user works through the itinerary.

## Requirements

### Requirement 1 — Layout

**User Story:** As a trip planner, I want a split-screen layout with the route map on the left and Ember's chat on the right, so that I can see the map and the conversation simultaneously on one screen.

#### Acceptance Criteria

1. THE App SHALL render a full-viewport layout that divides available width into a left panel (RouteMap) and a right panel (ChatPanel) with no vertical scroll on the outer shell.
2. THE App SHALL assign the RouteMap panel a fixed proportional width of approximately 55% and the ChatPanel panel approximately 45% of the total viewport width on screens wider than 1024 px.
3. WHEN the viewport width is below 768 px, THE App SHALL stack the RouteMap above the ChatPanel in a single-column layout with each panel taking full width.
4. THE App SHALL apply the Fuego Theme background color (`--background`) to the outer shell and use `--card` white for panel surfaces.
5. THE App SHALL display a header bar showing the title "Venice → Athens" and the Ember avatar/name badge using the Fuego orange accent.

### Requirement 2 — Route Map (SVG)

**User Story:** As a trip planner, I want to see an illustrated SVG map of the full Venice-to-Athens route with labeled stops and a route line, so that I can visualize the geography of my trip.

#### Acceptance Criteria

1. THE RouteMap SHALL render an inline SVG element with a `viewBox` that covers all 14+ stops using approximate geographic coordinates projected to SVG space.
2. THE RouteMap SHALL draw a continuous polyline connecting all Stops in route order, styled with the Fuego orange accent (`--fuego-500`) at 2 px stroke weight.
3. THE RouteMap SHALL render each Stop as a filled circle dot (6 px radius) with a text label showing the city name positioned to avoid overlap with the route line.
4. WHEN a Day is the ActiveDay, THE RouteMap SHALL highlight the Stops associated with that Day using a larger dot (10 px radius), an orange fill (`--fuego-500`), and a subtle animated pulse using Framer Motion.
5. WHEN the user hovers over a Stop dot, THE RouteMap SHALL display a tooltip showing the Stop name, the Day number, the driving distance from the previous Stop, and the planned accommodation name.
6. THE RouteMap SHALL include a visual legend identifying the route line, default stops, and the active-day highlight style.
7. WHEN ItineraryState is updated by a user decision, THE RouteMap SHALL re-render within one animation frame to reflect the new stop configuration or route variant without a full page reload.
8. THE RouteMap SHALL render a background suggesting the Mediterranean region — a light blue fill for sea areas and a warm off-white for land — using simple SVG shapes, requiring no external image assets.

### Requirement 3 — Mock Itinerary Data

**User Story:** As a developer, I want all 14-day itinerary data defined in a single mock data file, so that the map, chat decisions, and itinerary state all draw from one authoritative source.

#### Acceptance Criteria

1. THE MockItinerary SHALL define a minimum of 14 Stops in driving order from Venice (Italy) to Athens (Greece) including cities in Italy, Slovenia or Croatia, Bosnia-Herzegovina or Montenegro, Albania, and Greece.
2. THE MockItinerary SHALL include for each Stop: a unique id, city name, country, approximate latitude and longitude, the Day number (1–14), driving distance in kilometers from the previous Stop, a short description (one to two sentences), at least two accommodation options (name, tier: budget/mid/luxury, price per night in EUR), and at least two POIs (name, type).
3. THE MockItinerary SHALL define at minimum two RouteVariants — one coastal Adriatic segment and one inland segment — each listing the affected Stop ids and a brief description of the trade-offs.
4. THE MockItinerary SHALL export typed TypeScript interfaces for Stop, Accommodation, POI, RouteVariant, and the root ItineraryData object.
5. THE MockItinerary SHALL be importable from `src/data/mock-itinerary.ts` without side effects.

### Requirement 4 — Ember Chat Surface

**User Story:** As a trip planner, I want a chat surface where Ember proactively starts the conversation and guides me through decisions, so that I feel like I have a knowledgeable travel companion rather than a form to fill out.

#### Acceptance Criteria

1. THE ChatPanel SHALL use the existing `MessageScroller`, `Message`, `MessageContent`, `MessageAvatar`, `Bubble`, and `BubbleContent` components from `src/components/ui` to render the conversation thread.
2. WHEN the App first mounts, THE ChatPanel SHALL display an opening message from Ember (role: agent) after a 600 ms `setTimeout` delay, introducing the route and summarizing the first pending decision.
3. THE ChatPanel SHALL render Ember messages with a distinct avatar using the initials "EM" and the Fuego orange accent as the avatar background.
4. THE ChatPanel SHALL render user-selection confirmations as right-aligned messages (align="end") using the primary (ink) bubble variant.
5. WHEN Ember sends a message, THE ChatPanel SHALL simulate a typing indicator for 800–1200 ms before revealing the message content, using an animated three-dot indicator built with Framer Motion.
6. THE ChatPanel SHALL auto-scroll to the latest message after each new message appears, leveraging the `MessageScroller` auto-scroll behavior.
7. THE ChatPanel SHALL render a fixed input area at the bottom of the panel. WHILE no DecisionCard is awaiting a user response, THE ChatPanel SHALL display a disabled text input with placeholder text "Waiting for Ember…".
8. WHEN a DecisionCard is the latest unresolved message, THE ChatPanel SHALL enable free-text input so the user can type a reply, with a send button that submits the text as a user message and triggers the next Ember response in the DecisionSequence.

### Requirement 5 — Decision Cards (Decide Pattern)

**User Story:** As a trip planner, I want Ember to present route decisions as structured option cards within the chat, so that I can compare choices clearly and confirm my selection without leaving the conversation.

#### Acceptance Criteria

1. THE DecisionCard SHALL render inside a `Bubble` with the `muted` or `outline` variant and display: a decision title, a one-sentence context line from Ember, two or more named options each with a brief description and one or two key facts (distance, cost, or time), and a clearly labeled "Choose this" button per option.
2. WHEN the user clicks a "Choose this" button, THE DecisionCard SHALL become visually locked (buttons disabled, chosen option highlighted with the Fuego orange accent), a user confirmation message SHALL appear in the thread, and ItineraryState SHALL update to reflect the selected option.
3. WHEN ItineraryState is updated after a decision, THE ActiveDay on the RouteMap SHALL advance to the next Day associated with the next pending decision.
4. THE DecisionSequence SHALL contain a minimum of five distinct decisions covering: (1) coastal vs. inland route variant for the Adriatic segment, (2) hotel tier for at least one stop, (3) an extra-day allocation between two alternative stops, (4) a border-crossing timing choice (morning vs. afternoon), and (5) a final Athens arrival approach (direct vs. scenic detour).
5. WHEN all decisions in the DecisionSequence are resolved, THE ChatPanel SHALL display a final summary message from Ember listing the confirmed choices and total estimated driving distance.
6. IF the user clicks "Choose this" on a decision that affects a RouteVariant, THEN THE RouteMap SHALL update the polyline to reflect the chosen variant path within 300 ms.

### Requirement 6 — Itinerary State Management

**User Story:** As a trip planner, I want my decisions to be reflected in both the map and the conversation thread in real time, so that I always see a consistent picture of my current plan.

#### Acceptance Criteria

1. THE App SHALL maintain ItineraryState in React component state (useState or useReducer) at the App level, with no external state library required.
2. WHEN a decision is confirmed, THE App SHALL produce a new ItineraryState object (immutable update) within the same event tick.
3. THE App SHALL pass ItineraryState and a dispatch/update callback down to RouteMap and ChatPanel as props.
4. WHEN ItineraryState changes, THE RouteMap SHALL receive updated props and re-render the affected stop highlights and route variant polyline without unmounting.
5. THE App SHALL derive the ActiveDay from the index of the first unresolved decision in the DecisionSequence, defaulting to Day 1 on initial mount.

### Requirement 7 — Animations and Polish

**User Story:** As a trip planner, I want the interface to feel lively and intentional, so that the AI teammate's presence feels real rather than mechanical.

#### Acceptance Criteria

1. THE RouteMap SHALL animate the route polyline drawing on initial mount using a Framer Motion `pathLength` animation over 1200 ms with an `easeInOut` easing curve.
2. WHEN a new Stop becomes part of the ActiveDay, THE RouteMap SHALL animate the dot scale from 1× to 1.4× and back using a Framer Motion spring.
3. WHEN a new Ember message appears, THE ChatPanel SHALL animate the message bubble sliding up from 8 px below with opacity going from 0 to 1 over 250 ms using Framer Motion.
4. THE DecisionCard "Choose this" button SHALL use the Fuego thermal gradient background (`bg-thermal` utility) and show a hover lift transition (`-translate-y-0.5`).
5. WHEN a decision is confirmed, THE DecisionCard SHALL animate the unchosen option fading to 40% opacity over 200 ms using Framer Motion.

### Requirement 8 — Accessibility

**User Story:** As a user relying on keyboard navigation, I want all interactive elements in both panels to be keyboard-accessible and screen-reader-friendly, so that the application is usable without a mouse.

#### Acceptance Criteria

1. THE RouteMap Stop dots SHALL be rendered as `<button>` or focusable elements with `aria-label` containing the Stop name and Day number.
2. THE DecisionCard "Choose this" buttons SHALL have descriptive `aria-label` attributes that include both the option name and the decision context.
3. WHEN a new Ember message appears, THE ChatPanel SHALL announce it to screen readers using an `aria-live="polite"` region.
4. THE ChatPanel input SHALL have an associated `<label>` or `aria-label` attribute.
5. THE App SHALL maintain a visible focus ring on all interactive elements using the `--ring` token (`#ff6200`).
