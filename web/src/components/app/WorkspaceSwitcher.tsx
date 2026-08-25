"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { workspaceOptions } from "@/lib/navigation";

interface WorkspaceSwitcherProps {
  collapsed?: boolean;
  defaultWorkspace?: string;
}

export function WorkspaceSwitcher({
  collapsed = false,
  defaultWorkspace = "bloom",
}: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultWorkspace);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current =
    workspaceOptions.find((w) => w.id === selected) ?? workspaceOptions[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (collapsed) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            "bg-muted text-xs font-bold text-foreground",
            "transition-all duration-150 ease-out",
            "hover:bg-selected",
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Workspace: ${current.name}`}
        >
          {current.name.charAt(0)}
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <div
              className={cn(
                "absolute left-full top-0 z-20 ml-2 min-w-[200px] rounded-xl",
                "border border-border bg-card py-1.5 shadow-lg",
                "animate-dropdown-in",
              )}
            >
              {workspaceOptions.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    setSelected(ws.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm",
                    "transition-colors duration-150",
                    "hover:bg-hover-bg",
                    selected === ws.id && "bg-hover-bg",
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{ws.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {ws.plan}
                    </span>
                  </div>
                  {selected === ws.id && (
                    <Check size={14} className="text-whatsapp" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm",
          "border border-border/60 bg-muted/40",
          "transition-all duration-150 ease-out",
          "hover:border-border-strong hover:bg-muted",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate font-medium text-foreground">
          {current.name}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "ml-auto shrink-0 text-muted-foreground",
            "transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute top-full z-20 mt-1.5 w-full min-w-[200px] rounded-xl",
              "border border-border bg-card py-1.5 shadow-lg",
              "animate-dropdown-in",
            )}
          >
            {workspaceOptions.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => {
                  setSelected(ws.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm",
                  "transition-colors duration-150",
                  "hover:bg-hover-bg",
                  selected === ws.id && "bg-hover-bg",
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{ws.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {ws.plan}
                  </span>
                </div>
                {selected === ws.id && (
                  <Check size={14} className="text-whatsapp" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
