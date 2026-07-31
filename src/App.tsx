import { useCallback, useEffect, useRef, useState } from "react";

import { AppHeader } from "@/components/AppHeader";
import { ChatPanel, type ChatMessage } from "@/components/ChatPanel";
import { MapPanel } from "@/components/MapPanel";
import {
  CANNED_REPLIES,
  EMBER_SEQUENCES,
  ITINERARY,
  ROUTE_DECISIONS,
} from "@/data/mock-itinerary";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentDay, setCurrentDay] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isEmberTyping, setIsEmberTyping] = useState(false);
  const [decidedDays, setDecidedDays] = useState<Set<number>>(new Set());
  const [cannedReplyIndex, setCannedReplyIndex] = useState(0);

  // Collect all timeout IDs so we can clear them on unmount
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutRefs.current.push(id);
    return id;
  }, []);

  const addEmberMessage = useCallback(
    (text: string, extra?: Partial<ChatMessage>) => {
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "ember", text, ...extra },
      ]);
    },
    [],
  );

  // ── Initial mount sequence ──────────────────────────────────────────────
  useEffect(() => {
    schedule(() => setIsEmberTyping(true), 1500);

    schedule(() => {
      setIsEmberTyping(false);
      addEmberMessage(
        "Hey! I'm Ember, your AI travel co-pilot. We've got 14 days and roughly 3,500 km ahead of us — Venice to Athens through six countries. I've mapped out the full route and I'll flag the big decisions as we go. Ready to roll? 🗺️",
      );
    }, 2300);

    schedule(() => setIsEmberTyping(true), 3500);

    schedule(() => {
      setIsEmberTyping(false);
      addEmberMessage(
        "We're starting in Venice — no driving today, just soaking it in. Grand Canal gondola ride, Piazza San Marco at dusk, a cicchetti bar crawl through Cannaregio. I'll start flagging decisions when we hit Ljubljana on Day 3.",
      );
    }, 4300);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeoutRefs.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Day change ─────────────────────────────────────────────────────────
  const handleDayChange = useCallback(
    (day: number) => {
      setCurrentDay(day);

      const entry = ITINERARY[day - 1];
      if (!entry.decisionRequired) return;
      if (decidedDays.has(day)) return;

      const decision = ROUTE_DECISIONS.find((d) => d.dayIndex === day - 1);
      if (!decision) return;

      schedule(() => setIsEmberTyping(true), 1200);

      schedule(() => {
        setIsEmberTyping(false);
        addEmberMessage(decision.question, { decisionId: decision.id });
      }, 2000);
    },
    [decidedDays, addEmberMessage, schedule],
  );

  // ── Stop click (delegate to handleDayChange) ───────────────────────────
  const handleStopClick = useCallback(
    (day: number) => {
      handleDayChange(day);
    },
    [handleDayChange],
  );

  // ── Decision resolved ──────────────────────────────────────────────────
  const handleDecide = useCallback(
    (msgId: string, optionId: string) => {
      // Find the decision message to get the decisionId
      let decisionId: string | undefined;

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== msgId) return m;
          decisionId = m.decisionId;
          return { ...m, chosenOptionId: optionId };
        }),
      );

      setDecidedDays((prev) => new Set(prev).add(currentDay));

      // We need the decisionId synchronously — read it from state directly
      // by searching messages (we captured it in the map above via closure)
      // Find the decision to get the chosen option's label
      setTimeout(() => {
        // After state flush, find the decision
        const decision = ROUTE_DECISIONS.find((d) => d.id === decisionId);
        if (!decision) return;

        const chosenOption = decision.options.find((o) => o.id === optionId);
        if (!chosenOption) return;

        // Add user message with chosen option label immediately
        setMessages((prev) => [
          ...prev,
          { id: makeId(), role: "user", text: chosenOption.label },
        ]);

        // Queue Ember follow-up sequence
        const sequenceKey = `${decision.id}|${optionId}`;
        const followUps = EMBER_SEQUENCES[sequenceKey] ?? [];

        followUps.forEach((followUp) => {
          schedule(
            () => {
              setIsEmberTyping(false);
              addEmberMessage(followUp.text);
            },
            800 + followUp.delayMs,
          );
        });

        // Show typing indicator before the first follow-up
        if (followUps.length > 0) {
          schedule(() => setIsEmberTyping(true), 400);
        }
      }, 0);
    },
    [currentDay, addEmberMessage, schedule],
  );

  // ── Free-text send ─────────────────────────────────────────────────────
  const handleSend = useCallback(
    (text: string) => {
      // Add user message immediately
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "user", text },
      ]);

      schedule(() => setIsEmberTyping(true), 1000);

      schedule(() => {
        setIsEmberTyping(false);
        const reply = CANNED_REPLIES[cannedReplyIndex % CANNED_REPLIES.length];
        addEmberMessage(reply);
        setCannedReplyIndex((prev) => prev + 1);
      }, 2000);
    },
    [cannedReplyIndex, addEmberMessage, schedule],
  );

  // ─── Layout ─────────────────────────────────────────────────────────────

  const dayLabel = `Day ${currentDay} · ${ITINERARY[currentDay - 1].stop}, ${ITINERARY[currentDay - 1].country}`;

  return (
    <div className="flex flex-col h-dvh bg-background">
      <AppHeader dayLabel={dayLabel} />

      {/* Body: map + chat */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        {/* ── Mobile map strip (visible only below md) ── */}
        <div className="md:hidden h-40 shrink-0 border-b border-border">
          <MapPanel
            currentDay={currentDay}
            onDayChange={handleDayChange}
            onStopClick={handleStopClick}
          />
        </div>

        {/* ── Desktop left panel: map (55%) ── */}
        <div className="hidden md:flex md:w-[55%] flex-col border-r border-border">
          <MapPanel
            currentDay={currentDay}
            onDayChange={handleDayChange}
            onStopClick={handleStopClick}
          />
        </div>

        {/* ── Right panel: chat (fills remaining space) ── */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatPanel
            messages={messages}
            isEmberTyping={isEmberTyping}
            onSend={handleSend}
            onDecide={handleDecide}
          />
        </div>
      </div>
    </div>
  );
}
