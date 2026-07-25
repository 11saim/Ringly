"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
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
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar-bg border-r border-sidebar-border/60">
      {/* Logo + Workspace */}
      <div className={cn("flex flex-col", collapsed ? "items-center px-2 pt-4" : "px-4 pt-4 pb-2")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "w-full")}>
          <RinglyLogo size="md" collapsed={collapsed} />
        </div>
      </div>

      {/* Navigation — no scroll, fits naturally */}
      <nav className={cn("flex-1 px-3", collapsed ? "py-1" : "py-1")}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-0.5">
            {navSections.map((section) =>
              section.items.map((item) => (
                <SidebarItem key={item.id} item={item} isActive={isActive(item.href)} collapsed={collapsed} />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {navSections.map((section) => (
              <div key={section.id}>
                <div className="mb-1.5 px-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/40">
                    {section.label}
                  </span>
                </div>
                <div className="space-y-px">
                  {section.items.map((item) => (
                    <SidebarItem key={item.id} item={item} isActive={isActive(item.href)} collapsed={collapsed} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Logout — pinned at bottom */}
      <div className={cn("mt-auto border-t border-sidebar-border/40", collapsed ? "px-2 py-3" : "px-3 py-3")}>
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-[10px] text-[13px] font-medium text-muted-foreground/45",
            "transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
            "hover:bg-hover-bg hover:text-foreground/80",
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
            "rounded-[12px] border border-border bg-card text-foreground",
            "shadow-[var(--shadow-card)]",
            "transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
            "hover:bg-hover-bg hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.03]",
            "active:scale-[0.97]",
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
              className="fixed inset-0 z-40 bg-overlay/60 backdrop-blur-sm animate-backdrop-in"
              onClick={() => setMobileOpen(false)}
            />
            <aside
              className="fixed inset-y-0 left-0 z-50 w-[296px] h-screen animate-slide-in-left"
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
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex h-screen flex-col group/sidebar",
        "sidebar-transition",
      )}
      style={{
        width: collapsed ? 72 : 280,
        transition: "width 220ms cubic-bezier(0.25,0.1,0.25,1)",
        willChange: "width",
      }}
    >
      {sidebarContent}
    </aside>
  );
}
