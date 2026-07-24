"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarSection } from "./SidebarSection";
import { SidebarItem } from "./SidebarItem";
import { navSections } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
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

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar-bg border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-5 pt-5 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] bg-accent text-white">
            <span className="text-[12px] font-bold leading-none">R</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold tracking-[-0.01em] text-foreground leading-none">
              Ringly
            </span>
            <span className="text-[10px] text-muted-foreground/40 leading-none mt-1">
              AI Workspace
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 scrollbar-hidden">
        {navSections.map((section, i) => (
          <SidebarSection key={section.id} label={section.label} className={i === 0 ? "pt-1" : undefined}>
            {section.items.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={isActive(item.href)}
              />
            ))}
          </SidebarSection>
        ))}
      </nav>
    </div>
  );

  // Mobile: drawer
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
            "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
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
                "fixed inset-y-0 left-0 z-50 w-[280px] h-screen",
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
      className="fixed inset-y-0 left-0 z-40 flex h-screen w-[280px] flex-col"
      style={{ width: "var(--sidebar-width)" }}
    >
      {sidebarContent}
    </aside>
  );
}
