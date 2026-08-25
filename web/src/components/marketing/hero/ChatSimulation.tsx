"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Sender = "user" | "agent";

interface ChatMessage {
  id: string;
  from: Sender;
  text: string;
  time: string;
}

const SCRIPT: ChatMessage[] = [
  { id: "m1", from: "user", text: "Hi, I'd like to book a haircut for tomorrow.", time: "10:14 AM" },

  { id: "m2", from: "agent", text: "Sure! I'd be happy to help.", time: "10:14 AM" },
  { id: "m3", from: "agent", text: "We have slots available at 11:00 AM, 2:30 PM and 5:00 PM. Which works best for you?", time: "10:14 AM" },

  { id: "m4", from: "user", text: "2:30 PM please.", time: "10:15 AM" },

  { id: "m5", from: "agent", text: "Perfect! May I have your name for the booking?", time: "10:15 AM" },

  { id: "m6", from: "user", text: "Ali Khan", time: "10:15 AM" },

  { id: "m7", from: "agent", text: "Thanks, Ali!", time: "10:15 AM" },
  { id: "m8", from: "agent", text: "Your haircut has been booked for tomorrow at 2:30 PM.", time: "10:15 AM" },

  { id: "m9", from: "user", text: "How much does it cost?", time: "10:16 AM" },

  { id: "m10", from: "agent", text: "A standard haircut is Rs. 1,500.", time: "10:16 AM" },
  { id: "m11", from: "agent", text: "You'll receive a WhatsApp reminder 2 hours before your appointment.", time: "10:16 AM" },

  { id: "m12", from: "user", text: "Awesome, thank you!", time: "10:17 AM" },

  { id: "m13", from: "agent", text: "You're welcome! We look forward to seeing you tomorrow 😊", time: "10:17 AM" },
];

const TYPING_DELAY = 800;
const READ_DELAY = 1200;
const LOOP_PAUSE = 3000;

function TypingBubble({ side }: { side: Sender }) {
  const isUser = side === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mt-2`}>
      <div
        className="flex items-center gap-[2px] px-2 py-2 rounded-[7px]"
        style={{
          background: isUser ? "#005C4B" : "#202C33",
          borderTopLeftRadius: isUser ? 8 : 2,
          borderTopRightRadius: isUser ? 2 : 8,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[4px] h-[4px] rounded-full"
            style={{ background: isUser ? "#8FC9AE" : "#8696A0" }}
          />
        ))}
      </div>
    </div>
  );
}

function CheckMarks() {
  return (
    <svg width="14" height="9" viewBox="0 0 16 11" fill="none" className="shrink-0">
      <path d="M1 5.5L4.5 9L11 1.5" stroke="#53BDEB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 5.5L9 9L15.5 1.5" stroke="#53BDEB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BubbleTail({ side }: { side: "left" | "right" }) {
  if (side === "right") {
    return (
      <svg
        className="absolute -right-[7px] top-0"
        width="8"
        height="13"
        viewBox="0 0 8 13"
        aria-hidden="true"
      >
        <path
          d="M0 0 H8 L4.5 4.5 C3.4 5.8 2.8 7.2 2.5 8.9 C2.2 10.5 1.4 11.8 0 13 V0Z"
          fill="#005C4B"
        />
      </svg>
    );
  }

  return (
    <svg
      className="absolute -left-[7px] top-0"
      width="8"
      height="13"
      viewBox="0 0 8 13"
      aria-hidden="true"
    >
      <path
        d="M8 0 H0 L3.5 4.5 C4.6 5.8 5.2 7.2 5.5 8.9 C5.8 10.5 6.6 11.8 8 13 V0Z"
        fill="#202C33"
      />
    </svg>
  );
}

function Bubble({ msg, isFirstInGroup }: { msg: ChatMessage; isFirstInGroup: boolean }) {
  const isUser = msg.from === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-2" : "mt-[2px]"}`}
    >
      <div
        className="relative max-w-[82%] px-3 pt-2 pb-1.5"
        style={{
          background: isUser ? "#005C4B" : "#202C33",
          borderTopLeftRadius: isUser ? 8 : isFirstInGroup ? 2 : 8,
          borderTopRightRadius: isUser ? (isFirstInGroup ? 2 : 8) : 8,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        {isFirstInGroup && <BubbleTail side={isUser ? "right" : "left"} />}

        <p
          className="text-white text-[10.5px] leading-[15px]"
          style={{ wordBreak: "break-word" }}
        >
          {msg.text}
        </p>

        <div className="flex justify-end items-center gap-1">
          <span
            className="text-[9px]"
            style={{ color: isUser ? "#8FC9AE" : "#8696A0" }}
          >
            {msg.time}
          </span>
          {isUser && <CheckMarks />}
        </div>
      </div>
    </div>
  );
}

export function ChatSimulation() {
  const [visible, setVisible] = useState<ChatMessage[]>([]);
  const [typingFor, setTypingFor] = useState<Sender | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      if (el.scrollHeight > el.clientHeight) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    function schedule(fn: () => void, delay: number) {
      const t = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
      timeouts.current.push(t);
    }

    function runLoop() {
      setVisible([]);
      setTypingFor(null);
      let elapsed = 500;

      SCRIPT.forEach((msg, i) => {
        elapsed += i === 0 ? 0 : TYPING_DELAY;
        schedule(() => setTypingFor(msg.from), elapsed);
        elapsed += TYPING_DELAY;
        schedule(() => {
          setTypingFor(null);
          setVisible((prev) => [...prev, msg]);
        }, elapsed);
        elapsed += READ_DELAY;
      });

      schedule(runLoop, elapsed + LOOP_PAUSE);
    }

    runLoop();
    return () => {
      cancelled = true;
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [visible, typingFor, scrollToBottom]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden px-[10px] py-[12px] flex flex-col scrollbar-none">
      {/* TODAY header */}
      <div className="flex justify-center mb-2">
        <div
          className="text-[#8696A0] text-[9px] px-2 py-0.5 rounded-md"
          style={{ background: "#182229" }}
        >
          TODAY
        </div>
      </div>
        {visible.map((msg, i) => {
          const prevMsg = i > 0 ? visible[i - 1] : null;
          const isFirstInGroup = !prevMsg || prevMsg.from !== msg.from;
          return (
            <Bubble key={msg.id} msg={msg} isFirstInGroup={isFirstInGroup} />
          );
        })}
        {typingFor && <TypingBubble key="typing" side={typingFor} />}
    </div>
  );
}
