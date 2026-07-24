"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Sparkline } from "@/components/app/Sparkline";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import {
  Users, UserPlus, Search, SlidersHorizontal, ArrowUpDown,
  MoreHorizontal, MessageSquare, Star, Clock,
  TrendingUp, Eye, UserCheck, UserX, AlertTriangle, Heart,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Animation Variants ── */

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ── Data ── */

const metrics = [
  {
    label: "Total Customers",
    value: 486,
    trend: "+21 this week",
    trendUp: true,
    icon: Users,
    sparkline: [18, 22, 25, 28, 32, 30, 35, 38, 42, 40, 45, 48],
    color: "#6366f1",
  },
  {
    label: "New Customers",
    value: 48,
    trend: "+12%",
    trendUp: true,
    icon: UserPlus,
    sparkline: [3, 5, 4, 7, 6, 8, 5, 9, 7, 10, 8, 12],
    color: "#22c55e",
  },
  {
    label: "Returning Customers",
    value: 71,
    suffix: "%",
    trend: "Excellent retention",
    trendUp: true,
    icon: TrendingUp,
    sparkline: [62, 64, 65, 67, 68, 69, 70, 70, 71, 71, 72, 71],
    color: "#8b5cf6",
  },
  {
    label: "Avg Response Time",
    value: 84,
    prefix: "",
    suffix: "",
    displayValue: "1m 24s",
    trend: "AI average",
    trendUp: true,
    icon: Clock,
    sparkline: [120, 115, 108, 95, 90, 88, 86, 85, 84, 84, 84, 84],
    color: "#f59e0b",
  },
];

interface Customer {
  id: string;
  name: string;
  initials: string;
  phone: string;
  lastMessage: string;
  status: "active" | "new" | "attention" | "vip";
  satisfaction: number;
  conversations: number;
  bookings: number;
  lastActive: string;
  revenue: number;
  online: boolean;
}

const customers: Customer[] = [
  { id: "c1", name: "Ahmed Khan", initials: "AK", phone: "+92 300 1234567", lastMessage: "Can I book tomorrow?", status: "vip", satisfaction: 94, conversations: 18, bookings: 4, lastActive: "2m ago", revenue: 420, online: true },
  { id: "c2", name: "Fatima Rashid", initials: "FR", phone: "+971 55 987 6543", lastMessage: "Need pricing", status: "active", satisfaction: 98, conversations: 7, bookings: 2, lastActive: "15m ago", revenue: 180, online: false },
  { id: "c3", name: "Restaurant ABC", initials: "RA", phone: "+971 4 234 5678", lastMessage: "Table for four", status: "vip", satisfaction: 100, conversations: 43, bookings: 18, lastActive: "38m ago", revenue: 2400, online: true },
  { id: "c4", name: "Sofia Martinez", initials: "SM", phone: "+971 50 111 2233", lastMessage: "Opening hours?", status: "active", satisfaction: 92, conversations: 9, bookings: 0, lastActive: "1h ago", revenue: 0, online: false },
  { id: "c5", name: "James Lee", initials: "JL", phone: "+971 56 321 0987", lastMessage: "Need refund", status: "attention", satisfaction: 71, conversations: 5, bookings: 0, lastActive: "Yesterday", revenue: 80, online: false },
  { id: "c6", name: "Layla Mahmoud", initials: "LM", phone: "+971 52 444 5566", lastMessage: "What are your prices?", status: "new", satisfaction: 0, conversations: 1, bookings: 0, lastActive: "5m ago", revenue: 0, online: true },
  { id: "c7", name: "Omar Hassan", initials: "OH", phone: "+971 50 777 8899", lastMessage: "Thanks for the help!", status: "active", satisfaction: 96, conversations: 12, bookings: 3, lastActive: "2h ago", revenue: 320, online: false },
  { id: "c8", name: "Nour Al-Rashid", initials: "NR", phone: "+971 55 222 3344", lastMessage: "Can I reschedule?", status: "attention", satisfaction: 68, conversations: 3, bookings: 1, lastActive: "3h ago", revenue: 90, online: false },
  { id: "c9", name: "Maria Garcia", initials: "MG", phone: "+971 56 555 6677", lastMessage: "Do you have highlights?", status: "new", satisfaction: 0, conversations: 2, bookings: 0, lastActive: "30m ago", revenue: 0, online: true },
  { id: "c10", name: "Ali Nagi", initials: "AN", phone: "+971 50 999 0011", lastMessage: "Best salon in Dubai!", status: "vip", satisfaction: 100, conversations: 32, bookings: 12, lastActive: "4h ago", revenue: 1800, online: false },
];

