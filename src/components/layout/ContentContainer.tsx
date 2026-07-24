import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface ContentContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ContentContainer({
  children,
  className,
  ...props
}: ContentContainerProps) {
  return (
    <div
      className={cn(
        "w-full",
        "px-6 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-8 md:px-10 md:pt-8 md:pb-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
