"use client";

import { useState, useCallback } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Sparkline } from "@/components/app/Sparkline";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Phone,
  Search,
  Radio,
  BarChart3,
  Clock,
  ArrowRight,
  CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Design Tokens ── */

const CARD = "rounded-[16px] border border-border/30 bg-card shadow-[var(--shadow-card)]";
const CARD_HEADER = "px-5 py-3.5 border-b border-border/25";
const CARD_BODY = "p-5";
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

const kpis = [
  { label: "Conversations", value: 1248, trend: "+12%", trendUp: true, micro: "vs yesterday", icon: MessageSquare, sparkline: [65, 72, 78, 82, 76, 85, 90, 88, 94, 92, 98, 102], color: "#6366f1" },
  { label: "Customers", value: 486, trend: "+21", trendUp: true, micro: "this week", icon: Users, sparkline: [18, 22, 25, 28, 32, 30, 35, 38, 42, 40, 45, 48], color: "#22c55e" },
  { label: "Bookings", value: 89, trend: "Today +4", trendUp: true, micro: "vs last Friday", icon: Calendar, sparkline: [5, 8, 6, 10, 9, 12, 11, 14, 13, 15, 14, 16], color: "#f59e0b" },
  { label: "Response Rate", value: 96, suffix: "%", trend: "+3%", trendUp: true, micro: "vs last week", icon: TrendingUp, sparkline: [88, 89, 90, 91, 92, 93, 93, 94, 94, 95, 95, 96], color: "#8b5cf6" },
];

const conversations = [
  { name: "Ahmed Khan", initials: "AK", message: "Can I book for tomorrow?", time: "2m", unread: true },
  { name: "Fatima Al-Rashid", initials: "FA", message: "Thank you so much!", time: "12m", unread: false },
  { name: "Restaurant ABC", initials: "RA", message: "Table for four please.", time: "38m", unread: false },
  { name: "Sofia Martinez", initials: "SM", message: "What are your opening hours?", time: "1h", unread: false },
  { name: "James Lee", initials: "JL", message: "I need to reschedule.", time: "2h", unread: false },
  { name: "Layla Hassan", initials: "LH", message: "Availability this Saturday?", time: "3h", unread: false },
  { name: "Omar Siddiqui", initials: "OS", message: "Quote for highlights?", time: "5h", unread: false },
];

const bookings = [
  { time: "10:00 AM", customer: "Sofia N.", service: "Balayage", status: "confirmed" as const },
  { time: "11:30 AM", customer: "James L.", service: "Men's Haircut", status: "confirmed" as const },
  { time: "1:00 PM", customer: "Ahmed K.", service: "Beard Trim", status: "pending" as const },
  { time: "3:30 PM", customer: "Fatima R.", service: "Hair Coloring", status: "confirmed" as const },
  { time: "5:00 PM", customer: "Sofia M.", service: "Blow Dry", status: "pending" as const },
];

const quickActions = [
  { label: "Add Knowledge", icon: Search, description: "Train your AI with new info", color: "#6366f1", bg: "rgba(99,102,241,0.07)" },
  { label: "Broadcast", icon: Radio, description: "Message all customers", color: "#f59e0b", bg: "rgba(245,158,11,0.07)" },
  { label: "Analytics", icon: BarChart3, description: "View performance metrics", color: "#22c55e", bg: "rgba(34,197,94,0.07)" },
  { label: "New Booking", icon: CalendarPlus, description: "Schedule an appointment", color: "#8b5cf6", bg: "rgba(139,92,246,0.07)" },
];

const systemStatus = [
  { label: "WhatsApp Connected", ok: true, uptime: "99.9%" },
  { label: "AI Online", ok: true, uptime: "99.8%" },
  { label: "Knowledge Base Synced", ok: true, uptime: "100%" },
];

const activity = [
  { text: "Ahmed booked an appointment", time: "2 min ago", dot: "bg-success" },
  { text: "Knowledge Base updated", time: "10 min ago", dot: "bg-accent-amber" },
  { text: "Broadcast sent to 142 contacts", time: "1 hr ago", dot: "bg-voice" },
  { text: "New customer created", time: "2 hr ago", dot: "bg-accent-indigo" },
  { text: "Sofia confirmed booking", time: "3 hr ago", dot: "bg-success" },
  { text: "AI resolved Fatima's query", time: "5 hr ago", dot: "bg-primary-light" },
];

type BadgeVariant = "unread" | "confirmed" | "pending";

const badgeStyles: Record<BadgeVariant, { label: string; className: string }> = {
  unread: { label: "Unread", className: "bg-accent/10 text-accent" },
  confirmed: { label: "Confirmed", className: "bg-success/[0.08] text-success" },
  pending: { label: "Pending", className: "bg-[rgba(217,119,6,0.1)] text-[#c98a1a]" },
};

