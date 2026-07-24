"use client";

import { useState, useEffect } from "react";
import { ContentContainer } from "./ContentContainer";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "@/components/app/CommandPalette";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />

      <main
        className="min-h-screen"
        style={{ marginLeft: isMobile ? 0 : "var(--sidebar-width)" }}
      >
        <Header onSearchClick={() => setPaletteOpen(true)} />

        <ContentContainer>
          {children}
        </ContentContainer>
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
