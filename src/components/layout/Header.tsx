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
        "sticky top-0 z-30 flex h-[52px] items-center justify-end",
        "border-b border-border/50 bg-background/80 backdrop-blur-xl",
        "px-6",
      )}
    >
      {/* Right: Search + Notifications + Theme + Avatar */}
      <div className="flex h-full items-center gap-0.5">
        <SearchTrigger onClick={onSearchClick} />

        <div className="h-4 w-px bg-border/40 mx-2" />

        <NotificationButton />
        <ThemeToggle />

        <div className="h-4 w-px bg-border/40 mx-2" />

        <UserMenu />
      </div>
    </header>
  );
}
