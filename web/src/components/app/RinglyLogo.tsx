"use client";

import { cn } from "@/lib/utils";

interface RinglyLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  collapsed?: boolean;
}

export function RinglyLogo({
  size = "md",
  showText = true,
  collapsed = false,
}: RinglyLogoProps) {
  const sizeMap = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-9 w-9",
  };

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "relative grid shrink-0 place-items-center rounded-md",
          "bg-[var(--cedar)] text-white font-mono font-bold",
          "shadow-sm",
          "transition-all duration-200",
          sizeMap[size],
          collapsed && "h-9 w-9",
        )}
      >
        <span className="text-sm font-bold leading-none">R</span>
      </div>
      {showText && !collapsed && (
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
          Ringly
        </span>
      )}
    </div>
  );
}
