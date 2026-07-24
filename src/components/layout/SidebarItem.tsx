"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/navigation";

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
}

export function SidebarItem({ item, isActive }: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex h-[36px] items-center gap-[10px] rounded-md pl-[10px] pr-2.5 text-[13px]",
        "transition-colors duration-150 ease-out",
        isActive
          ? cn(
              "bg-[#f0f0f0] font-medium text-foreground",
              "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
              "before:h-3.5 before:w-[2px] before:rounded-full before:bg-accent",
            )
          : cn(
              "font-normal text-muted-foreground",
              "hover:bg-hover-bg hover:text-foreground",
            ),
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        size={15}
        strokeWidth={isActive ? 1.8 : 1.5}
        className={cn(
          "shrink-0 transition-colors duration-150",
          "ml-px",
          isActive
            ? "text-accent"
            : "text-muted-foreground/50 group-hover:text-foreground",
        )}
      />
      <span className="truncate leading-none">{item.label}</span>
    </Link>
  );
}
