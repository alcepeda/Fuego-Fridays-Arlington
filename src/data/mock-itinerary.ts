// ─── Types ──────────────────────────────────────────────────────────────────

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

// ─── 14-Day Itinerary ───────────────────────────────────────────────────────

export const ITINERARY: ItineraryDay[] = [
  {
    day: 1,
    date: "June 14, 2025",
    stop: "Venice",
    country: "Italy",
    lat: 45.4,
    lng: 12.3,
    driveHours: 0,
    highlights: ["Gondola ride through the Grand Canal", "Piazza San Marco at dusk", "Cicchetti bar crawl in Cannaregio"],
    decisionRequired: false,
  },
  {
    day: 2,
    date: "June 15, 2025",
    stop: "Trieste",
    country: "Italy",
    lat: 45.6,
    lng: 13.8,
    driveHours: 1.5,
    highlights: ["Caffè San Marco — one of Europe's grand old cafés", "Castello di Miramare on the Adriatic cliffs", "Piazza Unità d'Italia, the largest sea-facing square in Europe"],
    decisionRequired: false,
  },
  {
    day: 3,
    date: "June 16, 2025",
    stop: "Ljubljana",
    country: "Slovenia",
    lat: 46.1,
    lng: 14.5,
    driveHours: 1.0,
    highlights: ["Ljubljana Castle and the funicular", "Dragon Bridge photo stop", "Open-air Central Market along the Ljubljanica"],
    decisionRequired: true,
  },
  {
    day: 4,
    date: "June 17, 2025",
    stop: "Zagreb",
    country: "Croatia",
    lat: 45.8,
    lng: 16.0,
    driveHours: 2.0,
    highlights: ["Upper Town (Gornji Grad) and St. Mark's Church", "Museum of Broken Relationships", "Dolac outdoor market breakfast"],
    decisionRequired: false,
  },
  {
    day: 5,
    date: "June 18, 2025",
    stop: "Plitvice",
    country: "Croatia",
    lat: 44.9,
    lng: 15.6,
    driveHours: 2.5,
    highlights: ["Plitvice Lakes National Park — Upper Lakes trail", "Veliki Slap, Croatia's tallest waterfall", "Wooden boardwalks over turquoise water"],
    decisionRequired: true,
  },
  {
    day: 6,
    date: "June 19, 2025",
    stop: "Split",
    country: "Croatia",
    lat: 43.5,
    lng: 16.4,
    driveHours: 2.5,
    highlights: ["Diocletian's Palace — still a living neighborhood", "Riva waterfront promenade", "Marjan Hill for panoramic views"],
    decisionRequired: true,
  },
  {
    day: 7,
    date: "June 20, 2025",
    stop: "Dubrovnik",
    country: "Croatia",
    lat: 42.6,
    lng: 18.1,
    driveHours: 2.5,
    highlights: ["Walk the Old City walls at sunrise", "Cable car to Mount Srđ", "Lokrum Island day trip by ferry"],
    decisionRequired: false,
  },
  {
    day: 8,
    date: "June 21, 2025",
    stop: "Kotor",
    country: "Montenegro",
    lat: 42.4,
    lng: 18.8,
    driveHours: 1.5,
    highlights: ["Hike to Kotor Fortress for bay views", "Medieval Old Town — UNESCO-listed", "Bay of Kotor sunset cruise"],
    decisionRequired: true,
  },
  {
    day: 9,
    date: "June 22, 2025",
    stop: "Tirana",
    country: "Albania",
    lat: 41.3,
    lng: 19.8,
    driveHours: 4.0,
    highlights: ["Skanderbeg Square and the colourful building facades", "Bunk'Art 2 — art museum inside a Cold War bunker", "Pazari i Ri (New Bazaar) for byrek and fresh produce"],
    decisionRequired: true,
  },
  {
    day: 10,
    date: "June 23, 2025",
    stop: "Ohrid",
    country: "N. Macedonia",
    lat: 41.1,
    lng: 20.8,
    driveHours: 3.0,
    highlights: ["Church of St. John at Kaneo — iconic clifftop chapel", "Lake Ohrid boat trip", "Old Bazaar and Samuel's Fortress"],
    decisionRequired: false,
  },
  {
    day: 11,
    date: "June 24, 2025",
    stop: "Thessaloniki",
    country: "Greece",
    lat: 40.6,
    lng: 22.9,
    driveHours: 3.5,
    highlights: ["White Tower waterfront walk", "Ano Poli (Upper Town) Byzantine walls", "Best bougatsa breakfast in Greece"],
    decisionRequired: false,
  },
  {
    day: 12,
    date: "June 25, 2025",
    stop: "Meteora",
    country: "Greece",
    lat: 39.7,
    lng: 21.6,
    driveHours: 3.0,
    highlights: ["Monastery of Great Meteoron at golden hour", "Varlaam Monastery frescoes", "Hiking trail between the rock pillars"],
    decisionRequired: true,
  },
  {
    day: 13,
    date: "June 26, 2025",
    stop: "Delphi",
    country: "Greece",
    lat: 38.5,
    lng: 22.5,
    driveHours: 4.0,
    highlights: ["Temple of Apollo and the Sacred Way", "Delphi Archaeological Museum", "Castalian Spring and the Tholos of Athena"],
    decisionRequired: false,
  },
  {
    day: 14,
    date: "June 27, 2025",
    stop: "Athens",
    country: "Greece",
    lat: 37.9,
    lng: 23.7,
    driveHours: 2.0,
    highlights: ["Acropolis and Parthenon at sunrise", "Plaka neighbourhood lunch", "Rooftop bar with Acropolis views for the final night"],
    decisionRequired: false,
  },
];

