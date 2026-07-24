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
          "relative grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground",
          "transition-colors duration-150",
          "hover:bg-hover-bg hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-primary-light focus-visible:outline-offset-2",
        )}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {unreadCount > 0 ? <BellDot size={18} /> : <Bell size={18} />}

        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute top-1.5 right-1.5 flex h-4 min-w-[1rem] items-center justify-center",
              "rounded-full bg-whatsapp px-0.5 text-[10px] font-bold text-white",
              "badge-pop",
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
              "absolute right-0 top-full z-20 mt-1 w-80 rounded-lg",
              "border border-border bg-card shadow-lg",
              "animate-dropdown-in",
            )}
          >
            <div className="border-b border-border px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Notifications
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors duration-150",
                    "hover:bg-hover-bg",
                    n.unread && "bg-accent-soft/30",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-1 h-2 w-2 shrink-0 rounded-full",
                        n.unread ? "bg-whatsapp" : "bg-transparent",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {n.title}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {n.description}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground/60">
                        {n.time}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-border px-4 py-2">
              <button
                type="button"
                className={cn(
                  "w-full text-center text-xs font-medium text-muted-foreground",
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
