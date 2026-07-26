import {
  Inbox,
  Bot,
  BookOpen,
  Calendar,
  ShoppingCart,
  Package,
  Scissors,
  BarChart3,
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
    id: "communication",
    label: "COMMUNICATION",
    items: [
      { id: "inbox", label: "Inbox", href: "/inbox", icon: Inbox, shortcut: "G I", badge: 3 },
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
    id: "reports",
    label: "REPORTS",
    items: [
      { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3, shortcut: "G X" },
    ],
  },
  {
    id: "system",
    label: "SYSTEM",
    items: [
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
