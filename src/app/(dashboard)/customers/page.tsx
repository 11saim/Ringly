"use client";

import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Sparkline } from "@/components/app/Sparkline";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import {
  Users, UserPlus, Search, SlidersHorizontal, ArrowUpDown,
  MoreHorizontal, MessageSquare, Star, Clock,
  TrendingUp, UserCheck, AlertTriangle, Heart,
  Download, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Design Tokens ── */

const CARD = "rounded-[16px] border border-border/30 bg-card shadow-[var(--shadow-card)]";
const CARD_HEADER = "px-5 py-3.5 border-b border-border/25";
const SECTION_GAP = "space-y-5";

/* ── Animation Variants ── */

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ── Data ── */

const metrics = [
  { label: "Total Customers", value: 486, trend: "+21 this week", trendUp: true, icon: Users, sparkline: [18, 22, 25, 28, 32, 30, 35, 38, 42, 40, 45, 48], color: "#6366f1" },
  { label: "New Customers", value: 48, trend: "+12%", trendUp: true, icon: UserPlus, sparkline: [3, 5, 4, 7, 6, 8, 5, 9, 7, 10, 8, 12], color: "#22c55e" },
  { label: "Returning", value: 71, suffix: "%", trend: "Excellent retention", trendUp: true, icon: TrendingUp, sparkline: [62, 64, 65, 67, 68, 69, 70, 70, 71, 71, 72, 71], color: "#8b5cf6" },
  { label: "Avg Response", value: 84, displayValue: "1m 24s", trend: "Improving", trendUp: true, icon: Clock, sparkline: [120, 115, 108, 95, 90, 88, 86, 85, 84, 84, 84, 84], color: "#f59e0b" },
];

interface Customer {
  id: string;
  name: string;
  initials: string;
  phone: string;
  lastMessage: string;
  status: "active" | "new" | "attention" | "vip";
  conversations: number;
  bookings: number;
  lastActive: string;
  online: boolean;
}

const customers: Customer[] = [
  { id: "c1", name: "Ahmed Khan", initials: "AK", phone: "+92 300 1234567", lastMessage: "Can I book tomorrow?", status: "vip", conversations: 18, bookings: 4, lastActive: "2m ago", online: true },
  { id: "c2", name: "Fatima Rashid", initials: "FR", phone: "+971 55 987 6543", lastMessage: "Need pricing details", status: "active", conversations: 7, bookings: 2, lastActive: "15m ago", online: false },
  { id: "c3", name: "Restaurant ABC", initials: "RA", phone: "+971 4 234 5678", lastMessage: "Table for four", status: "vip", conversations: 43, bookings: 18, lastActive: "38m ago", online: true },
  { id: "c4", name: "Sofia Martinez", initials: "SM", phone: "+971 50 111 2233", lastMessage: "Opening hours?", status: "active", conversations: 9, bookings: 0, lastActive: "1h ago", online: false },
  { id: "c5", name: "James Lee", initials: "JL", phone: "+971 56 321 0987", lastMessage: "I need to reschedule my appointment", status: "attention", conversations: 5, bookings: 0, lastActive: "Yesterday", online: false },
  { id: "c6", name: "Layla Mahmoud", initials: "LM", phone: "+971 52 444 5566", lastMessage: "What are your prices?", status: "new", conversations: 1, bookings: 0, lastActive: "5m ago", online: true },
  { id: "c7", name: "Omar Hassan", initials: "OH", phone: "+971 50 777 8899", lastMessage: "Thanks for the help!", status: "active", conversations: 12, bookings: 3, lastActive: "2h ago", online: false },
  { id: "c8", name: "Nour Al-Rashid", initials: "NR", phone: "+971 55 222 3344", lastMessage: "Can I reschedule?", status: "attention", conversations: 3, bookings: 1, lastActive: "3h ago", online: false },
  { id: "c9", name: "Maria Garcia", initials: "MG", phone: "+971 56 555 6677", lastMessage: "Do you have highlights?", status: "new", conversations: 2, bookings: 0, lastActive: "30m ago", online: true },
  { id: "c10", name: "Ali Nagi", initials: "AN", phone: "+971 50 999 0011", lastMessage: "Best salon in Dubai!", status: "vip", conversations: 32, bookings: 12, lastActive: "4h ago", online: false },
];

const statusConfig: Record<Customer["status"], { label: string; className: string; dot: string }> = {
  active: { label: "Active", className: "bg-success/[0.08] text-success", dot: "bg-success" },
  new: { label: "New", className: "bg-info/[0.08] text-info", dot: "bg-info" },
  attention: { label: "Follow-up", className: "bg-destructive/[0.08] text-destructive", dot: "bg-destructive" },
  vip: { label: "VIP", className: "bg-voice/[0.08] text-voice", dot: "bg-voice" },
};

const segments = [
  { label: "VIP Customers", count: 24, trend: "+4 this month", icon: Star, color: "#8b5cf6", description: "High value, repeat buyers" },
  { label: "Returning", count: 86, trend: "+12% vs last month", icon: Heart, color: "#22c55e", description: "2+ conversations" },
  { label: "New Customers", count: 48, trend: "+21 this week", icon: UserCheck, color: "#6366f1", description: "First conversation" },
  { label: "Need Follow-up", count: 8, trend: "3 urgent", icon: AlertTriangle, color: "#f59e0b", description: "Awaiting response" },
];

const pastelColors = [
  "bg-primary/[0.06] text-primary-light",
  "bg-success/[0.06] text-success",
  "bg-voice/[0.06] text-voice",
  "bg-accent-amber/[0.06] text-accent-amber",
  "bg-info/[0.06] text-info",
];

/* ── Metric Card ── */

function MetricCard({ m }: { m: (typeof metrics)[number] }) {
  const Icon = m.icon;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={cn(CARD, "p-5 cursor-default transition-all duration-150 hover:shadow-[var(--shadow-card-hover)] hover:border-border/50")}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-muted-foreground/50 tracking-widest uppercase">{m.label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-muted/50">
          <Icon size={14} strokeWidth={1.8} className="text-muted-foreground/35" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[32px] font-bold text-foreground tracking-[-0.03em] leading-none tabular-nums">
            {m.displayValue ?? <CountUp end={m.value} />}{m.suffix ?? ""}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className={cn("text-[11px] font-semibold", m.trendUp ? "text-success" : "text-destructive")}>
              {m.trend}
            </span>
          </div>
        </div>
        <Sparkline data={m.sparkline} color={m.color} />
      </div>
    </motion.div>
  );
}

