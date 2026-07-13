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
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/inbox", icon: Inbox, label: "Inbox" },
  { to: "/catalog", icon: BookOpen, label: "Catalog" },
  { to: "/bookings", icon: Calendar, label: "Bookings" },
  { to: "/agent-config", icon: Bot, label: "Agent Config" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/numbers", icon: Phone, label: "Numbers" },
] as const;

export function IconRailNav({ onToggleTheme }: { onToggleTheme: () => void }) {
  const pathname = usePathname();
  return (
    <TooltipProvider delayDuration={150}>
      <aside className="fixed inset-y-0 left-0 z-40 hidden md:flex w-16 flex-col items-center gap-1 border-r border-[#27272a] bg-[#141416] text-[#f2f2f3] py-4">
        <Link href="/dashboard" className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-mono text-sm">⌘</Link>
        {items.map((it) => {
          const Icon = it.icon;
          const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
          return (
            <Tooltip key={it.to}>
              <TooltipTrigger asChild>
                <Link
                  href={it.to}
                  className={`relative grid h-11 w-11 place-items-center rounded-lg transition-colors ${
                    active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                  {active && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{it.label}</TooltipContent>
            </Tooltip>
          );
        })}
        <div className="mt-auto flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/settings" className={`grid h-11 w-11 place-items-center rounded-lg ${pathname.startsWith("/settings") ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}>
                <SettingsIcon size={20} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">AR</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-48">
              <DropdownMenuLabel>Ana Reyes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/settings">Billing</Link></DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleTheme}>Toggle dark mode</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/login">Log out</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex md:hidden justify-around border-t border-[#27272a] bg-[#141416] text-[#f2f2f3] py-2">
        {items.slice(0, 6).map((it) => {
          const Icon = it.icon;
          const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
          return (
            <Link key={it.to} href={it.to} className={`grid place-items-center px-2 py-1 rounded-md relative ${active ? "text-white" : "text-white/60"}`}>
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              {active && <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
