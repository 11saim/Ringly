"use client";

import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 mb-4">
        <Icon size={20} strokeWidth={1.5} className="text-muted-foreground/40" />
      </div>
      <h3 className="text-[14px] font-semibold text-foreground mb-1">
        {title}
      </h3>
      <p className="text-[13px] text-muted-foreground/50 max-w-[240px] leading-relaxed mb-4">
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-[13px] font-medium",
            "bg-foreground text-background",
            "transition-all duration-200",
            "hover:opacity-90 hover:shadow-[var(--shadow-card-hover)]",
            "active:scale-[0.98]",
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