function StatusBadge({ variant }: { variant: BadgeVariant }) {
  const c = badgeStyles[variant];
  return (
    <span className={cn("inline-flex h-[18px] items-center rounded-full px-2 text-[10px] font-semibold tracking-wide", c.className)}>
      {c.label}
    </span>
  );
}

/* ── KPI Card ── */

function KpiCard({ kpi }: { kpi: (typeof kpis)[number] }) {
  const count = useCountUp(kpi.value, 1400);
  const Icon = kpi.icon;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={cn(
        CARD,
        "p-5 cursor-default transition-all duration-150",
        "hover:shadow-[var(--shadow-card-hover)] hover:border-border/50",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-muted-foreground/50 tracking-widest uppercase">
          {kpi.label}
        </span>
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-muted/50">
          <Icon size={14} strokeWidth={1.8} className="text-muted-foreground/40" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[32px] font-bold text-foreground tracking-[-0.03em] leading-none tabular-nums">
            {count.toLocaleString()}{kpi.suffix ?? ""}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className={cn("text-[11px] font-semibold", kpi.trendUp ? "text-success" : "text-destructive")}>
              {kpi.trend}
            </span>
            <span className="text-[11px] text-muted-foreground/40">{kpi.micro}</span>
          </div>
        </div>
        <Sparkline data={kpi.sparkline} color={kpi.color} />
      </div>
    </motion.div>
  );
}

/* ── Page ── */

export default function DashboardPage() {
  const [hoveredConv, setHoveredConv] = useState<number | null>(null);
  const [hoveredBooking, setHoveredBooking] = useState<number | null>(null);

  const handleConvHover = useCallback((i: number | null) => setHoveredConv(i), []);
  const handleBookingHover = useCallback((i: number | null) => setHoveredBooking(i), []);

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
            <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em] leading-none">
              Overview
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground/50">
              Monitor your workspace and customer activity.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-medium",
                "border border-border/50 bg-card text-foreground/70",
                "transition-all duration-150 hover:bg-hover-bg hover:text-foreground hover:border-border/80",
              )}
            >
              <Phone size={14} strokeWidth={1.8} />
              Connect WhatsApp
            </button>
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold",
                "bg-accent text-white transition-all duration-150",
                "hover:bg-accent-hover",
              )}
            >
              <Plus size={14} strokeWidth={2} />
              New Broadcast
            </button>
          </div>
        </motion.div>

        {/* ── KPI CARDS ── */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </motion.div>

        {/* ── CONVERSATIONS + TODAY'S SUMMARY ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
          {/* Conversations */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className={cn(CARD, "flex flex-col overflow-hidden")}
          >
            <div className={cn(CARD_HEADER, "flex items-center justify-between")}>
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-semibold text-foreground">Recent Conversations</h2>
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent/10 px-1.5 text-[10px] font-bold text-accent">
                  {conversations.filter(c => c.unread).length}
                </span>
              </div>
              <button className="text-[12px] font-medium text-muted-foreground/50 transition-colors hover:text-foreground">
                View all
              </button>
            </div>
            <div className="flex-1">
              {conversations.map((conv, i) => (
                <button
                  key={conv.name}
                  onMouseEnter={() => handleConvHover(i)}
                  onMouseLeave={() => handleConvHover(null)}
                  className={cn(
                    "flex w-full items-center gap-3 px-5 py-2.5 text-left",
                    "transition-all duration-150 border-l-2",
                    hoveredConv === i ? "bg-hover-bg/60 border-l-accent/50" : "border-l-transparent",
                    i < conversations.length - 1 && "border-b border-border/15",
                  )}
                >
                  <div className={cn(
                    "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                    conv.unread ? "bg-accent/10 text-accent" : "bg-muted text-foreground/50",
                  )}>
                    {conv.initials}
                    {conv.unread && (
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border-[1.5px] border-card bg-accent" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={cn("text-[13px] truncate block", conv.unread ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
                      {conv.name}
                    </span>
                    <p className={cn("text-[12px] truncate mt-0.5", conv.unread ? "text-muted-foreground/60" : "text-muted-foreground/45")}>
                      {conv.message}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-[11px] text-muted-foreground/40 whitespace-nowrap tabular-nums">{conv.time}</span>
                    {conv.unread && <StatusBadge variant="unread" />}
                  </div>
                </button>
              ))}
            </div>
            <div className={cn(CARD_HEADER, "border-b-0 border-t")}>
              <button className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground/50 transition-colors hover:text-foreground">
                Open Inbox
                <ArrowRight size={12} strokeWidth={1.8} />
              </button>
            </div>
          </motion.div>

          {/* Today's Summary */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className={cn(CARD, "flex flex-col overflow-hidden")}
          >
            <div className={CARD_HEADER}>
              <h2 className="text-[13px] font-semibold text-foreground">Today&apos;s Summary</h2>
            </div>
            <div className="flex-1 p-5 space-y-0">
              {[
                { label: "Conversations handled", value: "24", icon: MessageSquare, color: "text-primary-light" },
                { label: "New customers", value: "8", icon: Users, color: "text-success" },
                { label: "Bookings", value: "5", icon: Calendar, color: "text-[#f59e0b]" },
                { label: "Response rate", value: "96%", icon: TrendingUp, color: "text-voice" },
              ].map((item, i, arr) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 py-3",
                    i < arr.length - 1 && "border-b border-border/15",
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-muted/50">
                    <item.icon size={15} strokeWidth={1.6} className={item.color} />
                  </div>
                  <span className="flex-1 text-[13px] text-foreground/70">{item.label}</span>
                  <span className="text-[16px] font-bold text-foreground tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── BOOKINGS + QUICK ACTIONS ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className={cn(CARD, "overflow-hidden")}
          >
            <div className={cn(CARD_HEADER, "flex items-center justify-between")}>
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-semibold text-foreground">Upcoming Bookings</h2>
                <span className="text-[11px] text-muted-foreground/40">Today</span>
              </div>
              <button className="text-[12px] font-medium text-muted-foreground/50 transition-colors hover:text-foreground">
                View all
              </button>
            </div>
            <div>
              {bookings.map((b, i) => (
                <div
                  key={b.customer}
                  onMouseEnter={() => handleBookingHover(i)}
                  onMouseLeave={() => handleBookingHover(null)}
                  className={cn(
                    "flex items-center gap-4 px-5 py-3 transition-all duration-150",
                    "hover:bg-hover-bg/50",
                    i < bookings.length - 1 && "border-b border-border/15",
                  )}
                >
                  <div className="flex items-center gap-2 w-[100px] shrink-0">
                    <Clock size={12} strokeWidth={1.5} className="text-muted-foreground/30" />
                    <span className="text-[12px] text-muted-foreground/55 font-medium tabular-nums">{b.time}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[13px] font-medium text-foreground">{b.customer}</span>
                    <span className="text-[12px] text-muted-foreground/40 ml-2">{b.service}</span>
                  </div>
                  <StatusBadge variant={b.status} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.25 }}
            className={cn(CARD, "overflow-hidden")}
          >
            <div className={CARD_HEADER}>
              <h2 className="text-[13px] font-semibold text-foreground">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border/15">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="group flex flex-col items-center gap-3 bg-card p-5 text-center transition-all duration-150 hover:bg-hover-bg/50"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-[12px] transition-all duration-150 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                      style={{ backgroundColor: action.bg }}
                    >
                      <Icon size={22} strokeWidth={1.5} style={{ color: action.color }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{action.label}</p>
                      <p className="text-[11px] text-muted-foreground/45 mt-0.5">{action.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── SYSTEM STATUS + ACTIVITY ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.3 }}
            className={cn(CARD, "overflow-hidden")}
          >
            <div className={cn(CARD_HEADER, "flex items-center justify-between")}>
              <h2 className="text-[13px] font-semibold text-foreground">System Status</h2>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="text-[11px] font-medium text-success">All operational</span>
              </div>
            </div>
            <div>
              {systemStatus.map((item, i) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center justify-between px-5 py-3",
                    i < systemStatus.length - 1 && "border-b border-border/15",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                    <span className="text-[13px] text-foreground/80">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground/40 tabular-nums">{item.uptime}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.35 }}
            className={cn(CARD, "overflow-hidden")}
          >
            <div className={CARD_HEADER}>
              <h2 className="text-[13px] font-semibold text-foreground">Recent Activity</h2>
            </div>
            <div className="px-5 py-2">
              {activity.map((item, i) => (
                <div
                  key={item.text}
                  className={cn(
                    "flex items-start gap-3 py-2.5 transition-colors duration-150 hover:bg-hover-bg/40 rounded-[6px] -mx-1 px-1",
                    i < activity.length - 1 && "border-b border-border/10",
                  )}
                >
                  <div className="relative flex flex-col items-center pt-[5px]">
                    <div className={cn("h-2 w-2 rounded-full shrink-0", item.dot)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-foreground/80 leading-snug">{item.text}</p>
                    <p className="text-[11px] text-muted-foreground/40 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
