interface AppHeaderProps {
  dayLabel: string;
}

export function AppHeader({ dayLabel }: AppHeaderProps) {
  return (
    <header className="w-full border-b-2 border-[#ff6200] bg-background px-4 py-3 flex items-center justify-between gap-4">
      {/* Left: trip title */}
      <div className="flex-shrink-0">
        <span className="font-bold text-foreground tracking-tight text-sm sm:text-base">
          Venice → Athens
        </span>
      </div>

      {/* Center: current day label */}
      <div className="flex-1 text-center">
        <span className="text-sm text-muted-foreground font-medium truncate">
          {dayLabel}
        </span>
      </div>

      {/* Right: Ember status badge */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {/* Animated status dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6200] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6200]" />
        </span>
        <span className="text-sm font-medium text-foreground">
          Ember
        </span>
        <span className="text-sm text-muted-foreground">·</span>
        <span className="text-sm text-[#ff6200] font-medium">Active</span>
      </div>
    </header>
  );
}
