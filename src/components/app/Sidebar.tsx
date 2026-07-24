"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronsLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-store";
import { RinglyLogo } from "./RinglyLogo";
import { SidebarItem } from "./SidebarItem";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { navSections } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);
  const prevIsMobileRef = useRef(isMobile);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (prevIsMobileRef.current && !isMobile) {
      setMobileOpen(false);
    }
    prevIsMobileRef.current = isMobile;
  }, [isMobile]);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setMobileOpen(false);
    }
    prevPathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        if (isMobile) {
          setMobileOpen((o) => !o);
        } else {
          setCollapsed(!collapsed);
        }
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
    <div className="flex h-full flex-col bg-sidebar-bg border-r border-sidebar-border">
      {/* Logo + Collapse */}
      <div className="flex items-center justify-between px-5 py-5">
        <RinglyLogo size="md" collapsed={collapsed} />
        {!isMobile && (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground",
              "transition-all duration-150 ease-out",
              "opacity-0 group-hover/sidebar:opacity-100",
              "hover:bg-hover-bg hover:text-foreground",
              "focus-visible:outline-2 focus-visible:outline-primary-light focus-visible:outline-offset-2",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronsLeft
              size={16}
              className={cn(
                "transition-transform duration-200",
                collapsed && "rotate-180",
              )}
            />
          </button>
        )}
      </div>

      {/* Workspace Selector */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <WorkspaceSwitcher collapsed={collapsed} />
        </div>
      )}

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto",
        "scrollbar-hidden",
        collapsed ? "px-3 py-2" : "px-4 py-1",
      )}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            {navSections.map((section) =>
              section.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  isActive={isActive(item.href)}
                  collapsed={collapsed}
                />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {navSections.map((section) => (
              <div key={section.id}>
                <div className="mb-1.5 px-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60">
                    {section.label}
                  </span>
                </div>
                <div className="space-y-0.5">
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

      {/* Bottom */}
      {!collapsed && (
        <div className="border-t border-sidebar-border px-4 py-3">
          <SidebarItem
            item={{
              id: "logout",
              label: "Log out",
              href: "/login",
              icon: LogOut,
            }}
            isActive={false}
            collapsed={collapsed}
          />
        </div>
      )}
    </div>
  );

  // Mobile: slide-out drawer
  if (isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={cn(
            "fixed top-3 left-3 z-50 grid h-10 w-10 place-items-center",
            "rounded-lg border border-border bg-card text-foreground shadow-sm",
            "transition-colors duration-150",
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
              className={cn(
                "fixed inset-0 z-40 bg-overlay/60 backdrop-blur-sm",
                "animate-backdrop-in",
              )}
              onClick={() => setMobileOpen(false)}
            />
            <aside
              className={cn(
                "fixed inset-y-0 left-0 z-50 w-[296px] h-screen",
                "animate-slide-in-left",
              )}
            >
              {sidebarContent}
            </aside>
          </>
        )}
      </>
    );
  }

  // Desktop: fixed sidebar
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex h-screen flex-col group/sidebar",
        "sidebar-transition",
      )}
      style={{ width: collapsed ? 80 : 296 }}
    >
      {sidebarContent}
    </aside>
  );
}
