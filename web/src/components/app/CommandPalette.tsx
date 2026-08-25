"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Bot, Calendar, Package, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { navSections } from "@/lib/navigation";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quickActions = [
  { id: "new-conversation", label: "New conversation", icon: Search, group: "Actions" },
  { id: "ai-agent", label: "Configure AI Agent", icon: Bot, group: "AI" },
  { id: "bookings", label: "View bookings", icon: Calendar, group: "Business" },
  { id: "products", label: "Manage products", icon: Package, group: "Business" },
  { id: "customers", label: "Find customer", icon: Users, group: "Communication" },
  { id: "analytics", label: "Open analytics", icon: BarChart3, group: "Analytics" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!open) setQuery("");
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navigate = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };

  const allNavItems = navSections.flatMap((s) => s.items);
  const filteredNav = query
    ? allNavItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      )
    : allNavItems.slice(0, 6);

  const filteredActions = query
    ? quickActions.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase()),
      )
    : quickActions.slice(0, 4);

  if (!open) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-overlay/60 backdrop-blur-sm",
          "animate-backdrop-in",
        )}
        onClick={() => onOpenChange(false)}
      />

      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]"
        onClick={() => onOpenChange(false)}
      >
        <div
          className={cn(
            "w-full max-w-2xl rounded-xl border border-border bg-card shadow-2xl",
            "animate-command-palette-enter",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <Search size={18} className="shrink-0 text-muted-foreground/50" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search conversations, pages, actions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd
              className={cn(
                "flex items-center gap-0.5 rounded border border-border",
                "bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium",
                "text-muted-foreground/50",
              )}
            >
              Esc
            </kbd>
          </div>

          <div className="max-h-[420px] overflow-y-auto py-2">
            {filteredActions.length > 0 && (
              <div className="px-2 pb-2">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                  Quick Actions
                </div>
                {filteredActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => navigate(`/${action.id}`)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm",
                      "transition-colors duration-150",
                      "hover:bg-hover-bg",
                    )}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[12px] bg-muted text-muted-foreground">
                      <action.icon size={15} />
                    </span>
                    <span className="text-foreground">{action.label}</span>
                    <ArrowRight
                      size={14}
                      className="ml-auto text-muted-foreground/30"
                    />
                  </button>
                ))}
              </div>
            )}

            {filteredNav.length > 0 && (
              <div className="px-2">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                  Navigate
                </div>
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(item.href)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm",
                        "transition-colors duration-150",
                        "hover:bg-hover-bg",
                      )}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[12px] bg-muted text-muted-foreground">
                        <Icon size={15} />
                      </span>
                      <span className="text-foreground">{item.label}</span>
                      {item.shortcut && (
                        <kbd
                          className={cn(
                            "ml-auto text-[10px] font-mono uppercase",
                            "text-muted-foreground/40",
                          )}
                        >
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {query && filteredNav.length === 0 && filteredActions.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No results found for &quot;{query}&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
