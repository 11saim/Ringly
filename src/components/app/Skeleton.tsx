"use client";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      {...props}
    />
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[20px] border border-border/30 bg-card p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-[10px]" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg mb-2" />
      <Skeleton className="h-3 w-16 rounded-md" />
    </div>
  );
}

function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 px-5 py-3", className)}>
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-28 rounded-md" />
        <Skeleton className="h-3 w-48 rounded-md" />
      </div>
      <Skeleton className="h-3 w-10 rounded-md" />
    </div>
  );
}

function SkeletonTimeline({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-0", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3">
          <Skeleton className="h-2.5 w-2.5 rounded-full shrink-0" />
          <Skeleton className="h-3 w-16 rounded-md" />
          <div className="flex-1">
            <Skeleton className="h-3.5 w-32 rounded-md" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonRow, SkeletonTimeline };
