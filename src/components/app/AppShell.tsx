"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Sidebar, MobileNav } from "./IconRailNav";
import { CommandPalette } from "./CommandPalette";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "system" | "light" | "dark";

function getSystemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem("ringly-theme") as Theme | null;
  return stored || "system";
}

function applyTheme(theme: Theme) {
  const isDark = theme === "system" ? getSystemDark() : theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
}

export function AppShell({ title, subtitle, children, actions }: { title: string; subtitle?: string; children: ReactNode; actions?: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);

  useEffect(() => {
    if (!mounted.current) return;
    applyTheme(theme);
    localStorage.setItem("ringly-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  const cycleTheme = () => {
    setTheme((t) => t === "system" ? "light" : t === "light" ? "dark" : "system");
  };

  const isDark = theme === "system" ? getSystemDark() : theme === "dark";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar isDark={isDark} theme={theme} onToggleTheme={cycleTheme} />

      <div className="md:ml-[220px] lg:ml-[240px] pb-20 md:pb-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-sm px-4 sm:px-6">
          <div className="md:hidden w-10" />
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{title}</div>
            {subtitle && <div className="text-xs text-muted-foreground truncate">{subtitle}</div>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {actions}
            <Button variant="outline" size="sm" onClick={() => setPaletteOpen(true)} className="gap-2 text-muted-foreground hidden sm:flex">
              <Search size={14} />
              <span className="hidden lg:inline">Search</span>
              <kbd className="ml-1 hidden lg:inline rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">{children}</main>
      </div>

      <MobileNav />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