const statusConfig = {
  active: { label: "Active", className: "bg-success/8 text-success", dot: "bg-success" },
  new: { label: "New", className: "bg-accent-amber/10 text-accent-amber", dot: "bg-accent-amber" },
  attention: { label: "Needs Follow-up", className: "bg-destructive/8 text-destructive", dot: "bg-destructive" },
  vip: { label: "VIP", className: "bg-primary/[0.06] text-primary-light", dot: "bg-primary-light" },
};

const segments = [
  { label: "VIP Customers", count: 4, pct: "0.8%", icon: Star, color: "#8b5cf6", description: "High-value repeat customers" },
  { label: "Repeat Customers", count: 8, pct: "1.6%", icon: Heart, color: "#22c55e", description: "2+ conversations" },
  { label: "New Customers", count: 12, pct: "2.5%", icon: UserCheck, color: "#6366f1", description: "First conversation this week" },
  { label: "Inactive Customers", count: 6, pct: "1.2%", icon: UserX, color: "#f59e0b", description: "No activity in 30 days" },
];

/* ── Metric Card ── */

function MetricCard({ m }: { m: (typeof metrics)[number] }) {
  const Icon = m.icon;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="rounded-[20px] border border-border/30 bg-card p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)] hover:border-border/50 cursor-default"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-medium text-muted-foreground/50 tracking-wide uppercase">{m.label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-muted/50">
          <Icon size={14} strokeWidth={1.5} className="text-muted-foreground/35" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[32px] font-bold text-foreground tracking-[-0.03em] leading-none tabular-nums">
            {m.displayValue ?? (
              <>
                {m.prefix}
                <CountUp end={m.value} />
                {m.suffix}
              </>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1.5">
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

  return (
    <motion.tr
      variants={fadeUp}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn(
        "group border-b border-border/25 transition-colors duration-150",
        hovered ? "bg-hover-bg/60" : "",
      )}
    >
      <td className="px-4 py-3.5 w-10">
        <input
          type="checkbox"
          className="h-3.5 w-3.5 rounded border-border/50 text-accent focus:ring-accent cursor-pointer"
        />
      </td>
      <td className="px-4 py-3.5">
        <div className="relative">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold",
            customer.status === "vip" ? "bg-primary/[0.06] text-primary-light" : "bg-muted text-foreground/50",
          )}>
            {customer.initials}
          </div>
          {customer.online && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
          )}
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div>
          <span className={cn(
            "text-[13px] font-semibold text-foreground",
            customer.status === "vip" && "text-primary-light",
          )}>
            {customer.name}
          </span>
          <p className="text-[11px] text-muted-foreground/45 mt-0.5">{customer.phone}</p>
        </div>
      </td>
      <td className="px-4 py-3.5 max-w-[200px]">
        <p className="text-[12px] text-muted-foreground/50 truncate">{customer.lastMessage}</p>
      </td>
      <td className="px-4 py-3.5">
        <span className={cn(
          "inline-flex h-5 items-center gap-1 rounded-full px-2 text-[10px] font-medium tracking-wide",
          s.className,
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
          {s.label}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${customer.satisfaction}%` }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className={cn(
                "h-full rounded-full",
                customer.satisfaction >= 90 ? "bg-success" : customer.satisfaction >= 70 ? "bg-accent-amber" : "bg-destructive",
              )}
            />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground/60 tabular-nums">{customer.satisfaction}%</span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-center">
        <span className="text-[12px] font-medium text-foreground/70 tabular-nums">{customer.conversations}</span>
      </td>
      <td className="px-4 py-3.5 text-center">
        <span className="text-[12px] font-medium text-foreground/70 tabular-nums">{customer.bookings}</span>
      </td>
      <td className="px-4 py-3.5">
        <span className="text-[11px] text-muted-foreground/40">{customer.lastActive}</span>
      </td>
      <td className="px-4 py-3.5">
        <div className={cn(
          "flex items-center gap-1 opacity-0 transition-opacity duration-150",
          hovered && "opacity-100",
        )}>
          <button className="flex h-7 items-center gap-1 rounded-[6px] bg-muted/60 px-2 text-[10px] font-medium text-foreground/60 transition-all hover:bg-muted hover:text-foreground">
            <Eye size={10} strokeWidth={1.5} />
            Profile
          </button>
          <button className="flex h-7 items-center gap-1 rounded-[6px] bg-muted/60 px-2 text-[10px] font-medium text-foreground/60 transition-all hover:bg-muted hover:text-foreground">
            <MessageSquare size={10} strokeWidth={1.5} />
            Message
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground/40 transition-all hover:bg-hover-bg hover:text-foreground">
            <MoreHorizontal size={12} strokeWidth={1.5} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

/* ── Insight Card ── */

function InsightCard({ label, value, icon: Icon, color, sub }: { label: string; value: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; color: string; sub?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -1 }}
      className="rounded-[16px] border border-border/30 bg-card p-4 transition-shadow duration-200 hover:shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${color}10` }}>
          <Icon size={13} strokeWidth={1.5} className={color} />
        </div>
        <span className="text-[11px] font-medium text-muted-foreground/50">{label}</span>
      </div>
      <p className="text-[20px] font-bold text-foreground tracking-[-0.02em] tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground/40 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

