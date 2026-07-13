import { useState, type ReactNode } from "react";
import { IconRailNav } from "./IconRailNav";
import { CommandPalette } from "./CommandPalette";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppShell({ title, subtitle, children, actions }: { title: string; subtitle?: string; children: ReactNode; actions?: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-[color:var(--surface-2)] dark:bg-background">
        <IconRailNav onToggleTheme={() => setDark((d) => !d)} />
        <div className="md:pl-16 pb-16 md:pb-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 backdrop-blur px-6">
            <div>
              <div className="text-sm font-semibold">{title}</div>
              {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {actions}
              <Button variant="outline" size="sm" onClick={() => setPaletteOpen(true)} className="gap-2 text-muted-foreground">
                <Search size={14} /> Search <span className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</span>
              </Button>
            </div>
          </header>
          <main className="p-6 md:p-8 max-w-[1400px] mx-auto">{children}</main>
        </div>
        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </div>
    </div>
  );
}