// ─── Route Decisions ────────────────────────────────────────────────────────

export const ROUTE_DECISIONS: RouteDecision[] = [
  {
    id: "decision-ljubljana",
    dayIndex: 2, // Day 3 — Ljubljana
    title: "Ljubljana Overnight: Short or Long Stay?",
    question:
      "We've arrived in Ljubljana — honestly one of the most underrated capitals in Europe. You have some flexibility here. Do you want to push straight through to Zagreb tomorrow, linger an extra day to explore Lake Bled, or take the scenic Soča Valley detour?",
    options: [
      {
        id: "straight-to-zagreb",
        label: "On to Zagreb",
        description: "Leave Ljubljana tomorrow morning as planned.",
        consequence: "Keeps the schedule tight. You'll arrive in Zagreb with a full afternoon to explore.",
      },
      {
        id: "lake-bled-detour",
        label: "Lake Bled detour",
        description: "Add a half-day side trip to Lake Bled before continuing south.",
        consequence: "Adds ~2 driving hours but Lake Bled is genuinely bucket-list. Zagreb arrival pushed to evening.",
      },
      {
        id: "soca-valley",
        label: "Soča Valley swing",
        description: "Head west to the emerald Soča River valley before looping back south.",
        consequence: "Adds a full day — you'd skip Zagreb or compress time in Split. Worth it if rivers over cities.",
      },
    ],
  },
  {
    id: "decision-plitvice",
    dayIndex: 4, // Day 5 — Plitvice
    title: "Plitvice: One Loop or Two?",
    question:
      "Plitvice Lakes is the crown jewel of Croatia's national parks. The question is how deep to go. There's the classic Lower Lakes loop (~2 hours), the full Upper + Lower circuit (~4–5 hours), or just a quick highlight pass if you'd rather save energy for Split.",
    options: [
      {
        id: "lower-loop",
        label: "Lower Lakes loop",
        description: "The classic 2-hour loop — Veliki Slap, the big lake, the boardwalks.",
        consequence: "Leaves afternoon free for a relaxed drive to Split with a coastal detour possible.",
      },
      {
        id: "full-circuit",
        label: "Full Upper + Lower circuit",
        description: "The complete 4–5 hour hike through all 16 lakes.",
        consequence: "Arrive in Split after dark. Worth every minute if you love hiking and water.",
      },
    ],
  },
  {
    id: "decision-split",
    dayIndex: 5, // Day 6 — Split
    title: "Split: Island Day Trip?",
    question:
      "Split is one of those cities you keep finding reasons to stay in. The decision: do you take the ferry to Hvar or Brač for a day trip, or stay on the mainland and get to Dubrovnik at a relaxed pace tomorrow?",
    options: [
      {
        id: "hvar-daytrip",
        label: "Hvar day trip",
        description: "Ferry over to Hvar Town — lavender fields, a Venetian fortress, and famous nightlife.",
        consequence: "Full day on Hvar. Drive to Dubrovnik the next morning instead of this evening.",
      },
      {
        id: "brac-daytrip",
        label: "Brač & Zlatni Rat",
        description: "Ferry to Brač to see the famous horn-shaped Zlatni Rat beach.",
        consequence: "Back by mid-afternoon. Possible to make Dubrovnik by evening if you push it.",
      },
      {
        id: "stay-mainland",
        label: "Stay in Split",
        description: "Spend the day inside Diocletian's Palace and the Marjan Hill park.",
        consequence: "Relaxed pace, early start for Dubrovnik. No ferry logistics to manage.",
      },
    ],
  },
  {
    id: "decision-kotor",
    dayIndex: 7, // Day 8 — Kotor
    title: "Kotor: Perast and the Islets?",
    question:
      "Kotor Bay is spectacular but the real gem might be Perast — a tiny Baroque village 10 km north with two islets you can row to. It's a 2-hour detour. Worth folding in, or straight to the fortress hike?",
    options: [
      {
        id: "perast-detour",
        label: "Perast + islets",
        description: "Drive to Perast first, take a boat to Our Lady of the Rocks, then double back to Kotor.",
        consequence: "Adds 2 hours. Kotor fortress hike pushed to late afternoon — sunset from the top.",
      },
      {
        id: "kotor-only",
        label: "Focus on Kotor",
        description: "Skip Perast and spend the full day in Kotor — fortress, Old Town, and the bay.",
        consequence: "More relaxed pace. Morning fortress hike with better light. Evening for the waterfront.",
      },
    ],
  },
  {
    id: "decision-tirana",
    dayIndex: 8, // Day 9 — Tirana
    title: "Albania: Tirana or Coastal Detour?",
    question:
      "Albania is the wildcard of this route — most people don't expect to love it as much as they do. Tirana is the plan, but the Albanian Riviera is technically reachable if you're willing to make it an overnight. Thoughts?",
    options: [
      {
        id: "tirana-direct",
        label: "Straight to Tirana",
        description: "Follow the route — Tirana is genuinely fascinating and easy to navigate.",
        consequence: "Arrives by early afternoon. Full evening in the city for nightlife and the Bunk'Art bunker.",
      },
      {
        id: "riviera-overnight",
        label: "Albanian Riviera overnight",
        description: "Swing south to Dhermi or Himara on the Ionian coast before heading to Ohrid.",
        consequence: "Adds a day and significant driving, but the coastline rivals anything in the Adriatic.",
      },
    ],
  },
  {
    id: "decision-meteora",
    dayIndex: 11, // Day 12 — Meteora
    title: "Meteora: Sunrise or Sunset?",
    question:
      "You can't do Meteora wrong, but timing matters. The monasteries open at 9am so you can catch them in morning light, or you can save the viewpoints for late afternoon when the crowds thin and the rock pillars glow gold. What's the move?",
    options: [
      {
        id: "morning-monasteries",
        label: "Morning monasteries",
        description: "Hit Great Meteoron and Varlaam right when they open. Fewer crowds, cooler temperature.",
        consequence: "Afternoon free for the hiking trail and the village of Kalambaka. Leave for Delphi by 4pm.",
      },
      {
        id: "sunset-viewpoints",
        label: "Sunset viewpoints",
        description: "Spend the morning relaxing, then drive the viewpoint road in late afternoon golden hour.",
        consequence: "Spectacular light for photos. You'll want to stay the night rather than drive to Delphi in the dark.",
      },
    ],
  },
];

