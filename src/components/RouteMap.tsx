import { motion } from "framer-motion";
import { ITINERARY } from "@/data/mock-itinerary";

// ─── Props ───────────────────────────────────────────────────────────────────

interface RouteMapProps {
  currentDay: number;
  onStopClick: (day: number) => void;
}

// ─── Stop coordinates (pre-computed from lat/lng projection) ─────────────────
// svgX = (lng - 12) / (24 - 12) * 600
// svgY = (1 - (lat - 36) / (46 - 36)) * 500

const STOPS: { x: number; y: number }[] = [
  { x: 15,  y: 46  }, // Venice
  { x: 90,  y: 36  }, // Trieste
  { x: 125, y: 11  }, // Ljubljana
  { x: 200, y: 26  }, // Zagreb
  { x: 180, y: 71  }, // Plitvice
  { x: 220, y: 141 }, // Split
  { x: 305, y: 190 }, // Dubrovnik
  { x: 340, y: 200 }, // Kotor
  { x: 390, y: 255 }, // Tirana
  { x: 440, y: 265 }, // Ohrid
  { x: 545, y: 290 }, // Thessaloniki
  { x: 480, y: 335 }, // Meteora
  { x: 525, y: 395 }, // Delphi
  { x: 585, y: 425 }, // Athens
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function polylinePoints(stops: { x: number; y: number }[]): string {
  return stops.map((s) => `${s.x},${s.y}`).join(" ");
}

// ─── Country fill paths (simplified polygon approximations) ──────────────────
// Coordinates are in SVG space (0–600 x, 0–500 y).

const COUNTRY_PATHS = [
  {
    // Italy — boot-ish shape, just the upper/north part visible in our bounds
    label: "Italy",
    fill: "#e8d5b7",
    d: "M 0,80 L 0,200 L 30,260 L 50,300 L 80,320 L 100,290 L 90,240 L 70,200 L 80,160 L 60,120 L 40,80 Z",
  },
  {
    // Slovenia, Croatia, Bosnia, Serbia, Montenegro — Balkans corridor
    label: "Balkans",
    fill: "#d9c9a8",
    d: "M 90,0 L 280,0 L 380,60 L 350,130 L 300,180 L 340,210 L 360,260 L 300,280 L 240,300 L 180,280 L 150,220 L 120,180 L 70,160 L 60,120 L 80,80 Z",
  },
  {
    // Albania & N. Macedonia
    label: "AlbaniaMacedonia",
    fill: "#d0c4a0",
    d: "M 340,210 L 460,230 L 480,280 L 440,310 L 380,320 L 320,300 L 300,280 L 360,260 Z",
  },
  {
    // Greece
    label: "Greece",
    fill: "#dcc9a0",
    d: "M 440,280 L 600,260 L 600,500 L 400,500 L 380,430 L 420,380 L 460,350 L 480,300 Z",
  },
];

// ─── ActivePulse — Framer Motion pulse ring for the active stop ───────────────

function ActivePulse({ x, y }: { x: number; y: number }) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={10}
      fill="none"
      stroke="#ff6200"
      strokeWidth={2}
      animate={{
        scale: [1, 1.8, 1],
        opacity: [0.8, 0, 0.8],
      }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    />
  );
}

// ─── StopMarker ───────────────────────────────────────────────────────────────

function StopMarker({
  stop,
  index,
  currentDay,
  onStopClick,
}: {
  stop: { x: number; y: number };
  index: number;
  currentDay: number;
  onStopClick: (day: number) => void;
}) {
  const day = index + 1; // days are 1-based
  const isVisited = day < currentDay;
  const isActive = day === currentDay;
  const isFuture = day > currentDay;

  const label = ITINERARY[index].stop;

  // Decide which side to place the label to avoid clipping
  const labelAnchor = stop.x > 520 ? "end" : "start";
  const labelDx = stop.x > 520 ? -8 : 8;

  return (
    <g
      key={index}
      onClick={() => onStopClick(day)}
      style={{ cursor: "pointer" }}
      aria-label={`Day ${day}: ${label}`}
    >
      {/* Pulse ring for active stop (rendered underneath the fill circle) */}
      {isActive && <ActivePulse x={stop.x} y={stop.y} />}

      {/* Main circle */}
      <circle
        cx={stop.x}
        cy={stop.y}
        r={5}
        fill={isVisited || isActive ? "#ff6200" : "none"}
        stroke={isFuture ? "#ece9e4" : "#ff6200"}
        strokeWidth={isFuture ? 1.5 : 2}
      />

      {/* Label */}
      <text
        x={stop.x + labelDx}
        y={stop.y + 1}
        textAnchor={labelAnchor}
        dominantBaseline="middle"
        fontSize={9}
        fontWeight={isActive ? "700" : "400"}
        fill={
          isActive
            ? "#1b1a18"
            : isVisited
              ? "#57544d"
              : "#adaaa3"
        }
        style={{ userSelect: "none", pointerEvents: "none" }}
      >
        {label}
      </text>
    </g>
  );
}

// ─── RouteMap ─────────────────────────────────────────────────────────────────

export function RouteMap({ currentDay, onStopClick }: RouteMapProps) {
  // All 14 stops as a polyline string
  const fullRoutePoints = polylinePoints(STOPS);

  // Traveled portion: stop index 0 → currentDay - 1 (0-based)
  const traveledStops = STOPS.slice(0, currentDay);
  const traveledPoints = polylinePoints(traveledStops);

  return (
    <svg
      viewBox="0 0 600 500"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Venice to Athens route map"
    >
      {/* ── Layer 1: Sea / background ─────────────────────────────────── */}
      <rect width="600" height="500" fill="#d4e8f0" />

      {/* ── Layer 2: Country fills ────────────────────────────────────── */}
      {COUNTRY_PATHS.map((cp) => (
        <path
          key={cp.label}
          d={cp.d}
          fill={cp.fill}
          stroke="#c8b898"
          strokeWidth={0.75}
          strokeLinejoin="round"
        />
      ))}

      {/* ── Layer 3: Full dashed route polyline ───────────────────────── */}
      <polyline
        points={fullRoutePoints}
        fill="none"
        stroke="#ff6200"
        strokeWidth={2}
        strokeDasharray="6 3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.45}
      />

      {/* ── Layer 4: Traveled route overlay (solid) ───────────────────── */}
      {traveledStops.length > 1 && (
        <polyline
          points={traveledPoints}
          fill="none"
          stroke="#ff6200"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* ── Layer 5 & 6: Stop markers (includes active pulse) ─────────── */}
      {STOPS.map((stop, i) => (
        <StopMarker
          key={i}
          stop={stop}
          index={i}
          currentDay={currentDay}
          onStopClick={onStopClick}
        />
      ))}
    </svg>
  );
}
