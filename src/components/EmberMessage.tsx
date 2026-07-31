import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message"

interface EmberMessageProps {
  text: string
}

export function EmberMessage({ text }: EmberMessageProps) {
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
            <BubbleContent>{text}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </motion.div>
  )
}
