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
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground",
        )}
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
        "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground",
        "transition-colors duration-150",
        "hover:bg-hover-bg hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-primary-light focus-visible:outline-offset-2",
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
        <Moon size={16} />
      </div>
      <div
        className={cn(
          "transition-all duration-200",
          !isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-90 opacity-0",
        )}
      >
        <Sun size={16} />
      </div>
    </button>
  );
}
