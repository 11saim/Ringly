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
        "px-6 pt-8 pb-6 sm:px-10 sm:pt-10 sm:pb-8 md:px-10 md:pt-10 md:pb-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
