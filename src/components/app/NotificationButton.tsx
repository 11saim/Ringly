"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "New booking confirmed",
    description: "Sofia N. booked a Balayage for Saturday at 10:00",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    title: "Payment received",
    description: "James L. paid $18 for Men's Haircut",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    title: "Agent needs review",
    description: "Conversation #c4 escalated to human agent",
    time: "3h ago",
    unread: false,
  },
];

export function NotificationButton() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

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
          "relative grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-muted-foreground/50",
          "transition-all duration-200",
          "hover:bg-hover-bg hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        )}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {unreadCount > 0 ? <BellDot size={16} strokeWidth={1.5} /> : <Bell size={16} strokeWidth={1.5} />}

        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute top-1 right-1 flex h-3.5 min-w-[0.875rem] items-center justify-center",
              "rounded-full bg-accent px-1 text-[9px] font-bold text-white",
              "animate-badge-pop",
            )}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute right-0 top-full z-20 mt-2 w-80 rounded-[16px]",
              "border border-border/50 bg-card",
              "shadow-[var(--shadow-dropdown)]",
              "animate-dropdown-in",
            )}
          >
            <div className="border-b border-border/40 px-4 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                Notifications
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={cn(
                    "w-full px-4 py-3 text-left transition-all duration-150",
                    "hover:bg-hover-bg/60",
                    n.unread && "bg-accent/[0.03]",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                        n.unread ? "bg-accent" : "bg-transparent",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-foreground leading-snug">
                        {n.title}
                      </div>
                      <div className="text-[12px] text-muted-foreground/50 line-clamp-2 mt-0.5 leading-snug">
                        {n.description}
                      </div>
                      <div className="text-[11px] text-muted-foreground/35 mt-1.5">
                        {n.time}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-border/40 px-4 py-2.5">
              <button
                type="button"
                className={cn(
                  "w-full text-center text-[12px] font-medium text-muted-foreground/40",
                  "transition-colors duration-150",
                  "hover:text-foreground",
                )}
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
