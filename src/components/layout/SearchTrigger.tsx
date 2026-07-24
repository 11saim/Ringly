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
        "flex items-center gap-2.5 rounded-[10px] px-3 py-1.5 text-[13px]",
        "text-muted-foreground/50",
        "border border-transparent",
        "transition-all duration-200 ease-out",
        "hover:text-foreground/70 hover:bg-hover-bg hover:border-border/40",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        className,
      )}
      aria-label="Search (Ctrl+K)"
    >
      <Search size={15} strokeWidth={1.5} className="shrink-0 opacity-60" />
      <span className="opacity-60">Search...</span>
      <kbd
        className={cn(
          "ml-2 flex items-center gap-0.5 rounded-md border border-border/30",
          "bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] font-medium",
          "text-muted-foreground/35",
        )}
      >
        <span className="text-[9px]">&#8984;</span>K
      </kbd>
    </button>
  );
}
