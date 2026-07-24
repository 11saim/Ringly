"use client";

import { useState, useEffect } from "react";
import { Container } from "./Container";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "./CommandPalette";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppShellProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AppShell({
  title,
  children,
  actions,
}: AppShellProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [collapsed] = useSidebarCollapsed();
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

  const sidebarWidth = isMobile ? 0 : collapsed ? 80 : 296;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />

      <main
        className={cn(
          "relative flex-1 transition-all duration-200 ease-out",
          !isMobile && "min-h-screen",
        )}
        style={{ marginLeft: sidebarWidth }}
      >
        <Header
          title={title}
          onSearchClick={() => setPaletteOpen(true)}
        />

        <Container maxWidth="7xl" padding="lg">
          {actions && (
            <div className="mb-8 flex items-center justify-between">
              {actions}
            </div>
          )}

          <div className="animate-fade-in">
            {children}
          </div>
        </Container>
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
