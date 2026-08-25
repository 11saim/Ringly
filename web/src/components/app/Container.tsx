"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "7xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export function Container({
  maxWidth = "7xl",
  padding = "md",
  className,
  ...props
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-5xl",
    "2xl": "max-w-6xl",
    "4xl": "max-w-5xl",
    "6xl": "max-w-7xl",
    "7xl": "max-w-[1400px]",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "p-0",
    sm: "px-4 py-4 sm:px-6 sm:py-6",
    md: "px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10",
    lg: "px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className,
      )}
      {...props}
    />
  );
}
