import { useState, useRef, type KeyboardEvent } from "react"
import { ROUTE_DECISIONS } from "@/data/mock-itinerary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller"
import { DecisionMessage } from "@/components/DecisionMessage"
import { EmberMessage } from "@/components/EmberMessage"
import { TypingIndicator } from "@/components/TypingIndicator"
import { UserMessage } from "@/components/UserMessage"

export interface ChatMessage {
  id: string
  role: "ember" | "user"
  text: string
  decisionId?: string       // if this is a decision prompt, holds the RouteDecision id
  chosenOptionId?: string   // set when user picks an option on a decision
}

interface ChatPanelProps {
  messages: ChatMessage[]
  isEmberTyping: boolean
  onSend: (text: string) => void
  onDecide: (msgId: string, optionId: string) => void
}

export function ChatPanel({
  messages,
  isEmberTyping,
  onSend,
  onDecide,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    onSend(trimmed)
    setInputValue("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable message area */}
      <div className="flex-1 min-h-0">
        <MessageScrollerProvider>
          <MessageScroller className="h-full">
            <MessageScrollerViewport className="px-4 py-4">
              <MessageScrollerContent>
                {messages.map((msg) => (
                  <MessageScrollerItem key={msg.id}>
                    {msg.role === "ember" && msg.decisionId ? (
                      (() => {
                        const decision = ROUTE_DECISIONS.find(
                          (d) => d.id === msg.decisionId
                        )
                        return decision ? (
                          <DecisionMessage
                            decision={decision}
                            chosenOptionId={msg.chosenOptionId ?? null}
                            onChoose={(optionId) => onDecide(msg.id, optionId)}
                          />
                        ) : (
                          <EmberMessage text={msg.text} />
                        )
                      })()
                    ) : msg.role === "ember" ? (
                      <EmberMessage text={msg.text} />
                    ) : (
                      <UserMessage text={msg.text} />
                    )}
                  </MessageScrollerItem>
                ))}

                {isEmberTyping && (
                  <MessageScrollerItem scrollAnchor>
                    <TypingIndicator />
                  </MessageScrollerItem>
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>

            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>

      {/* Fixed input footer */}
      <div className="shrink-0 border-t border-border bg-background px-4 py-3">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Ember anything about the route…"
            className="flex-1"
            aria-label="Message Ember"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
