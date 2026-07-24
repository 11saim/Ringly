"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Sparkline } from "@/components/app/Sparkline";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Users,
  Calendar,
  Sparkles,
  Plus,
  Phone,
  Search,
  GraduationCap,
  Radio,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   ────────────────────────────────────────────────────────── */

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ──────────────────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────────────────── */

const kpis = [
  {
    label: "Total Conversations",
    value: 1248,
    trend: "+12%",
    trendUp: true,
    micro: "vs yesterday",
    icon: MessageSquare,
    sparkline: [65, 72, 78, 82, 76, 85, 90, 88, 94, 92, 98, 102],
    color: "#6366f1",
  },
  {
    label: "Customers",
    value: 486,
    trend: "+21",
    trendUp: true,
    micro: "this week",
    icon: Users,
    sparkline: [18, 22, 25, 28, 32, 30, 35, 38, 42, 40, 45, 48],
    color: "#22c55e",
  },
  {
    label: "Bookings",
    value: 89,
    trend: "Today +4",
    trendUp: true,
    micro: "vs last Friday",
    icon: Calendar,
    sparkline: [5, 8, 6, 10, 9, 12, 11, 14, 13, 15, 14, 16],
    color: "#f59e0b",
  },
  {
    label: "AI Resolution",
    value: 93,
    suffix: "%",
    trend: "Excellent",
    trendUp: true,
    micro: "30-day avg",
    icon: Sparkles,
    sparkline: [82, 84, 85, 87, 88, 89, 90, 91, 91, 92, 93, 93],
    color: "#8b5cf6",
  },
];

const conversations = [
  { name: "Ahmed Khan", initials: "AK", message: "Can I book for tomorrow?", time: "2m", status: "unread" as const, unread: true },
  { name: "Fatima Al-Rashid", initials: "FA", message: "Thank you so much!", time: "12m", status: "resolved" as const, unread: false },
  { name: "Restaurant ABC", initials: "RA", message: "Table for four please.", time: "38m", status: "ai-replied" as const, unread: false },
  { name: "Sofia Martinez", initials: "SM", message: "What are your opening hours?", time: "1h", status: "ai-replied" as const, unread: false },
  { name: "James Lee", initials: "JL", message: "I need to reschedule my appointment.", time: "2h", status: "resolved" as const, unread: false },
];

const aiSuggestions = [
  { title: "High response volume", description: "14 unanswered conversations from the last hour. Consider enabling auto-replies.", priority: "high" as const, confidence: 92, action: "Review Now" },
  { title: "Friday bookings trend", description: "Customers are asking about Friday bookings more than usual this week.", priority: "medium" as const, confidence: 85, action: "View Insights" },
  { title: "Booking requests up", description: "Booking requests increased 24% compared to last week. Peak: 10AM–12PM.", priority: "medium" as const, confidence: 78, action: "See Details" },
  { title: "Knowledge gap detected", description: "Customers frequently ask about your refund policy. Add to knowledge base.", priority: "high" as const, confidence: 88, action: "Add Topic" },
  { title: "Peak hours approaching", description: "Response volume typically spikes in 30 minutes. Staff may need support.", priority: "low" as const, confidence: 71, action: "Dismiss" },
];

const bookings = [
  { time: "10:00 AM", customer: "Sofia N.", service: "Balayage", status: "confirmed" as const, aiReminder: true },
  { time: "11:30 AM", customer: "James L.", service: "Men's Haircut", status: "confirmed" as const, aiReminder: true },
  { time: "1:00 PM", customer: "Ahmed K.", service: "Beard Trim", status: "pending" as const, aiReminder: false },
  { time: "3:30 PM", customer: "Fatima R.", service: "Hair Coloring", status: "confirmed" as const, aiReminder: true },
  { time: "5:00 PM", customer: "Sofia M.", service: "Blow Dry", status: "pending" as const, aiReminder: false },
];

const quickActions = [
  { label: "Add Knowledge", icon: Search, description: "Train your AI with new information", color: "#6366f1" },
  { label: "Train AI", icon: GraduationCap, description: "Improve your AI agent's responses", color: "#8b5cf6" },
  { label: "Create Broadcast", icon: Radio, description: "Send a message to all customers", color: "#f59e0b" },
  { label: "View Analytics", icon: BarChart3, description: "See detailed performance metrics", color: "#22c55e" },
];

