import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  style,
  ...props
}: ComponentProps<"div"> & {
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
}) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2",
        vertical ? "flex-col" : "flex-row",
        !vertical && "[gap:var(--gap)]",
        className
      )}
      style={
        {
          "--duration": "40s",
          "--gap": "1rem",
          ...style,
        } as React.CSSProperties
      }
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 justify-start [gap:var(--gap)]",
              vertical ? "flex-col" : "flex-row",
              !vertical && pauseOnHover && "group-hover:[animation-play-state:paused]"
            )}
            style={{
              animation: `marquee-${vertical ? "vertical" : reverse ? "horizontal-reverse" : "horizontal"} var(--duration) linear infinite`,
            }}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

export { Marquee };
