import {
  LayoutDashboard,
  Inbox,
  Users,
  Bot,
  BookOpen,
  Calendar,
  ShoppingCart,
  Package,
  Scissors,
  Megaphone,
  BarChart3,
  Plug,
  Users as TeamIcon,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
  badge?: number;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    id: "workspace",
    label: "WORKSPACE",
    items: [
      { id: "dashboard", label: "Overview", href: "/dashboard", icon: LayoutDashboard, shortcut: "G D" },
      { id: "inbox", label: "Inbox", href: "/inbox", icon: Inbox, shortcut: "G I", badge: 3 },
      { id: "customers", label: "Customers", href: "/customers", icon: Users, shortcut: "G C" },
    ],
  },
  {
    id: "ai",
    label: "AI",
    items: [
      { id: "agent", label: "AI Agent", href: "/agent", icon: Bot, shortcut: "G A" },
      { id: "knowledge", label: "Knowledge Base", href: "/knowledge", icon: BookOpen, shortcut: "G K" },
    ],
  },
  {
    id: "business",
    label: "BUSINESS",
    items: [
      { id: "bookings", label: "Bookings", href: "/bookings", icon: Calendar, shortcut: "G B" },
      { id: "orders", label: "Orders", href: "/orders", icon: ShoppingCart, shortcut: "G O" },
      { id: "products", label: "Products", href: "/products", icon: Package, shortcut: "G P" },
      { id: "services", label: "Services", href: "/services", icon: Scissors, shortcut: "G S" },
    ],
  },
  {
    id: "growth",
    label: "GROWTH",
    items: [
      { id: "broadcasts", label: "Broadcasts", href: "/broadcasts", icon: Megaphone, shortcut: "G M" },
      { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3, shortcut: "G X" },
    ],
  },
  {
    id: "system",
    label: "SYSTEM",
    items: [
      { id: "integrations", label: "Integrations", href: "/integrations", icon: Plug, shortcut: "G N" },
      { id: "team", label: "Team", href: "/team", icon: TeamIcon, shortcut: "G T" },
      { id: "billing", label: "Billing", href: "/billing", icon: CreditCard, shortcut: "G B" },
      { id: "settings", label: "Settings", href: "/settings", icon: Settings, shortcut: "G ," },
    ],
  },
];

export const workspaceOptions = [
  { id: "bloom", name: "Bloom Studio", handle: "bloom", plan: "Growth" },
  { id: "bistro", name: "Bistro Nord", handle: "bistro", plan: "Starter" },
  { id: "verdant", name: "Verdant Care", handle: "verdant", plan: "Pro" },
];
