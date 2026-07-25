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
        "sidebar-item-transition group",
        "transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
        isActive
          ? cn(
              "bg-accent/[0.08] text-foreground",
              "shadow-[inset_0_0_0_1px_rgba(34,197,94,0.12)]",
            )
          : cn(
              "text-muted-foreground/60",
              "hover:bg-hover-bg hover:text-foreground hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
            ),
        collapsed && "justify-center px-0 py-2.5",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Animated Active Indicator */}
      {isActive && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-full bg-accent"
        />
      )}

      <Icon
        size={18}
        strokeWidth={isActive ? 1.8 : 1.5}
        className={cn(
          "shrink-0 transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          isActive
            ? "text-accent"
            : "text-muted-foreground/45 group-hover:text-foreground/80",
        )}
      />

      {!collapsed && (
        <>
          <span className="truncate leading-none">{item.label}</span>

          {item.shortcut && (
            <kbd
              className={cn(
                "ml-auto text-[10px] font-mono uppercase tracking-wider",
                "text-muted-foreground/25",
                "opacity-0 transition-opacity duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                "group-hover:opacity-100",
                isActive && "text-accent/30 opacity-100",
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