/* ── Segment Card ── */

function SegmentCard({ segment }: { segment: (typeof segments)[number] }) {
  const Icon = segment.icon;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, scale: 1.01 }}
      className="rounded-[20px] border border-border/30 bg-card p-5 transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:border-border/50 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-[12px]" style={{ backgroundColor: `${segment.color}0D` }}>
          <Icon size={18} strokeWidth={1.5} style={{ color: segment.color }} />
        </div>
        <button className="text-[11px] font-medium text-muted-foreground/40 transition-colors hover:text-foreground">
          Quick View
        </button>
      </div>
      <h3 className="text-[14px] font-semibold text-foreground mb-1">{segment.label}</h3>
      <p className="text-[12px] text-muted-foreground/45 mb-3">{segment.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-[24px] font-bold text-foreground tracking-[-0.02em] tabular-nums">{segment.count}</span>
        <span className="text-[11px] font-medium text-muted-foreground/40 tabular-nums">{segment.pct}</span>
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
    <AppShell>
      <div className="space-y-8">
        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-start justify-between gap-4 pt-2"
        >
          <div>
            <h1 className="text-[40px] font-bold text-foreground tracking-[-0.03em] leading-none">Customers</h1>
            <p className="mt-2 text-[14px] text-muted-foreground/50 leading-relaxed">
              Manage your customers and understand every conversation with AI.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-2">
            <div className="relative">
              <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[200px] rounded-[10px] border border-border/30 bg-muted/40 py-2 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-200 focus:outline-none focus:border-border/60 focus:bg-muted/60"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-[10px] border border-border/40 bg-transparent px-3 py-2 text-[13px] font-medium text-foreground/70 transition-all duration-200 hover:bg-hover-bg hover:text-foreground">
              <SlidersHorizontal size={13} strokeWidth={1.5} />
              Filter
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-[10px] border border-border/40 bg-transparent px-3 py-2 text-[13px] font-medium text-foreground/70 transition-all duration-200 hover:bg-hover-bg hover:text-foreground">
              <ArrowUpDown size={13} strokeWidth={1.5} />
              Sort
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-[10px] border border-border/40 bg-transparent px-3 py-2 text-[13px] font-medium text-foreground/70 transition-all duration-200 hover:bg-hover-bg hover:text-foreground">
              <Download size={13} strokeWidth={1.5} />
              Import Contacts
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-[10px] bg-accent px-3.5 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_4px_16px_rgba(34,197,94,0.25)] active:bg-accent-active">
              <UserPlus size={14} strokeWidth={2} />
              Add Customer
            </button>
          </div>
        </motion.div>

        {/* ── METRIC CARDS ── */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <MetricCard key={m.label} m={m} />
          ))}
        </motion.div>

        {/* ── MAIN LAYOUT ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
          {/* Customer Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="rounded-[20px] border border-border/30 bg-card overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[14px] font-semibold text-foreground">All Customers</h2>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground/60 tabular-nums">
                  {filtered.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground/40">
                  Showing {filtered.length} of {customers.length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <motion.table
                variants={stagger}
                initial="hidden"
                animate="show"
                className="w-full"
              >
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" className="h-3.5 w-3.5 rounded border-border/50 text-accent focus:ring-accent cursor-pointer" />
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Customer</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Contact</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Last Message</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">AI Satisfaction</th>
                    <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Conversations</th>
                    <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Bookings</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Last Active</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40 w-[160px]">Actions</th>
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
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users size={24} strokeWidth={1.5} className="text-muted-foreground/25 mb-3" />
                <p className="text-[13px] font-medium text-muted-foreground/50">No customers found</p>
                <p className="text-[12px] text-muted-foreground/35 mt-1">Try a different search term</p>
              </div>
            )}
          </motion.div>

          {/* Right Sidebar — Customer Insights */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="space-y-3"
          >
            <h3 className="text-[13px] font-semibold text-foreground px-1">Customer Insights</h3>

            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {/* Top Customer */}
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -1 }}
                className="rounded-[16px] border border-border/30 bg-card p-4 transition-shadow duration-200 hover:shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary/[0.06]">
                    <Star size={13} strokeWidth={1.5} className="text-primary-light" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground/50">Top Customer</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/[0.06] text-[11px] font-semibold text-primary-light">
                    AK
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">Ahmed Khan</p>
                    <p className="text-[11px] text-muted-foreground/45">18 conversations · 4 bookings</p>
                  </div>
                </div>
                <div className="rounded-[10px] bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground/50">Total Revenue</span>
                    <span className="text-[16px] font-bold text-foreground tabular-nums">$420</span>
                  </div>
                </div>
              </motion.div>

              {/* Insight Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                <InsightCard label="Returning Rate" value="71%" icon={TrendingUp} color="#22c55e" sub="Excellent" />
                <InsightCard label="Need Follow-up" value="8" icon={AlertTriangle} color="#f59e0b" sub="Customers" />
                <InsightCard label="AI Satisfaction" value="93%" icon={Heart} color="#8b5cf6" sub="Average score" />
                <InsightCard label="Avg Lifetime Value" value="$118" icon={TrendingUp} color="#6366f1" sub="Per customer" />
              </div>

              {/* Most Active Time */}
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -1 }}
                className="rounded-[16px] border border-border/30 bg-card p-4 transition-shadow duration-200 hover:shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-accent-amber/10">
                    <Clock size={13} strokeWidth={1.5} className="text-accent-amber" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground/50">Most Active Time</span>
                </div>
                <p className="text-[18px] font-bold text-foreground">6PM – 9PM</p>
                <p className="text-[11px] text-muted-foreground/40 mt-0.5">Peak conversation hours</p>
                {/* Mini bar chart */}
                <div className="flex items-end gap-[3px] mt-3 h-8">
                  {[20, 35, 45, 60, 80, 95, 100, 90, 70, 50, 30, 15].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.03 }}
                      className={cn(
                        "flex-1 rounded-[2px]",
                        i === 6 || i === 7 || i === 8 ? "bg-accent-amber/60" : "bg-muted",
                      )}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[8px] text-muted-foreground/30">12PM</span>
                  <span className="text-[8px] text-muted-foreground/30">6PM</span>
                  <span className="text-[8px] text-muted-foreground/30">12AM</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── BOTTOM: Customer Segments ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-foreground">Customer Segments</h2>
            <button className="text-[12px] font-medium text-muted-foreground/40 transition-colors hover:text-foreground">
              View all segments
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
