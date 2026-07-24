"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchTriggerProps {
  onClick?: () => void;
  className?: string;
}

export function SearchTrigger({ onClick, className }: SearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1 text-[13px]",
        "text-muted-foreground/60",
        "transition-all duration-150 ease-out",
        "hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        className,
      )}
      aria-label="Search (Ctrl+K)"
    >
      <Search size={14} strokeWidth={1.8} className="shrink-0" />
      <span className="opacity-60">Search...</span>
      <kbd
        className={cn(
          "ml-1 flex items-center gap-0.5 rounded border border-border/50",
          "bg-muted/50 px-1 py-px font-mono text-[10px] font-medium",
          "text-muted-foreground/35",
        )}
      >
        <span className="text-[9px]">&#8984;</span>K
      </kbd>
    </button>
  );
}
