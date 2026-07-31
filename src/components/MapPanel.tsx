import { RouteMap } from "@/components/RouteMap";
import { Button } from "@/components/ui/button";
import { ITINERARY } from "@/data/mock-itinerary";

// ─── Props ───────────────────────────────────────────────────────────────────

interface MapPanelProps {
  currentDay: number;
  onDayChange: (day: number) => void;
  onStopClick: (day: number) => void;
}

// ─── DayControls ─────────────────────────────────────────────────────────────

function DayControls({
  currentDay,
  onDayChange,
}: {
  currentDay: number;
  onDayChange: (day: number) => void;
}) {
  const entry = ITINERARY[currentDay - 1];
  const label = `Day ${currentDay} of 14 · ${entry.stop}, ${entry.country}`;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-background">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDayChange(currentDay - 1)}
        disabled={currentDay === 1}
        aria-label="Previous day"
      >
        ← Prev
      </Button>

      <span className="text-sm font-medium text-center flex-1 truncate">
        {label}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onDayChange(currentDay + 1)}
        disabled={currentDay === 14}
        aria-label="Next day"
      >
        Next →
      </Button>
    </div>
  );
}

// ─── MapPanel ─────────────────────────────────────────────────────────────────

export function MapPanel({ currentDay, onDayChange, onStopClick }: MapPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* RouteMap fills all remaining space above the controls */}
      <div className="flex-1 min-h-0">
        <RouteMap currentDay={currentDay} onStopClick={onStopClick} />
      </div>

      {/* DayControls anchored to the bottom */}
      <DayControls currentDay={currentDay} onDayChange={onDayChange} />
    </div>
  );
}
