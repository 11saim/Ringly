"use client";

import { cn } from "@/lib/utils";

export type InboxFilter = "all" | "unread" | "assigned" | "resolved";

const filters: { id: InboxFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "assigned", label: "Assigned" },
  { id: "resolved", label: "Resolved" },
];

interface FilterChipsProps {
  active: InboxFilter;
  onChange: (filter: InboxFilter) => void;
  counts: Record<InboxFilter, number>;
}

export function FilterChips({ active, onChange, counts }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-1 px-4 pb-3">
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
          <span className={cn(
            "text-[10px] tabular-nums",
            active === f.id ? "text-white/70" : "opacity-40",
          )}>
            {counts[f.id]}
          </span>
        </button>
      ))}
    </div>
  );
}
