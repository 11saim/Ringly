"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeading({
  title,
  description,
  action,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn("mb-6 flex items-baseline justify-between", className)}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}
