"use client";

import { cn } from "@/lib/utils";
import type { FilterType } from "@/lib/inbox-data";

const filters: { id: FilterType; label: string; count?: number }[] = [
  { id: "all", label: "All", count: 24 },
  { id: "unread", label: "Unread", count: 8 },
  { id: "bookings", label: "Bookings", count: 5 },
  { id: "vip", label: "VIP", count: 4 },
  { id: "resolved", label: "Resolved", count: 12 },
];

interface FilterChipsProps {
  active: FilterType;
  onChange: (filter: FilterType) => void;
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-hidden">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={cn(
            "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium whitespace-nowrap",
            "transition-all duration-150",
            active === f.id
              ? "bg-accent text-white"
              : "bg-muted/50 text-muted-foreground/60 hover:bg-muted hover:text-foreground/70 border border-border/20",
          )}
        >
          {f.label}
          {f.count !== undefined && (
            <span className={cn(
              "text-[10px] tabular-nums",
              active === f.id ? "text-white/70" : "opacity-40",
            )}>
              {f.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
