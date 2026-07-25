"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" aria-label="Toggle theme" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
        "text-foreground/50 border border-transparent",
        "transition-all duration-200 ease-out",
        "hover:bg-hover-bg hover:text-foreground hover:border-border/50 hover:shadow-[var(--shadow-xs)]",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        "active:scale-[0.97]",
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className={cn("transition-all duration-200", isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-90 opacity-0", "absolute")}>
        <Moon size={18} strokeWidth={1.8} />
      </div>
      <div className={cn("transition-all duration-200", !isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-90 opacity-0")}>
        <Sun size={18} strokeWidth={1.8} />
      </div>
    </button>
  );
}
