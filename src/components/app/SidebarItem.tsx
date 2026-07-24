"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/navigation";

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  collapsed?: boolean;
}

export function SidebarItem({ item, isActive, collapsed = false }: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex items-center gap-3 rounded-[10px] px-3 py-2 text-[13px] font-medium",
        "sidebar-item-transition",
        "group",
        isActive
          ? cn(
              "bg-accent/[0.06] text-foreground",
              "shadow-[inset_0_0_0_1px_rgba(34,197,94,0.08)]",
              "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
              "before:h-4 before:w-[2px] before:rounded-full before:bg-accent",
              "before:shadow-[0_0_6px_rgba(34,197,94,0.3)]",
            )
          : cn(
              "text-muted-foreground",
              "hover:bg-hover-bg hover:text-foreground",
              "hover:translate-x-[1px]",
            ),
        collapsed && "justify-center px-0 py-2.5",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        size={18}
        strokeWidth={isActive ? 1.8 : 1.5}
        className={cn(
          "shrink-0 transition-all duration-150",
          isActive
            ? "text-accent"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      />

      {!collapsed && (
        <>
          <span className="truncate leading-none">{item.label}</span>

          {item.shortcut && (
            <kbd
              className={cn(
                "ml-auto text-[10px] font-mono uppercase tracking-wider",
                "text-muted-foreground/30",
                "opacity-0 transition-opacity duration-150",
                "group-hover:opacity-100",
                isActive && "text-accent/40 opacity-100",
              )}
            >
              {item.shortcut}
            </kbd>
          )}

          {item.badge && (
            <span
              className={cn(
                "ml-auto flex h-[18px] min-w-[18px] items-center justify-center",
                "rounded-full bg-accent px-1 text-[10px] font-bold text-white",
                "animate-badge-pop",
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}
