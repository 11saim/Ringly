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
        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium",
        "sidebar-item-transition",
        "group",
        isActive
          ? cn(
              "bg-whatsapp/[0.07] text-foreground",
              "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
              "before:h-4 before:w-[2px] before:rounded-full before:bg-whatsapp",
            )
          : cn(
              "text-muted-foreground",
              "hover:bg-hover-bg hover:text-foreground",
            ),
        collapsed && "justify-center px-0 py-2.5",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        size={18}
        strokeWidth={isActive ? 1.8 : 1.5}
        className={cn(
          "shrink-0 transition-colors duration-150",
          isActive
            ? "text-whatsapp"
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
                isActive && "text-whatsapp/30 opacity-100",
              )}
            >
              {item.shortcut}
            </kbd>
          )}

          {item.badge && (
            <span
              className={cn(
                "ml-auto flex h-[18px] min-w-[18px] items-center justify-center",
                "rounded-full bg-whatsapp px-1 text-[10px] font-bold text-white",
                "badge-pop",
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
