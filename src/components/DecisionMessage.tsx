import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message"
import type { RouteDecision } from "@/data/mock-itinerary"

interface DecisionMessageProps {
  decision: RouteDecision
  chosenOptionId: string | null
  onChoose: (optionId: string) => void
}

export function DecisionMessage({
  decision,
  chosenOptionId,
  onChoose,
}: DecisionMessageProps) {
  const isDecided = chosenOptionId !== null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Message align="start">
        <MessageAvatar>
          <Avatar>
            <AvatarFallback className="bg-fuego-500 text-white text-xs">
              EM
            </AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Ember</MessageHeader>
          <Bubble variant="secondary">
            <BubbleContent>{decision.question}</BubbleContent>
          </Bubble>
          <div className="flex flex-col gap-2 mt-1">
            {decision.options.map((option, index) => {
              const isChosen = option.id === chosenOptionId
              const isRecommended = index === 0

              return (
                <button
                  key={option.id}
                  disabled={isDecided}
                  onClick={() => onChoose(option.id)}
                  className={[
                    // base — match Button variant="outline" size="sm" layout
                    "inline-flex shrink-0 items-start gap-1.5 rounded-md border px-3 py-2 text-sm font-medium text-left",
                    "transition-all outline-none",
                    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "disabled:pointer-events-none disabled:opacity-50",
                    // chosen vs. default outline styling
                    isChosen
                      ? "border-[#ff6200] bg-orange-50 text-[#ff6200]"
                      : "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
                  ]
                    .join(" ")
                    .trim()}
                >
                  <span className="flex flex-col gap-0.5 min-w-0">
                    <span className="flex items-center gap-1.5 flex-wrap">
                      {isChosen && (
                        <span className="shrink-0" aria-label="Selected">
                          ✓
                        </span>
                      )}
                      <span>{option.label}</span>
                      {isRecommended && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 h-4 shrink-0 bg-fuego-50 text-fuego-600 border-fuego-200"
                        >
                          ✦ Ember suggests
                        </Badge>
                      )}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground leading-snug">
                      {option.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </MessageContent>
      </Message>
    </motion.div>
  )
}
