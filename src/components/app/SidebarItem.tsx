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
        "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
        "transition-all duration-150 ease-out group",
        isActive
          ? cn(
              "bg-mist text-[var(--ink)]",
            )
          : cn(
              "text-[var(--ash)]",
              "hover:bg-hover-bg hover:text-[var(--ink)]",
            ),
        collapsed && "justify-center px-0 py-2.5",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-full bg-[var(--cedar)]" />
      )}

      <Icon
        size={18}
        strokeWidth={isActive ? 2 : 1.5}
        className={cn(
          "shrink-0 transition-colors duration-150",
          isActive
            ? "text-[var(--cedar)]"
            : "text-[var(--ash)] group-hover:text-[var(--ink)]",
        )}
      />

      {!collapsed && (
        <>
          <span className="truncate leading-none">{item.label}</span>

          {item.badge && (
            <span
              className={cn(
                "ml-auto flex h-[18px] min-w-[18px] items-center justify-center",
                "rounded-full bg-[var(--cedar)] px-1 text-[10px] font-bold text-white",
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
