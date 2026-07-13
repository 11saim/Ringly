"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { catalogItems, conversations, bookings } from "@/lib/mock";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [open, onOpenChange]);

  const go = (path: string) => { onOpenChange(false); router.push(path); };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search conversations, catalog, bookings…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/dashboard")}>Overview</CommandItem>
          <CommandItem onSelect={() => go("/inbox")}>Inbox</CommandItem>
          <CommandItem onSelect={() => go("/catalog")}>Catalog</CommandItem>
          <CommandItem onSelect={() => go("/bookings")}>Bookings</CommandItem>
          <CommandItem onSelect={() => go("/agent-config")}>Agent Config</CommandItem>
          <CommandItem onSelect={() => go("/analytics")}>Analytics</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Conversations">
          {conversations.slice(0, 4).map((c) => (
            <CommandItem key={c.id} onSelect={() => go("/inbox")}>{c.customer} — {c.preview}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Catalog">
          {catalogItems.slice(0, 4).map((c) => (
            <CommandItem key={c.id} onSelect={() => go("/catalog")}>{c.name} — ${(c.price / 100).toFixed(2)}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Bookings">
          {bookings.slice(0, 3).map((b) => (
            <CommandItem key={b.id} onSelect={() => go("/bookings")}>{b.customer} — {b.service} · {b.day} {b.time}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