// ─── Ember Follow-Up Sequences ───────────────────────────────────────────────

export const EMBER_SEQUENCES: Record<string, EmberMessage[]> = {
  // Ljubljana
  "decision-ljubljana|straight-to-zagreb": [
    { text: "Smart call — Zagreb has a great Old Town and the Museum of Broken Relationships is genuinely one of the best small museums in Europe. I'll keep us on schedule.", delayMs: 800 },
    { text: "Fair warning: the drive from Ljubljana to Zagreb is quick but the Zagreb-to-Plitvice leg is where it gets beautiful. I'll flag a great pull-off spot on the way.", delayMs: 2200 },
  ],
  "decision-ljubljana|lake-bled-detour": [
    { text: "Excellent. Lake Bled with the island church and the castle above it — it's one of those places that looks fake it's so perfect.", delayMs: 800 },
    { text: "I'll plan the Bled loop for the morning: castle first for the view, then rowboat to the island, then back on the road by 1pm. Zagreb by dinner.", delayMs: 2000 },
  ],
  "decision-ljubljana|soca-valley": [
    { text: "Bold move — the Soča is absolutely worth it. That water color is unlike anything else in Europe.", delayMs: 800 },
    { text: "We'll need to trim time somewhere. I'd suggest compressing Zagreb to a lunch stop and driving straight to Split the following day. I can build out that adjusted itinerary.", delayMs: 2000 },
  ],
  // Plitvice
  "decision-plitvice|lower-loop": [
    { text: "Good plan. The Lower Lakes are the most dramatic anyway — Veliki Slap and the turquoise main lake are the standouts.", delayMs: 800 },
    { text: "That gives us time for the coastal highway into Split, which is one of the best drives of the whole trip. I'll route us via Primošten for a coffee stop.", delayMs: 2200 },
  ],
  "decision-plitvice|full-circuit": [
    { text: "Respect. The Upper Lakes are quieter and genuinely beautiful — you'll have the boardwalks mostly to yourself up there.", delayMs: 800 },
    { text: "I'll book us into Split late-check-in accommodation and we'll drive the last stretch after dark. The Dalmatian coast highway at night has its own thing going on.", delayMs: 2200 },
  ],
  // Split
  "decision-split|hvar-daytrip": [
    { text: "Hvar is worth every minute of the ferry. The town is gorgeous and the Spanjola fortress view over the harbor is one of my favourites on this whole route.", delayMs: 800 },
    { text: "First ferry leaves Split at 8am — I'll set an alarm. We'll hit Dubrovnik the morning after.", delayMs: 1800 },
  ],
  "decision-split|brac-daytrip": [
    { text: "Zlatni Rat is iconic for good reason. That triangular beach that shifts shape with the current — it's legitimately unusual.", delayMs: 800 },
    { text: "We can make Dubrovnik by evening if we catch the 3pm ferry back. I'll keep an eye on the schedule.", delayMs: 1800 },
  ],
  "decision-split|stay-mainland": [
    { text: "Solid call — Diocletian's Palace is one of the best-preserved Roman sites in the world and people rush through it. Taking time is the right move.", delayMs: 800 },
    { text: "I'll route us along the Makarska Riviera tomorrow morning on the way to Dubrovnik. That coastal road is spectacular.", delayMs: 2000 },
  ],
  // Kotor
  "decision-kotor|perast-detour": [
    { text: "Perast is one of those places that sounds like I made it up. Baroque palaces on the water, two tiny islands you row to — it's real and it's magical.", delayMs: 800 },
    { text: "We'll do Perast in the morning, back to Kotor by noon, fortress hike in the afternoon. Sunset from the top of the walls is the plan.", delayMs: 2200 },
  ],
  "decision-kotor|kotor-only": [
    { text: "The right call if you want to breathe. Kotor's Old Town is dense with good stuff and the morning light on the bay is something else.", delayMs: 800 },
    { text: "I'd suggest the fortress hike first thing — cooler and the views are best before the haze builds. Waterfront lunch after.", delayMs: 2000 },
  ],
  // Tirana
  "decision-tirana|tirana-direct": [
    { text: "Tirana is going to surprise you. It's chaotic and colourful and the Bunk'Art bunker is genuinely one of the most affecting museums I've come across on this route.", delayMs: 800 },
    { text: "Arriving early means we can walk the Pazari i Ri market before it winds down. Byrek for lunch is mandatory.", delayMs: 2000 },
  ],
  "decision-tirana|riviera-overnight": [
    { text: "The Albanian Riviera is one of Europe's last undiscovered coastlines. Dhermi especially — dramatic cliffs, clear water, zero crowds.", delayMs: 800 },
    { text: "I'll re-route: Tirana becomes a morning stop, then south to Dhermi for the night, then east to Ohrid the day after. Adds about 90 minutes of driving total but it's worth it.", delayMs: 2400 },
  ],
  // Meteora
  "decision-meteora|morning-monasteries": [
    { text: "Great Meteoron opens at 9am — if we're there at 9:02 we beat the tour buses by a full hour.", delayMs: 800 },
    { text: "I'll plan the Varlaam monastery right after — it's the most ornate and the frescoes in the ossuary are unlike anything else. Lunch in Kalambaka, then on the trail.", delayMs: 2400 },
  ],
  "decision-meteora|sunset-viewpoints": [
    { text: "The golden hour light on those rock pillars is actually unreal. You're making the right call for photography.", delayMs: 800 },
    { text: "We'll stay the night in Kalambaka. Early start for Delphi tomorrow — it's a long haul but the mountain road through Epirus is one of the more dramatic drives of the trip.", delayMs: 2400 },
  ],
};

// ─── Canned Free-Text Replies ────────────────────────────────────────────────

export const CANNED_REPLIES: string[] = [
  "Good question! This part of the route has a lot of flexibility. The main thing to watch is driving time — most of these legs are under 3 hours, so you have real room to improvise.",
  "That's one of the things I love about this route. You're passing through six countries in two weeks, and each one has its own vibe. The transitions happen fast — one valley and you're somewhere completely different.",
  "Totally reasonable concern. I'd say the biggest wildcard is the Albanian border crossing — can add 45 minutes to an hour depending on the day. Everything else on this route is smooth.",
  "Honestly, the 'hidden gem' answer is Kotor. People know Dubrovnik, but Kotor Bay is quieter, more affordable, and the medieval walls are just as impressive. Don't rush through it.",
  "The food shift is real — once you cross into Greece, the cuisine changes completely. Thessaloniki especially is worth eating your way through. Best bougatsa and souvlaki on the route.",
  "For accommodation, I'd prioritise booking ahead in Dubrovnik and Split — those fill up fast in June. Everywhere else you have flexibility to be spontaneous if you want it.",
  "If you could only do one detour on this whole trip, I'd say Lake Bled or Meteora. Both are those places that look like a screensaver but are somehow even better in person.",
];
