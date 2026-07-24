"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, active = false, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "relative grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground",
          "hover:bg-hover hover:text-foreground transition-colors",
          active && "bg-hover text-foreground",
          className,
        )}
        {...props}
      >
        {icon}
        {label && (
          <span className="sr-only">{label}</span>
        )}
      </button>
    );
  },
);
IconButton.displayName = "IconButton";
