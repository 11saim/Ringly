"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTenant } from "@/lib/tenant-context";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-store";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const tenant = useTenant();
  const [collapsed] = useSidebarCollapsed();
  const [mobileOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between",
        "border-b border-[var(--slate)] bg-white/80 backdrop-blur-md",
        "px-6",
      )}
    >
      {/* Left: Business name */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
          {tenant.name}
        </span>
        <span className="text-xs text-[var(--ash)] hidden sm:inline">
          {tenant.plan} plan
        </span>
      </div>

      {/* Right: User menu */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-hover-bg cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[var(--mist)] text-[var(--cedar)] text-xs font-semibold">
                  {tenant.avatarInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-[var(--ink)] hidden md:inline">{tenant.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium text-[var(--ink)]">{tenant.name}</p>
                <p className="text-xs text-[var(--ash)]">@{tenant.handle}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[var(--ember)]" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
