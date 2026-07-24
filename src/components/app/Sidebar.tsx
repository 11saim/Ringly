"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
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
      {/* Logo */}
      <div className="flex items-center px-5 pt-5 pb-4">
        <RinglyLogo size="md" collapsed={collapsed} />
      </div>

      {/* Workspace Selector */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <WorkspaceSwitcher collapsed={collapsed} />
        </div>
      )}

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto px-3",
        "scrollbar-hidden",
        collapsed ? "py-1" : "py-1",
      )}>
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
              ))
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {navSections.map((section) => (
              <div key={section.id}>
                <div className="mb-1 px-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/50">
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

      {/* Bottom */}
      {!collapsed && (
        <div className="border-t border-sidebar-border mx-3 my-2 pt-2">
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
            "rounded-[12px] border border-border bg-card text-foreground",
            "shadow-[var(--shadow-card)]",
            "transition-all duration-200",
            "hover:bg-hover-bg hover:shadow-[var(--shadow-card-hover)]",
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
      style={{ width: collapsed ? 72 : 280 }}
    >
      {sidebarContent}
    </aside>
  );
}
