"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Archive, UserPlus, CheckCheck, MoreHorizontal } from "lucide-react";
import type { Conversation } from "@/lib/inbox-data";

interface ConversationRowProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationRow({ conversation, isActive, onClick }: ConversationRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const c = conversation;
  const hasUnread = c.unread > 0;

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        "group flex w-full items-start gap-3 px-3 py-3 text-left rounded-[10px] mx-1 relative",
        "transition-all duration-150",
        isActive
          ? "bg-accent/[0.06] shadow-[inset_0_0_0_1px_rgba(34,197,94,0.12)]"
          : "hover:bg-hover-bg/60",
        hasUnread && !isActive && "bg-accent/[0.02]",
      )}
      aria-label={`Conversation with ${c.customer.name}`}
      aria-current={isActive ? "true" : undefined}
    >
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-accent" />
      )}

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-[12px] text-[12px] font-semibold transition-all duration-150",
          hasUnread
            ? "bg-accent text-white"
            : "bg-muted text-foreground/50",
          isActive && !hasUnread && "bg-accent/10 text-accent",
        )}>
          {c.customer.initials}
        </div>
        {c.customer.online && (
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={cn(
            "text-[13px] truncate",
            hasUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80",
          )}>
            {c.customer.name}
          </span>
          <span className={cn(
            "text-[11px] whitespace-nowrap tabular-nums",
            hasUnread ? "text-foreground/50 font-medium" : "text-muted-foreground/35",
          )}>
            {c.lastMessageTime}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            "text-[12px] truncate leading-snug",
            hasUnread ? "text-foreground/60" : "text-muted-foreground/45",
          )}>
            {c.lastMessage}
          </p>
          {hasUnread && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shrink-0">
              {c.unread}
            </span>
          )}
        </div>

        {/* Typing Indicator */}
        {c.isTyping && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex gap-[3px] items-center h-3">
              <span className="h-[4px] w-[4px] rounded-full bg-accent/60 animate-typing-dot" style={{ animationDelay: "0ms" }} />
              <span className="h-[4px] w-[4px] rounded-full bg-accent/60 animate-typing-dot" style={{ animationDelay: "200ms" }} />
              <span className="h-[4px] w-[4px] rounded-full bg-accent/60 animate-typing-dot" style={{ animationDelay: "400ms" }} />
            </div>
            <span className="text-[10px] text-muted-foreground/40 font-medium">typing</span>
          </div>
        )}
      </div>

      {/* Hover Actions */}
      <AnimatePresence>
        {isHovered && !isActive && (
          <motion.div
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.1 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-card rounded-[8px] border border-border/30 px-1 py-0.5 shadow-[var(--shadow-card)]"
          >
            {[
              { icon: Archive, label: "Archive" },
              { icon: UserPlus, label: "Assign" },
              { icon: CheckCheck, label: "Mark read" },
              { icon: MoreHorizontal, label: "More" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={(e) => { e.stopPropagation(); }}
                className="flex h-6 w-6 items-center justify-center rounded-[6px] text-muted-foreground/40 transition-all duration-100 hover:bg-hover-bg hover:text-foreground"
                title={label}
              >
                <Icon size={11} strokeWidth={1.5} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
