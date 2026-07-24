"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FilterType } from "@/lib/inbox-data";

const filters: { id: FilterType; label: string; count?: number }[] = [
  { id: "all", label: "All", count: 24 },
  { id: "unread", label: "Unread", count: 8 },
  { id: "ai-needs-help", label: "AI Needs Help", count: 3 },
  { id: "bookings", label: "Bookings", count: 5 },
  { id: "vip", label: "VIP", count: 4 },
  { id: "resolved", label: "Resolved", count: 12 },
  { id: "assigned", label: "Assigned" },
];

interface FilterChipsProps {
  active: FilterType;
  onChange: (filter: FilterType) => void;
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-hidden">
      {filters.map((f) => (
        <motion.button
          key={f.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(f.id)}
          className={cn(
            "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium whitespace-nowrap",
            "transition-all duration-200",
            active === f.id
              ? "bg-foreground text-background"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {f.label}
          {f.count !== undefined && (
            <span className={cn(
              "text-[10px] tabular-nums",
              active === f.id ? "opacity-60" : "opacity-40",
            )}>
              {f.count}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