const systemStatus = [
  { label: "WhatsApp Connected", ok: true, uptime: "99.9%" },
  { label: "AI Online", ok: true, uptime: "99.8%" },
  { label: "Knowledge Base Synced", ok: true, uptime: "100%" },
  { label: "Broadcast Service", ok: true, uptime: "99.7%" },
];

const activity = [
  { text: "AI answered Ahmed Khan", time: "2m ago", type: "ai" as const },
  { text: "New customer created", time: "8m ago", type: "customer" as const },
  { text: "Knowledge base updated", time: "25m ago", type: "knowledge" as const },
  { text: "Broadcast sent to 142 contacts", time: "1h ago", type: "broadcast" as const },
  { text: "Booking confirmed for Sofia N.", time: "2h ago", type: "booking" as const },
  { text: "AI resolved Fatima's query", time: "3h ago", type: "ai" as const },
];

const activityDotColors: Record<string, string> = {
  ai: "bg-success",
  customer: "bg-accent-indigo",
  knowledge: "bg-accent-amber",
  broadcast: "bg-voice",
  booking: "bg-info",
};

/* ──────────────────────────────────────────────────────────
   STATUS BADGES
   ────────────────────────────────────────────────────────── */

type BadgeVariant = "unread" | "resolved" | "ai-replied" | "confirmed" | "pending";

