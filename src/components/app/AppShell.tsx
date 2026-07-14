"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Sidebar, MobileNav } from "./IconRailNav";
import { CommandPalette } from "./CommandPalette";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppShell({ title, subtitle, children, actions }: { title: string; subtitle?: string; children: ReactNode; actions?: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />

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
