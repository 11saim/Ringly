"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed] = useSidebarCollapsed();
  const isMobile = useIsMobile();

  const sidebarWidth = isMobile ? 0 : collapsed ? 64 : 240;

  return (
    <div className="min-h-screen bg-[var(--parchment)] text-[var(--ink)]">
      <Sidebar />

      <main
        className={cn(
          "relative flex-1 transition-all duration-200 ease-out",
          !isMobile && "min-h-screen",
        )}
        style={{ marginLeft: sidebarWidth }}
      >
        <Header />

        <div className="p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
