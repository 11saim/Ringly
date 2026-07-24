"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationButton } from "./NotificationButton";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  onSearchClick?: () => void;
}

const breadcrumbNames: Record<string, string> = {
  dashboard: "Dashboard",
  inbox: "Inbox",
  customers: "Customers",
  agent: "AI Agent",
  knowledge: "Knowledge Base",
  bookings: "Bookings",
  orders: "Orders",
  products: "Products",
  services: "Services",
  broadcasts: "Broadcasts",
  analytics: "Analytics",
  integrations: "Integrations",
  team: "Team",
  billing: "Billing",
  settings: "Settings",
};

export function Header({ title, onSearchClick }: HeaderProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [];

    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const name =
        breadcrumbNames[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1);
      const isLast = index === segments.length - 1;

      return { href, name, isLast };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[60px] items-center justify-between",
        "border-b border-border bg-card/80 backdrop-blur-md",
        "px-8",
      )}
    >
      {/* Left: Breadcrumb */}
      <div className="flex h-full items-center">
        {breadcrumbs.length > 0 ? (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb) => (
                <BreadcrumbItem key={crumb.href}>
                  {crumb.isLast ? (
                    <BreadcrumbPage className="text-sm font-semibold text-foreground">
                      {crumb.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={crumb.href}
                      className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                    >
                      {crumb.name}
                    </BreadcrumbLink>
                  )}
                  {!crumb.isLast && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <div className="text-sm font-semibold text-foreground">
            {title || "Dashboard"}
          </div>
        )}
      </div>

      {/* Right: Search + Actions */}
      <div className="flex h-full items-center gap-1">
        {/* Command Search */}
        <button
          type="button"
          onClick={onSearchClick}
          className={cn(
            "hidden sm:flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm",
            "border border-border bg-muted/50 text-muted-foreground",
            "transition-all duration-150 ease-out",
            "hover:border-border-strong hover:bg-muted hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-primary-light focus-visible:outline-offset-2",
          )}
        >
          <Search size={15} strokeWidth={1.8} className="shrink-0 opacity-50" />
          <span className="opacity-60">Search...</span>
          <kbd
            className={cn(
              "ml-2 flex items-center gap-0.5 rounded-md border border-border/80",
              "bg-card px-1.5 py-0.5 font-mono text-[10px] font-medium",
              "text-muted-foreground/50",
            )}
          >
            <span className="text-[11px]">&#8984;</span>K
          </kbd>
        </button>

        <div className="mx-2 h-5 w-px bg-border" />

        <NotificationButton />

        <ThemeToggle />

        <div className="mx-1 h-5 w-px bg-border" />

        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent transition-all duration-150 hover:ring-border-strong">
          <AvatarImage src="/vercel.svg" alt="User" />
          <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
            AN
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
