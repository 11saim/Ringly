"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  BookOpen,
  Calendar,
  Bot,
  BarChart3,
  Phone,
  Settings as SettingsIcon,
  LogOut,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/inbox", icon: Inbox, label: "Inbox" },
  { to: "/catalog", icon: BookOpen, label: "Catalog" },
  { to: "/bookings", icon: Calendar, label: "Bookings" },
  { to: "/agent-config", icon: Bot, label: "Agent" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/numbers", icon: Phone, label: "Numbers" },
] as const;

export function Sidebar({ isDark, theme, onToggleTheme }: { isDark: boolean; theme: string; onToggleTheme: () => void }) {
  const pathname = usePathname();

  const nav = (
    <div className="flex h-full flex-col bg-card border-r border-border">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-4 border-b border-border">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-mono text-sm font-bold">R</span>
        <span className="text-sm font-semibold tracking-tight hidden lg:block">Ringly</span>
      </Link>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((it) => {
          const Icon = it.icon;
          const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
          return (
            <Link
              key={it.to}
              href={it.to}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-hover hover:text-foreground"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              <span className="hidden lg:block">{it.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-3 space-y-1">
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-hover hover:text-foreground transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span className="hidden lg:block">{theme === "system" ? "System" : isDark ? "Light mode" : "Dark mode"}</span>
        </button>
        <Link
          href="/settings"
          className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            pathname.startsWith("/settings")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-hover hover:text-foreground"
          }`}
        >
          <SettingsIcon size={18} />
          <span className="hidden lg:block">Settings</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-hover hover:text-foreground transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden lg:block">Log out</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-[220px] lg:w-[240px]">
        {nav}
      </aside>

      {/* Mobile sidebar */}
      <div className="md:hidden fixed top-0 left-0 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button className="fixed top-3 left-3 z-50 grid h-10 w-10 place-items-center rounded-lg bg-card border border-border shadow-sm text-foreground">
              <Menu size={18} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            {nav}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-border bg-card py-2 px-1">
      {navItems.slice(0, 5).map((it) => {
        const Icon = it.icon;
        const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
        return (
          <Link
            key={it.to}
            href={it.to}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md min-w-[44px] ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            <span className="text-[10px] font-medium">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
