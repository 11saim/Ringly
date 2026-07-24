"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { conversations, type FilterType } from "@/lib/inbox-data";
import { FilterChips } from "./FilterChips";
import { ConversationRow } from "./ConversationRow";

interface ConversationListProps {
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({ activeId, onSelect }: ConversationListProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      return c.customer.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
    }
    switch (filter) {
      case "unread": return c.unread > 0;
      case "ai-needs-help": return c.handler === "ai" && c.status === "pending";
      case "bookings": return c.hasBooking;
      case "vip": return c.customer.tags.includes("VIP");
      case "resolved": return c.status === "resolved";
      case "assigned": return !!c.assignedTo;
      default: return true;
    }
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full rounded-[10px] border border-border/30 bg-muted/40 py-2 pl-9 pr-8 text-[13px]",
              "text-foreground placeholder:text-muted-foreground/40",
              "transition-all duration-200",
              "focus:outline-none focus:border-border/60 focus:bg-muted/60",
            )}
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground/40 hover:text-foreground hover:bg-hover-bg transition-colors">
            <SlidersHorizontal size={13} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterChips active={filter} onChange={setFilter} />

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 scrollbar-thin">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.03 } },
          }}
          className="space-y-0.5"
        >
          {filtered.map((c) => (
            <motion.div
              key={c.id}
              variants={{
                hidden: { opacity: 0, y: 4 },
                show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
              }}
            >
              <ConversationRow
                conversation={c}
                isActive={activeId === c.id}
                onClick={() => onSelect(c.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-[13px] font-medium text-muted-foreground/50">No conversations found</p>
            <p className="text-[12px] text-muted-foreground/35 mt-1">Try a different filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
