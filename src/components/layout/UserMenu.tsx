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
          "flex items-center rounded-full p-0.5",
          "transition-all duration-200",
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
              "absolute right-0 top-full z-20 mt-2 w-52 rounded-[16px]",
              "border border-border/50 bg-card py-1",
              "shadow-[var(--shadow-dropdown)]",
              "animate-dropdown-in",
            )}
          >
            <div className="px-3.5 py-3">
              <div className="text-[13px] font-semibold text-foreground leading-tight">Ali Nagi</div>
              <div className="text-[11px] text-muted-foreground/50 leading-tight mt-0.5">ali@bloomstudio.com</div>
            </div>
            <div className="h-px bg-border/40 mx-3" />
            <div className="py-1">
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-muted-foreground",
                  "transition-all duration-150",
                  "hover:bg-hover-bg hover:text-foreground",
                )}
              >
                <User size={14} strokeWidth={1.5} />
                <span>Account</span>
              </button>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-muted-foreground",
                  "transition-all duration-150",
                  "hover:bg-hover-bg hover:text-foreground",
                )}
              >
                <Settings size={14} strokeWidth={1.5} />
                <span>Settings</span>
              </button>
            </div>
            <div className="h-px bg-border/40 mx-3" />
            <div className="py-1">
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-muted-foreground",
                  "transition-all duration-150",
                  "hover:bg-hover-bg hover:text-foreground",
                )}
              >
                <LogOut size={14} strokeWidth={1.5} />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
