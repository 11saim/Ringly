"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center rounded-md p-1",
          "transition-colors duration-150",
          "hover:bg-hover-bg",
          "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar className="h-7 w-7">
          <AvatarImage src="/vercel.svg" alt="User" />
          <AvatarFallback className="bg-muted text-[10px] font-semibold text-foreground">
            AN
          </AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute right-0 top-full z-20 mt-1 w-52 rounded-md",
              "border border-border bg-card py-1",
              "shadow-[0_4px_16px_rgba(0,0,0,0.06)]",
              "animate-dropdown-in",
            )}
          >
            <div className="px-3 py-2">
              <div className="text-[13px] font-medium text-foreground leading-tight">Ali Nagi</div>
              <div className="text-[11px] text-muted-foreground leading-tight mt-px">ali@bloomstudio.com</div>
            </div>
            <div className="border-t border-border" />
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-[13px] text-muted-foreground",
                "transition-colors duration-150",
                "hover:bg-hover-bg hover:text-foreground",
              )}
            >
              <User size={14} />
              <span>Account</span>
            </button>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-[13px] text-muted-foreground",
                "transition-colors duration-150",
                "hover:bg-hover-bg hover:text-foreground",
              )}
            >
              <Settings size={14} />
              <span>Settings</span>
            </button>
            <div className="border-t border-border" />
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-[13px] text-muted-foreground",
                "transition-colors duration-150",
                "hover:bg-hover-bg hover:text-foreground",
              )}
            >
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
