"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { conversations } from "@/lib/inbox-data";
import { FilterChips, type InboxFilter } from "./FilterChips";
import { ConversationRow } from "./ConversationRow";

interface ConversationListProps {
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({ activeId, onSelect }: ConversationListProps) {
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => ({
    all: conversations.length,
    unread: conversations.filter((c) => c.unread > 0).length,
    assigned: conversations.filter((c) => !!c.assignedTo).length,
    resolved: conversations.filter((c) => c.status === "resolved").length,
  }), []);

  const filtered = useMemo(() => {
    return conversations
      .filter((c) => {
        if (search) {
          const q = search.toLowerCase();
          return c.customer.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
        }
        switch (filter) {
          case "unread": return c.unread > 0;
          case "assigned": return !!c.assignedTo;
          case "resolved": return c.status === "resolved";
          default: return true;
        }
      });
  }, [filter, search]);

  const pinned = filtered.filter((c) => c.isPinned);
  const unpinned = filtered.filter((c) => !c.isPinned);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold text-foreground tracking-[-0.01em]">Inbox</h1>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent/10 px-1.5 text-[10px] font-bold text-accent tabular-nums">
              {counts.unread}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/35 group-focus-within:text-accent transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full rounded-[12px] border border-border/30 bg-muted/30 py-2.5 pl-9 pr-9 text-[13px]",
              "text-foreground placeholder:text-muted-foreground/35",
              "transition-all duration-200",
              "focus:outline-none focus:border-accent/30 focus:bg-muted/50 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.06)]",
            )}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground/30 hover:text-foreground hover:bg-hover-bg transition-colors"
            >
              <X size={12} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <FilterChips active={filter} onChange={setFilter} counts={counts} />

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 scrollbar-premium">
        {pinned.length > 0 && (
          <div className="mb-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5">
              <Pin size={10} strokeWidth={1.5} className="text-muted-foreground/30" />
              <span className="text-[10px] font-semibold text-muted-foreground/35 uppercase tracking-wider">Pinned</span>
            </div>
            {pinned.map((c) => (
              <ConversationRow key={c.id} conversation={c} isActive={activeId === c.id} onClick={() => onSelect(c.id)} />
            ))}
          </div>
        )}

        <div className="space-y-0.5">
          {unpinned.map((c) => (
            <ConversationRow key={c.id} conversation={c} isActive={activeId === c.id} onClick={() => onSelect(c.id)} />
          ))}
        </div>

        {/* Empty State */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-muted/50 mb-4">
                <Search size={22} strokeWidth={1.5} className="text-muted-foreground/25" />
              </div>
              <p className="text-[13px] font-semibold text-foreground/60 mb-1">No conversations found</p>
              <p className="text-[12px] text-muted-foreground/40 max-w-[200px] leading-relaxed">
                {search ? "Try a different search term" : "No conversations match this filter"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
