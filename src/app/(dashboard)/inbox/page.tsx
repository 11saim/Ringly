"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/app/Sidebar";
import { CommandPalette } from "@/components/app/CommandPalette";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-store";
import { ConversationList } from "@/components/inbox/ConversationList";
import { MessageThread } from "@/components/inbox/MessageThread";
import { CustomerInfoPanel } from "@/components/inbox/CustomerInfoPanel";

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string | null>("c1");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(true);
  const isMobile = useIsMobile();
  const [collapsed] = useSidebarCollapsed();

  const sidebarWidth = isMobile ? 0 : collapsed ? 80 : 296;

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    if (isMobile) setRightOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />

      <main
        className="flex flex-col h-screen transition-all duration-200 ease-out"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* ── 3-Column Layout ── */}
        <div className="flex flex-1 min-h-0">
          {/* Column 1: Conversation List */}
          <div
            className={cn(
              "flex flex-col border-r border-border/40 bg-card shrink-0",
              isMobile ? "w-full" : "w-[340px]",
            )}
          >
            <ConversationList activeId={activeId} onSelect={handleSelect} />
          </div>

          {/* Column 2: Message Thread */}
          <div className="flex-1 min-w-0">
            <MessageThread
              conversationId={activeId}
              onToggleRight={() => setRightOpen((o) => !o)}
              rightOpen={rightOpen}
            />
          </div>

          {/* Column 3: Customer Info */}
          {!isMobile && activeId && rightOpen && (
            <div className="w-[320px] shrink-0 border-l border-border/40 bg-card">
              <CustomerInfoPanel conversationId={activeId} onClose={() => setRightOpen(false)} />
            </div>
          )}
        </div>
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