function CountUp({ end }: { end: number }) {
  const count = useCountUp(end, 1400);
  return <>{count.toLocaleString()}</>;
}

/* ── Customer Row ── */

function CustomerRow({ customer, index }: { customer: Customer; index: number }) {
  const [hovered, setHovered] = useState(false);
  const s = statusConfig[customer.status];
  const colorIdx = index % pastelColors.length;

  return (
    <motion.tr
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group border-b border-border/15 transition-colors duration-150 cursor-pointer",
        hovered && "bg-hover-bg/50",
      )}
    >
      <td className="px-3 py-3 w-12">
        <div className="relative">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold",
            pastelColors[colorIdx],
          )}>
            {customer.initials}
          </div>
          {customer.online && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
          )}
        </div>
      </td>
      <td className="px-3 py-3 min-w-[180px]">
        <span className={cn(
          "text-[13px] font-semibold text-foreground block truncate",
          customer.status === "vip" && "text-voice",
        )}>
          {customer.name}
        </span>
        <p className="text-[11px] text-muted-foreground/45 mt-0.5 truncate">{customer.phone}</p>
      </td>
      <td className="px-3 py-3 max-w-[240px]">
        <p className="text-[12px] text-muted-foreground/50 truncate">{customer.lastMessage}</p>
      </td>
      <td className="px-3 py-3">
        <span className={cn(
          "inline-flex h-[18px] items-center gap-1 rounded-full px-2 text-[10px] font-semibold tracking-wide",
          s.className,
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
          {s.label}
        </span>
      </td>
      <td className="px-3 py-3 text-center">
        <span className="text-[12px] font-medium text-foreground/70 tabular-nums">{customer.conversations}</span>
      </td>
      <td className="px-3 py-3 text-center">
        <span className="text-[12px] font-medium text-foreground/70 tabular-nums">{customer.bookings}</span>
      </td>
      <td className="px-3 py-3">
        <span className="text-[11px] text-muted-foreground/40 tabular-nums">{customer.lastActive}</span>
      </td>
      <td className="px-3 py-3 w-[80px]">
        <div className={cn(
          "flex items-center gap-1 transition-opacity duration-150",
          hovered ? "opacity-100" : "opacity-0",
        )}>
          <button className="flex h-7 items-center gap-1 rounded-[6px] bg-muted/60 px-2 text-[10px] font-medium text-foreground/60 transition-all hover:bg-muted hover:text-foreground">
            <MessageSquare size={10} strokeWidth={1.5} />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground/40 transition-all hover:bg-hover-bg hover:text-foreground">
            <MoreHorizontal size={12} strokeWidth={1.5} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

/* ── Segment Card ── */

function SegmentCard({ segment }: { segment: (typeof segments)[number] }) {
  const Icon = segment.icon;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={cn(CARD, "p-5 transition-all duration-150 hover:shadow-[var(--shadow-card-hover)] hover:border-border/50 cursor-pointer")}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px]" style={{ backgroundColor: `${segment.color}0D` }}>
          <span style={{ color: segment.color } as React.CSSProperties}><Icon size={18} strokeWidth={1.5} /></span>
        </div>
        <ChevronRight size={14} strokeWidth={1.5} className="text-muted-foreground/25 mt-1" />
      </div>
      <h3 className="text-[13px] font-semibold text-foreground mb-0.5">{segment.label}</h3>
      <p className="text-[11px] text-muted-foreground/45 mb-3">{segment.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-[24px] font-bold text-foreground tracking-[-0.02em] tabular-nums">{segment.count}</span>
        <span className="text-[11px] font-medium text-success tabular-nums">{segment.trend}</span>
      </div>
    </motion.div>
  );
}

/* ── Page ── */

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) =>
    search ? c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) : true
  );

  return (
    <AppShell fullWidth>
      <div className={SECTION_GAP}>
        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-end justify-between"
        >
          <div>
            <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em] leading-none">Customers</h1>
            <p className="mt-1 text-[13px] text-muted-foreground/50">
              Manage customer conversations and bookings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 h-[36px] rounded-[10px] bg-accent px-3.5 text-[13px] font-semibold text-white transition-all duration-150 hover:bg-accent-hover">
              <UserPlus size={14} strokeWidth={2} />
              Add Customer
            </button>
          </div>
        </motion.div>

        {/* ── TOOLBAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[220px] h-[36px] rounded-[10px] border border-border/40 bg-muted/30 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-150 focus:outline-none focus:border-border/60 focus:bg-muted/50"
            />
          </div>
          <button className="inline-flex items-center gap-1.5 h-[36px] rounded-[10px] border border-border/40 bg-transparent px-3 text-[13px] font-medium text-foreground/70 transition-all duration-150 hover:bg-hover-bg hover:text-foreground">
            <SlidersHorizontal size={13} strokeWidth={1.5} />
            Filter
          </button>
          <button className="inline-flex items-center gap-1.5 h-[36px] rounded-[10px] border border-border/40 bg-transparent px-3 text-[13px] font-medium text-foreground/70 transition-all duration-150 hover:bg-hover-bg hover:text-foreground">
            <ArrowUpDown size={13} strokeWidth={1.5} />
            Sort
          </button>
          <button className="inline-flex items-center gap-1.5 h-[36px] rounded-[10px] border border-border/40 bg-transparent px-3 text-[13px] font-medium text-foreground/70 transition-all duration-150 hover:bg-hover-bg hover:text-foreground">
            <Download size={13} strokeWidth={1.5} />
            Import
          </button>
        </motion.div>

        {/* ── METRIC CARDS ── */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <MetricCard key={m.label} m={m} />
          ))}
        </motion.div>

        {/* ── CUSTOMER TABLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className={cn(CARD, "overflow-hidden flex flex-col")}
        >
          <div className={cn(CARD_HEADER, "flex items-center justify-between shrink-0")}>
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-semibold text-foreground">All Customers</h2>
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground/60 tabular-nums">
                {filtered.length}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground/40">
              Showing {filtered.length} of {customers.length}
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <motion.table
              variants={stagger}
              initial="hidden"
              animate="show"
              className="w-full table-fixed"
            >
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b border-border/25">
                  <th className="px-3 py-2.5 w-12 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40" />
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Customer</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Message</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Status</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Conversations</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Bookings</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Last Active</th>
                  <th className="px-3 py-2.5 w-[80px] text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <CustomerRow key={c.id} customer={c} index={i} />
                ))}
              </tbody>
            </motion.table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-muted/50 mb-4">
                <Users size={22} strokeWidth={1.5} className="text-muted-foreground/25" />
              </div>
              <p className="text-[13px] font-semibold text-foreground/60 mb-1">No customers found</p>
              <p className="text-[12px] text-muted-foreground/40 max-w-[200px] leading-relaxed">
                {search ? "Try a different search term" : "Add your first customer to get started"}
              </p>
            </div>
          )}
        </motion.div>

        {/* ── CUSTOMER SEGMENTS ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-foreground">Customer Segments</h2>
            <button className="text-[12px] font-medium text-muted-foreground/40 transition-colors hover:text-foreground">
              View all
            </button>
          </div>
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {segments.map((s) => (
              <SegmentCard key={s.label} segment={s} />
            ))}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
