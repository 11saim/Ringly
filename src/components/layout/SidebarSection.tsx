import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({ label, children, className }: SidebarSectionProps) {
  return (
    <div className={cn("pt-5 pb-0.5", className)}>
      <div className="px-2.5 pb-1.5">
        <span
          className={cn(
            "text-[10px] font-medium uppercase tracking-[0.06em]",
            "text-muted-foreground/40",
          )}
        >
          {label}
        </span>
      </div>
      <div className="space-y-px">
        {children}
      </div>
    </div>
  );
}
