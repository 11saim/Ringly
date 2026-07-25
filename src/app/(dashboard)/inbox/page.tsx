"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/app/Sidebar";
import { CommandPalette } from "@/components/app/CommandPalette";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-store";
import { ConversationList } from "@/components/inbox/ConversationList";
import { MessageThread } from "@/components/inbox/MessageThread";
import { AIPanel } from "@/components/inbox/AIPanel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { NotificationButton } from "@/components/app/NotificationButton";

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string | null>("c1");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isMobile = useIsMobile();
  const [collapsed] = useSidebarCollapsed();

  const sidebarWidth = isMobile ? 0 : collapsed ? 80 : 296;

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
        {/* ── Page Header (consistent with all pages) ── */}
        <header
          className={cn(
            "sticky top-0 z-30 flex h-[60px] shrink-0 items-center justify-between",
            "border-b border-border bg-card/80 backdrop-blur-md",
            "px-8",
          )}
        >
          <div className="flex h-full items-center">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/inbox"
                    className="text-sm font-semibold text-foreground"
                  >
                    Inbox
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex h-full items-center gap-1">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={cn(
                "hidden sm:flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm",
                "border border-border bg-muted/50 text-muted-foreground",
                "transition-all duration-150 ease-out",
                "hover:border-border-strong hover:bg-muted hover:text-foreground",
              )}
            >
              <Search size={15} strokeWidth={1.8} className="shrink-0 opacity-50" />
              <span className="opacity-60">Search...</span>
              <kbd
                className={cn(
                  "ml-2 flex items-center gap-0.5 rounded-md border border-border/80",
                  "bg-card px-1.5 py-0.5 font-mono text-[10px] font-medium",
                  "text-muted-foreground/50",
                )}
              >
                <span className="text-[11px]">&#8984;</span>K
              </kbd>
            </button>

            <div className="mx-2 h-5 w-px bg-border" />

            <NotificationButton />
            <ThemeToggle />

            <div className="mx-1 h-5 w-px bg-border" />

            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent transition-all duration-150 hover:ring-border-strong">
              <AvatarImage src="/vercel.svg" alt="User" />
              <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
                AN
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* ── 3-Column Layout ── */}
        <div className="flex flex-1 min-h-0">
          {/* Column 1: Conversation List */}
          <div
            className={cn(
              "flex flex-col border-r border-border/40 bg-card shrink-0",
              isMobile ? "w-full" : "w-[340px]",
            )}
          >
            <ConversationList activeId={activeId} onSelect={setActiveId} />
          </div>

          {/* Column 2: Message Thread */}
          <div className="flex-1 min-w-0">
            <MessageThread conversationId={activeId} />
          </div>

          {/* Column 3: Customer Insights */}
          {!isMobile && (
            <div className="w-[340px] shrink-0 border-l border-border/40 bg-card">
              <AIPanel conversationId={activeId} />
            </div>
          )}
        </div>
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
