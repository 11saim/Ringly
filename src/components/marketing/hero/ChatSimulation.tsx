"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { CheckCircle2 } from "lucide-react";

interface Message {
  id: number;
  side: "left" | "right";
  content: string;
  timestamp: string;
  isAction?: boolean;
}

const MESSAGES: Omit<Message, "id">[] = [
  {
    side: "left",
    content: "Hi, do you have an appointment for a haircut today at 5pm?",
    timestamp: "5:02 PM",
  },
  {
    side: "right",
    content: "Let me check... Yes! We have Sarah available at 5:00 PM today. Shall I book it for you?",
    timestamp: "5:02 PM",
  },
  {
    side: "left",
    content: "Yes please.",
    timestamp: "5:03 PM",
  },
  {
    side: "right",
    content: "✅ Booking Confirmed\nAppointment with Sarah at 5:00 PM today.\nA confirmation has been sent.",
    timestamp: "5:03 PM",
    isAction: true,
  },
  {
    side: "left",
    content: "Thank you!",
    timestamp: "5:03 PM",
  },
  {
    side: "right",
    content: "You're welcome! We'll send you a reminder an hour before your appointment. See you at 5!",
    timestamp: "5:03 PM",
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-[5px] h-[5px] rounded-full bg-white/50"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isRight = message.side === "right";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isRight ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] px-3 py-2 text-[12.5px] leading-[16px] rounded-2xl whitespace-pre-line ${
          isRight
            ? "bg-[#005C4B] text-[#E9EDEF] rounded-br-md"
            : "bg-[#202C33] text-[#E9EDEF] rounded-bl-md"
        }`}
      >
        {message.isAction ? (
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0 mt-0.5" />
            <span>{message.content}</span>
          </div>
        ) : (
          <span>{message.content}</span>
        )}
        <span className="block text-right mt-1">
          <span className="text-[10px] text-white/50">{message.timestamp}</span>
          {isRight && (
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="inline-block ml-1">
              <path d="M11.071 0.653L5.071 6.653L3.071 4.653" stroke="#53BDEB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.071 0.653L8.071 6.653L7.071 5.653" stroke="#53BDEB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>
    </motion.div>
  );
}

export function ChatSimulation() {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addNextMessage = useCallback(() => {
    if (currentIndex >= MESSAGES.length) return;

    const nextMsg = MESSAGES[currentIndex];
    const isFromAI = nextMsg.side === "right";

    if (isFromAI && currentIndex > 0) {
      setShowTyping(true);
      timeoutRef.current = setTimeout(() => {
        setShowTyping(false);
        setVisibleMessages((prev) => [...prev, { ...nextMsg, id: currentIndex }]);
        setCurrentIndex((prev) => prev + 1);
      }, 800);
    } else {
      setVisibleMessages((prev) => [...prev, { ...nextMsg, id: currentIndex }]);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex === 0) {
      timeoutRef.current = setTimeout(addNextMessage, 800);
      return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }

    if (currentIndex >= MESSAGES.length) return;

    const delay = currentIndex <= 2 ? 1600 : 2000;
    timeoutRef.current = setTimeout(addNextMessage, delay);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [currentIndex, addNextMessage]);

  return (
    <div className="flex flex-col h-full">
      {/* Date header */}
      <div className="flex justify-center py-2">
        <div className="bg-[#182229] text-[#8696A0] text-[11px] px-3 py-1 rounded-lg shadow-sm">
          TODAY
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 px-3 pb-3 space-y-[6px] overflow-hidden">
        <AnimatePresence mode="sync">
          {visibleMessages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        {showTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start"
          >
            <div className="bg-[#202C33] rounded-2xl rounded-bl-md px-3 py-1">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