const badgeStyles: Record<BadgeVariant, { label: string; className: string }> = {
  unread: { label: "Unread", className: "bg-accent/10 text-accent" },
  resolved: { label: "Resolved", className: "bg-muted text-muted-foreground" },
  "ai-replied": { label: "AI replied", className: "bg-primary/8 text-primary-light" },
  confirmed: { label: "Confirmed", className: "bg-success/8 text-success" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning" },
};

function StatusBadge({ variant }: { variant: BadgeVariant }) {
  const c = badgeStyles[variant];
  return (
    <span className={cn("inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium tracking-wide", c.className)}>
      {c.label}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   PRIORITY PILL
   ────────────────────────────────────────────────────────── */

const priorityStyles = {
  high: { label: "HIGH", className: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
  medium: { label: "MEDIUM", className: "bg-accent-amber/10 text-accent-amber", dot: "bg-accent-amber" },
  low: { label: "LOW", className: "bg-muted text-muted-foreground", dot: "bg-muted-foreground/40" },
};

function PriorityPill({ priority }: { priority: "high" | "medium" | "low" }) {
  const c = priorityStyles[priority];
  return (
    <span className={cn("inline-flex h-5 items-center gap-1 rounded-full px-2 text-[9px] font-semibold uppercase tracking-wider", c.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   KPI CARD
   ────────────────────────────────────────────────────────── */

function KpiCard({ kpi }: { kpi: (typeof kpis)[number] }) {
  const count = useCountUp(kpi.value, 1400);
  const Icon = kpi.icon;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "group relative rounded-[20px] border border-border/30 bg-card p-6",
        "transition-shadow duration-200",
        "hover:shadow-[var(--shadow-card-hover)] hover:border-border/50",
        "cursor-default",
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-[12px] font-medium text-muted-foreground/50 tracking-wide uppercase">
          {kpi.label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-muted/50">
          <Icon size={16} strokeWidth={1.5} className="text-muted-foreground/35" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[40px] font-bold text-foreground tracking-[-0.03em] leading-none tabular-nums">
            {count.toLocaleString()}{kpi.suffix ?? ""}
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={cn("text-[12px] font-semibold", kpi.trendUp ? "text-success" : "text-destructive")}>
              {kpi.trend}
            </span>
            <span className="text-[11px] text-muted-foreground/40">
              {kpi.micro}
            </span>
          </div>
        </div>
        <Sparkline data={kpi.sparkline} color={kpi.color} />
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const [hoveredConv, setHoveredConv] = useState<number | null>(null);

  return (
    <AppShell>
      <div className="space-y-10">
        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-start justify-between gap-4 pt-2"
        >
          <div>
            <h1 className="text-[40px] font-bold text-foreground tracking-[-0.03em] leading-none">
              Overview
            </h1>
            <p className="mt-2 text-[14px] text-muted-foreground/50 leading-relaxed">
              Monitor your AI workspace and customer activity in real time.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-[13px] font-medium",
                "border border-border/40 bg-transparent text-foreground/70",
                "transition-all duration-200",
                "hover:bg-hover-bg hover:text-foreground hover:border-border/60",
                "active:bg-muted",
              )}
            >
              <Phone size={15} strokeWidth={1.5} />
              Connect WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold",
                "bg-accent text-white",
                "transition-all duration-200",
                "hover:bg-accent-hover hover:shadow-[0_4px_16px_rgba(34,197,94,0.25)]",
                "active:bg-accent-active",
              )}
            >
              <Plus size={15} strokeWidth={2} />
              New Broadcast
            </motion.button>
          </div>
        </motion.div>

        {/* ── ROW 1: KPI CARDS ── */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </motion.div>

        {/* ── ROW 2: CONVERSATIONS + AI INSIGHTS ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
          {/* Conversations */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-[20px] border border-border/30 bg-card overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[14px] font-semibold text-foreground">Recent Conversations</h2>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent/10 px-1.5 text-[10px] font-semibold text-accent">
                  5
                </span>
              </div>
              <button type="button" className="text-[12px] font-medium text-muted-foreground/40 transition-colors hover:text-foreground">
                View all
              </button>
            </div>
            <motion.div variants={stagger} initial="hidden" animate="show">
              {conversations.map((conv, i) => (
                <motion.button
                  key={conv.name}
                  variants={fadeUp}
                  onHoverStart={() => setHoveredConv(i)}
                  onHoverEnd={() => setHoveredConv(null)}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 px-6 py-3.5 text-left",
                    "transition-all duration-150",
                    hoveredConv === i ? "bg-hover-bg/60" : "",
                    i < conversations.length - 1 && "border-b border-border/25",
                  )}
                >
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground/50 transition-transform duration-200 group-hover:scale-105">
                    {conv.initials}
                    {conv.unread && (
                      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent animate-pulse-green" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-foreground truncate">{conv.name}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground/50">
                        <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground/45 truncate mt-[2px]">{conv.message}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-[11px] text-muted-foreground/35 whitespace-nowrap">{conv.time}</span>
                    <StatusBadge variant={conv.status} />
                  </div>
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className={cn(
                      "shrink-0 text-muted-foreground/20 transition-all duration-200",
                      hoveredConv === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1",
                    )}
                  />
                </motion.button>
              ))}
            </motion.div>
            <div className="border-t border-border/25 px-6 py-3">
              <button type="button" className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground/40 transition-colors hover:text-foreground">
                Open Inbox
                <ArrowRight size={12} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-[20px] border border-border/30 bg-card overflow-hidden"
          >
            <div className="flex items-center gap-2.5 border-b border-border/30 px-6 py-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary/[0.06]">
                <Sparkles size={14} strokeWidth={1.5} className="text-primary-light" />
              </div>
              <h2 className="text-[14px] font-semibold text-foreground">AI Suggestions</h2>
            </div>
            <motion.div variants={stagger} initial="hidden" animate="show" className="divide-y divide-border/25">
              {aiSuggestions.map((s) => (
                <motion.div
                  key={s.title}
                  variants={fadeUp}
                  whileHover={{ backgroundColor: "var(--hover-bg)" }}
                  className="group flex items-start gap-3 px-6 py-4 cursor-pointer transition-colors"
                >
                  <div className="mt-0.5 shrink-0">
                    <PriorityPill priority={s.priority} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-foreground leading-snug">{s.title}</p>
                      <span className="text-[10px] font-medium text-muted-foreground/35 tabular-nums">{s.confidence}%</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground/45 leading-snug mt-[3px]">{s.description}</p>
                    <button
                      type="button"
                      className="mt-2.5 inline-flex items-center gap-1 rounded-[8px] bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-foreground/60 transition-all hover:bg-muted hover:text-foreground"
                    >
                      {s.action}
                      <ChevronRight size={10} strokeWidth={2} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── ROW 3: BOOKINGS + QUICK ACTIONS ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-[20px] border border-border/30 bg-card overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[14px] font-semibold text-foreground">Upcoming Bookings</h2>
                <span className="text-[11px] font-medium text-muted-foreground/35">Today</span>
              </div>
              <button type="button" className="text-[12px] font-medium text-muted-foreground/40 transition-colors hover:text-foreground">
                View all
              </button>
            </div>
            <motion.div variants={stagger} initial="hidden" animate="show" className="px-6 py-1">
              {bookings.map((b, i) => (
                <motion.div
                  key={b.customer}
                  variants={fadeUp}
                  whileHover={{ backgroundColor: "var(--hover-bg)", borderRadius: "12px" }}
                  className={cn(
                    "flex items-center gap-4 px-3 py-3.5 -mx-1 transition-colors",
                    i < bookings.length - 1 && "border-b border-border/25",
                  )}
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center shrink-0 w-2">
                    <div className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      b.status === "confirmed" ? "bg-success shadow-[0_0_6px_rgba(22,163,74,0.3)]" : "bg-warning shadow-[0_0_6px_rgba(217,119,6,0.3)]",
                    )} />
                  </div>
                  <div className="flex items-center gap-2 w-[96px] shrink-0">
                    <Clock size={12} strokeWidth={1.5} className="text-muted-foreground/30" />
                    <span className="text-[12px] text-muted-foreground/55 font-medium tabular-nums">{b.time}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-foreground">{b.customer}</span>
                      <span className="text-[12px] text-muted-foreground/40">{b.service}</span>
                    </div>
                  </div>
                  {b.aiReminder && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/[0.05] px-2 py-0.5 text-[9px] font-medium text-primary-light shrink-0">
                      <Zap size={8} strokeWidth={2} />
                      AI reminder
                    </span>
                  )}
                  <StatusBadge variant={b.status} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-[20px] border border-border/30 bg-card overflow-hidden"
          >
            <div className="border-b border-border/30 px-6 py-4">
              <h2 className="text-[14px] font-semibold text-foreground">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border/20">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.015, backgroundColor: "var(--card)" }}
                    whileTap={{ scale: 0.985 }}
                    type="button"
                    className="group flex flex-col items-start gap-3.5 bg-card p-5 text-left transition-colors"
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-all duration-200 group-hover:scale-110"
                      style={{ backgroundColor: `${action.color}0D` }}
                    >
                      <Icon size={18} strokeWidth={1.5} style={{ color: action.color }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground leading-snug">{action.label}</p>
                      <p className="text-[12px] text-muted-foreground/45 leading-snug mt-1">{action.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── ROW 4: SYSTEM STATUS + ACTIVITY ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-[20px] border border-border/30 bg-card overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[14px] font-semibold text-foreground">System Status</h2>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  <span className="text-[11px] font-medium text-success">All systems operational</span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground/35">Last checked 2m ago</span>
            </div>
            <motion.div variants={stagger} initial="hidden" animate="show">
              {systemStatus.map((item, i) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  whileHover={{ backgroundColor: "var(--hover-bg)" }}
                  className={cn(
                    "flex items-center justify-between px-6 py-3.5 transition-colors",
                    i < systemStatus.length - 1 && "border-b border-border/25",
                  )}
                >
                  <span className="text-[13px] text-foreground/80">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-muted-foreground/35 tabular-nums">{item.uptime} uptime</span>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} strokeWidth={1.5} className="text-success" />
                      <span className="text-[11px] font-medium text-success">{item.ok ? "Operational" : "Issue"}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Activity */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-[20px] border border-border/30 bg-card overflow-hidden"
          >
            <div className="border-b border-border/30 px-6 py-4">
              <h2 className="text-[14px] font-semibold text-foreground">Recent Activity</h2>
            </div>
            <motion.div variants={stagger} initial="hidden" animate="show" className="px-6 py-2">
              {activity.map((item, i) => (
                <motion.div key={item.text} variants={fadeUp} className="flex items-start gap-3 py-3">
                  <div className="relative flex flex-col items-center">
                    <div className={cn("h-2 w-2 rounded-full shrink-0 mt-[5px]", activityDotColors[item.type])} />
                    {i < activity.length - 1 && (
                      <div className="absolute top-3.5 bottom-0 left-1/2 -translate-x-1/2 w-px bg-border/25" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pt-[1px]">
                    <p className="text-[13px] text-foreground/80 leading-snug">{item.text}</p>
                    <p className="text-[11px] text-muted-foreground/35 mt-0.5">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
