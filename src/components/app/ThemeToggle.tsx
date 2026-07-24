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
    return (
      <div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px]"
        aria-label="Toggle theme"
      />
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-muted-foreground/50",
        "transition-all duration-200",
        "hover:bg-hover-bg hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div
        className={cn(
          "transition-all duration-200",
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-90 opacity-0",
          "absolute",
        )}
      >
        <Moon size={16} strokeWidth={1.5} />
      </div>
      <div
        className={cn(
          "transition-all duration-200",
          !isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-90 opacity-0",
        )}
      >
        <Sun size={16} strokeWidth={1.5} />
      </div>
    </button>
  );
}
