"use client";

import { SearchTrigger } from "./SearchTrigger";
import { NotificationButton } from "@/components/app/NotificationButton";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { UserMenu } from "./UserMenu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSearchClick?: () => void;
}

export function Header({ onSearchClick }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between",
        "border-b border-border bg-background/80 backdrop-blur-md",
        "px-8",
      )}
    >
      {/* Left: spacer (page title moved to content area) */}
      <div className="flex h-full items-center" />

      {/* Right: Search + Notifications + Theme + Avatar */}
      <div className="flex h-full items-center gap-1">
        <SearchTrigger onClick={onSearchClick} />

        <div className="h-4 w-px bg-border mx-1" />

        <NotificationButton />
        <ThemeToggle />

        <div className="h-4 w-px bg-border mx-1" />

        <UserMenu />
      </div>
    </header>
  );
}
