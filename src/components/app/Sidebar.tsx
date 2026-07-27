"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-store";
import { RinglyLogo } from "./RinglyLogo";
import { SidebarItem } from "./SidebarItem";
import { navSections } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);
  const prevIsMobileRef = useRef(isMobile);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (prevIsMobileRef.current && !isMobile) setMobileOpen(false);
    prevIsMobileRef.current = isMobile;
  }, [isMobile]);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) setMobileOpen(false);
    prevPathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        if (isMobile) setMobileOpen((o) => !o);
        else setCollapsed(!collapsed);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, collapsed, setCollapsed]);

  const isActive = (href: string) => {
    if (href === "/inbox") return pathname === "/inbox" || pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-[var(--slate)]">
      {/* Logo + Agent Pulse */}
      <div className={cn("flex flex-col", collapsed ? "items-center px-2 pt-4" : "px-4 pt-4 pb-2")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "w-full")}>
          <RinglyLogo size="md" collapsed={collapsed} />
        </div>

        {/* Agent Pulse — signature element */}
        {!collapsed && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-[var(--mist)] px-3 py-2">
            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--cedar)] animate-agent-pulse" />
            <span className="text-xs text-[var(--ink)] truncate">Agent active</span>
          </div>
        )}
        {collapsed && (
          <div className="mt-2 flex justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--cedar)] animate-agent-pulse" title="Agent active" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 px-3", collapsed ? "py-1" : "py-2")}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-0.5">
            {navSections.map((section) =>
              section.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  isActive={isActive(item.href)}
                  collapsed={collapsed}
                />
              )),
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {navSections.map((section) => (
              <div key={section.id}>
                <div className="mb-1.5 px-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--ash)]">
                    {section.label}
                  </span>
                </div>
                <div className="space-y-px">
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      isActive={isActive(item.href)}
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Collapse toggle + Logout — pinned at bottom */}
      <div className={cn("mt-auto border-t border-[var(--slate)]", collapsed ? "px-2 py-3" : "px-3 py-3")}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex w-full items-center gap-3 rounded-md text-sm font-medium text-[var(--ash)]",
            "transition-colors duration-150",
            "hover:bg-hover-bg hover:text-[var(--ink)]",
            collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2",
          )}
        >
          {collapsed ? (
            <PanelLeft size={18} strokeWidth={1.5} />
          ) : (
            <>
              <PanelLeftClose size={18} strokeWidth={1.5} />
              <span>Collapse</span>
            </>
          )}
        </button>

        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-md text-sm font-medium text-[var(--ash)]",
            "transition-colors duration-150",
            "hover:bg-hover-bg hover:text-[var(--ink)]",
            collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2",
          )}
        >
          <LogOut size={18} strokeWidth={1.5} />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={cn(
            "fixed top-3 left-3 z-50 grid h-10 w-10 place-items-center",
            "rounded-md border border-[var(--slate)] bg-white text-[var(--ink)]",
            "shadow-sm",
            "transition-all duration-150",
            "hover:bg-hover-bg",
          )}
          aria-label="Open navigation"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4.5H16M2 9H16M2 13.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-overlay/60 backdrop-blur-sm animate-fade-in"
              onClick={() => setMobileOpen(false)}
            />
            <aside
              className="fixed inset-y-0 left-0 z-50 w-[280px] h-screen animate-fade-in"
              style={{ willChange: "transform" }}
            >
              {sidebarContent}
            </aside>
          </>
        )}
      </>
    );
  }

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex h-screen flex-col"
      style={{
        width: collapsed ? 64 : 240,
        transition: "width 200ms ease-out",
        willChange: "width",
      }}
    >
      {sidebarContent}
    </aside>
  );
}
