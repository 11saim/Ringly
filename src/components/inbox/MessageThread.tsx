"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip, Smile, Send, Image as ImageIcon,
  MoreHorizontal, Phone, Video, Archive, Clock,
  MessageSquare, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { activeConversationMessages, conversations, type Message } from "@/lib/inbox-data";
import { MessageBubble } from "./MessageBubble";

interface MessageThreadProps {
  conversationId: string | null;
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(activeConversationMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevConvId = useRef<string | null>(conversationId);

  const conversation = conversations.find((c) => c.id === conversationId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (prevConvId.current !== conversationId && conversationId) {
      setMessages(activeConversationMessages);
    }
    prevConvId.current = conversationId;
  }, [conversationId]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      sender: "agent",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: "Today",
      type: "text",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiReply: Message = {
        id: `m${Date.now() + 1}`,
        sender: "ai",
        text: "Thanks for your message! I'm processing your request and will get back to you shortly.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: "Today",
        type: "text",
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1500);
  };

  // Empty state
  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-muted mb-5">
            <MessageSquare size={28} strokeWidth={1.2} className="text-muted-foreground/30" />
          </div>
          <h3 className="text-[16px] font-semibold text-foreground mb-1.5">Select a conversation</h3>
          <p className="text-[13px] text-muted-foreground/45 max-w-[260px] leading-relaxed">
            Choose a conversation from the left to start messaging.
          </p>
        </motion.div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentGroup: { date: string; messages: Message[] } | null = null;
  messages.forEach((msg) => {
    if (!currentGroup || currentGroup.date !== msg.date) {
      currentGroup = { date: msg.date, messages: [msg] };
      groupedMessages.push(currentGroup);
    } else {
      currentGroup.messages.push(msg);
    }
  });

  const actionButtons = [
    { icon: Phone, label: "Call" },
    { icon: Video, label: "Video" },
    { icon: ExternalLink, label: "WhatsApp" },
    { icon: Archive, label: "Archive" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* ── Fixed Header ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-card/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-muted text-[12px] font-semibold text-foreground/60">
              {conversation.customer.initials}
            </div>
            {conversation.customer.online && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-accent" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-foreground">{conversation.customer.name}</h3>
              <span className="text-[11px] text-muted-foreground/40">{conversation.customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {conversation.customer.tags.map((tag) => (
                <span key={tag} className={cn(
                  "rounded-full px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-wider border",
                  tag === "VIP"
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/15"
                    : "bg-muted text-muted-foreground/50 border-border/30",
                )}>
                  {tag}
                </span>
              ))}
              <span className="text-[10px] text-muted-foreground/25">·</span>
              <div className="flex items-center gap-1">
                <Clock size={9} strokeWidth={1.5} className="text-muted-foreground/30" />
                <span className="text-[10px] text-muted-foreground/35">{conversation.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          {actionButtons.map(({ icon: Icon, label }) => (
            <button
              key={label}
              title={label}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground/40",
                "transition-all duration-150 hover:bg-hover-bg hover:text-foreground",
              )}
            >
              <Icon size={15} strokeWidth={1.5} />
            </button>
          ))}
          <div className="w-px h-5 bg-border/20 mx-1" />
          <button
            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground/40 transition-all duration-150 hover:bg-hover-bg hover:text-foreground"
          >
            <MoreHorizontal size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* ── Scrollable Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 scrollbar-premium chat-bg">
        {groupedMessages.map((group) => (
          <div key={group.date}>
            {/* Date Separator */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-border/25" />
              <span className="text-[10px] font-medium text-muted-foreground/35 uppercase tracking-wider px-2">
                {group.date}
              </span>
              <div className="flex-1 h-px bg-border/25" />
            </div>

            {group.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-start gap-2 my-3"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-muted mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-light/60" />
              </div>
              <div className="rounded-[16px] rounded-bl-[4px] bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-typing-dot" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-typing-dot" style={{ animationDelay: "200ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-typing-dot" style={{ animationDelay: "400ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Fixed Composer ── */}
      <div className="px-5 py-3 border-t border-border/40 bg-card/60 shrink-0">
        <div className="flex items-end gap-2">
          {/* Left Actions */}
          <div className="flex items-center gap-0.5 shrink-0">
            {[
              { icon: Paperclip, label: "Attach" },
              { icon: ImageIcon, label: "Image" },
              { icon: Smile, label: "Emoji" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                title={label}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] text-muted-foreground/40 transition-all duration-150 hover:bg-hover-bg hover:text-foreground"
              >
                <Icon size={16} strokeWidth={1.5} />
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="relative flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className={cn(
                "w-full resize-none rounded-[16px] border border-border/30 bg-muted/20 px-4 py-3 pr-24 text-[13px]",
                "text-foreground placeholder:text-muted-foreground/35",
                "transition-all duration-200",
                "focus:outline-none focus:border-accent/30 focus:bg-muted/40 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.06)]",
                "max-h-32",
              )}
              style={{ minHeight: "46px" }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-0.5">
              <button
                onClick={handleSend}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-[10px] transition-all duration-200",
                  inputValue.trim()
                    ? "bg-accent text-white shadow-[0_2px_8px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_12px_rgba(34,197,94,0.4)]"
                    : "bg-muted text-muted-foreground/30",
                )}
              >
                <Send size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard Hints */}
        <div className="flex items-center gap-3 mt-2 px-1">
          <span className="text-[10px] text-muted-foreground/25">
            <kbd className="font-mono">Enter</kbd> to send
          </span>
          <span className="text-[10px] text-muted-foreground/25">
            <kbd className="font-mono">Shift+Enter</kbd> for new line
          </span>
        </div>
      </div>
    </div>
  );
}
