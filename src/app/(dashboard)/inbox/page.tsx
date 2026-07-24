"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/app/Sidebar";
import { CommandPalette } from "@/components/app/CommandPalette";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConversationList } from "@/components/inbox/ConversationList";
import { MessageThread } from "@/components/inbox/MessageThread";
import { AIPanel } from "@/components/inbox/AIPanel";
import { conversations } from "@/lib/inbox-data";

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string | null>("c1");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />

      <main
        className="min-h-screen flex flex-col"
        style={{ marginLeft: isMobile ? 0 : "var(--sidebar-width)" }}
      >
        {/* 3-Column Layout */}
        <div className="flex flex-1 min-h-0" style={{ height: "100vh" }}>
          {/* Left: Conversation List */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex flex-col border-r border-border/30 bg-card",
              isMobile ? "w-full" : "w-[340px] shrink-0",
            )}
          >
            {/* List Header */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center justify-between">
                <h1 className="text-[18px] font-bold text-foreground tracking-[-0.02em]">Inbox</h1>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-medium text-muted-foreground/40 tabular-nums">
                    {conversations.filter((c) => c.unread > 0).length} unread
                  </span>
                </div>
              </div>
            </div>

            <ConversationList
              activeId={activeId}
              onSelect={setActiveId}
            />
          </motion.div>

          {/* Center: Message Thread */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex-1 min-w-0 bg-background"
          >
            <MessageThread conversationId={activeId} />
          </motion.div>

          {/* Right: AI Panel */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="w-[320px] shrink-0 border-l border-border/30 bg-card"
            >
              <AIPanel conversationId={activeId} />
            </motion.div>
          )}
        </div>
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
