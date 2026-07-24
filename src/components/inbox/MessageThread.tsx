"use client";

import { useState, useRef, useEffect } from "react";
import {
  Paperclip, Smile, Mic, Send, Sparkles, Wand2, Image as ImageIcon,
  MoreHorizontal, Phone, Video, Archive, UserPlus, Tag,
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

  // Reset messages when conversation changes (not on initial mount)
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

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-muted/50 mb-4">
          <Send size={24} strokeWidth={1.5} className="text-muted-foreground/30" />
        </div>
        <h3 className="text-[16px] font-semibold text-foreground mb-1">Select a conversation</h3>
        <p className="text-[13px] text-muted-foreground/50 max-w-[240px] leading-relaxed">
          Choose a conversation from the left panel to start messaging.
        </p>
      </div>
    );
  }

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

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground/60">
              {conversation.customer.initials}
            </div>
            {conversation.customer.online && (
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-foreground">{conversation.customer.name}</h3>
              <span className="text-[11px] text-muted-foreground/40">{conversation.customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {conversation.customer.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground/50">
                  {tag}
                </span>
              ))}
              <span className="text-[10px] text-muted-foreground/35">•</span>
              <span className="text-[10px] text-muted-foreground/35">{conversation.assignedTo}</span>
              <span className="text-[10px] text-muted-foreground/35">•</span>
              <span className="text-[10px] text-muted-foreground/35">{conversation.customer.lastSeen}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {[
            { icon: Phone, label: "Call" },
            { icon: Video, label: "Video" },
            { icon: Archive, label: "Archive" },
            { icon: UserPlus, label: "Assign" },
            { icon: Tag, label: "Tags" },
            { icon: MoreHorizontal, label: "More" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              title={label}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground/40 transition-all hover:bg-hover-bg hover:text-foreground"
            >
              <Icon size={15} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
        {groupedMessages.map((group) => (
          <div key={group.date}>
            {/* Date divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border/30" />
              <span className="text-[10px] font-medium text-muted-foreground/35 uppercase tracking-wider">{group.date}</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>

            {group.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-2 my-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/[0.06] mt-0.5">
              <Sparkles size={10} strokeWidth={1.5} className="text-primary-light" />
            </div>
            <div className="rounded-[16px] rounded-bl-[4px] bg-muted px-4 py-3">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="px-5 py-4 border-t border-border/30">
        <div className="flex items-end gap-2">
          <div className="flex items-center gap-0.5 shrink-0">
            <button className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground/40 transition-all hover:bg-hover-bg hover:text-foreground">
              <Paperclip size={15} strokeWidth={1.5} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground/40 transition-all hover:bg-hover-bg hover:text-foreground">
              <ImageIcon size={15} strokeWidth={1.5} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground/40 transition-all hover:bg-hover-bg hover:text-foreground">
              <Smile size={15} strokeWidth={1.5} />
            </button>
          </div>

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
                "w-full resize-none rounded-[14px] border border-border/30 bg-muted/30 px-4 py-2.5 pr-24 text-[13px]",
                "text-foreground placeholder:text-muted-foreground/40",
                "transition-all duration-200",
                "focus:outline-none focus:border-border/50 focus:bg-muted/50",
                "max-h-32",
              )}
              style={{ minHeight: "40px" }}
            />
            <div className="absolute right-2 bottom-1.5 flex items-center gap-0.5">
              <button className="flex h-7 items-center gap-1 rounded-[8px] px-2 text-[11px] font-medium text-primary-light/60 transition-all hover:bg-primary/[0.06] hover:text-primary-light">
                <Wand2 size={12} strokeWidth={1.5} />
                AI
              </button>
              <button className="flex h-7 items-center gap-1 rounded-[8px] px-2 text-[11px] font-medium text-muted-foreground/40 transition-all hover:bg-hover-bg hover:text-foreground">
                <Mic size={12} strokeWidth={1.5} />
              </button>
              <button
                onClick={handleSend}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-[8px] transition-all",
                  inputValue.trim()
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : "bg-muted text-muted-foreground/40",
                )}
              >
                <Send size={12} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
