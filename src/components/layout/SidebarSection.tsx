import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({ label, children, className }: SidebarSectionProps) {
  return (
    <div className={cn("pt-7 pb-1", className)}>
      <div className="px-3 pb-2.5">
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.08em]",
            "text-muted-foreground/35",
          )}
        >
          {label}
        </span>
      </div>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}
