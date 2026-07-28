import {
  LayoutDashboard,
  Inbox,
  Settings,
  Users,
  Calendar,
  Megaphone,
  BarChart3,
  CreditCard,
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
    id: "main",
    label: "MAIN",
    items: [
      { id: "overview", label: "Overview", href: "/overview", icon: LayoutDashboard, shortcut: "G O" },
      { id: "inbox", label: "Inbox", href: "/inbox", icon: Inbox, shortcut: "G I", badge: 3 },
    ],
  },
  {
    id: "business",
    label: "BUSINESS",
    items: [
      { id: "settings", label: "Business Settings", href: "/settings", icon: Settings, shortcut: "G ," },
      { id: "contacts", label: "Contacts", href: "/contacts", icon: Users, shortcut: "G C" },
      { id: "bookings", label: "Bookings / Orders", href: "/bookings", icon: Calendar, shortcut: "G B" },
      { id: "broadcasts", label: "Broadcasts", href: "/broadcasts", icon: Megaphone, shortcut: "G M" },
    ],
  },
  {
    id: "system",
    label: "SYSTEM",
    items: [
      { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3, shortcut: "G A" },
      { id: "account", label: "Account & Billing", href: "/account", icon: CreditCard, shortcut: "G $" },
    ],
  },
];

export const workspaceOptions = [
  { id: "bloom", name: "Bloom Studio", handle: "bloom", plan: "Growth" },
  { id: "bistro", name: "Bistro Nord", handle: "bistro", plan: "Starter" },
  { id: "verdant", name: "Verdant Care", handle: "verdant", plan: "Pro" },
];
