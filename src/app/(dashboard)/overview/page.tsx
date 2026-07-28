"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Inbox,
  MessageSquare,
  Package,
  Plus,
  Radio,
  Send,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  escalatedConversations,
  todayBookingsService,
  todayOrdersProduct,
  lowStockProducts,
  upcomingAppointments,
  recentActivity,
  liveConversations,
  weeklyRevenue,
  connectionHealth,
} from "@/lib/data";
import { useTenant } from "@/lib/tenant-context";
import { cn } from "@/lib/utils";

// ── Activity icons & colors ──

const activityIcons: Record<string, React.ReactNode> = {
  booking: <Calendar className="h-4 w-4" />,
  escalation: <AlertTriangle className="h-4 w-4" />,
  low_stock: <Package className="h-4 w-4" />,
  new_contact: <Users className="h-4 w-4" />,
  broadcast: <MessageSquare className="h-4 w-4" />,
  large_order: <ShoppingBag className="h-4 w-4" />,
};

const activityColors: Record<string, string> = {
  booking: "bg-[var(--mist)] text-[var(--cedar)]",
  escalation: "bg-[var(--ember)]/10 text-[var(--ember)]",
  low_stock: "bg-[var(--amber)]/10 text-[var(--amber)]",
  new_contact: "bg-[var(--mist)] text-[var(--cedar)]",
  broadcast: "bg-[var(--linen)] text-[var(--ash)]",
  large_order: "bg-[var(--mist)] text-[var(--cedar)]",
};

const statusStyles: Record<string, string> = {
  confirmed: "bg-[var(--mist)] text-[var(--cedar)]",
  pending: "bg-[var(--amber)]/10 text-[var(--amber)]",
  cancelled: "bg-[var(--ember)]/10 text-[var(--ember)]",
};

// ── Loading Skeleton ──

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      {/* Row 1: Needs attention + Live right now */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-[var(--ember)]/20">
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-5 w-40" />
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-16" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Row 2: Revenue + Connection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-48" />
          </CardContent>
        </Card>
      </div>
      {/* Business outcomes */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <Skeleton className="h-5 w-40" />
          <div className="flex items-end gap-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
        </CardContent>
      </Card>
      {/* Recent activity */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <Skeleton className="h-5 w-32" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-md" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      {/* Quick actions */}
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

// ── Main Page ──

export default function OverviewPage() {
  const { businessType } = useTenant();
  const isService = businessType === "Service";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <OverviewSkeleton />;

  const escalations = escalatedConversations;
  const hasEscalations = escalations.length > 0;

  const todayOutcome = isService ? todayBookingsService : todayOrdersProduct;
  const outcomeLabel = isService ? "bookings" : "orders";

  const revenueDelta = weeklyRevenue.thisWeek - weeklyRevenue.lastWeek;
  const revenueUp = revenueDelta > 0;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
          Overview
        </h1>
        <p className="mt-1 text-sm text-[var(--ash)]">
          {isService
            ? "Today's snapshot for Bloom Studio."
            : "Today's snapshot for your shop."}
        </p>
      </div>

      {/* ═══ ROW 1: Needs attention + Live right now ═══ */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. NEEDS ATTENTION */}

        <Card
          className={cn(
            "transition-colors",
            hasEscalations
              ? "border-[var(--ember)]/30 bg-[var(--ember)]/5"
              : "border-[var(--slate)]",
          )}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md",
                    hasEscalations
                      ? "bg-[var(--ember)]/10 text-[var(--ember)]"
                      : "bg-[var(--linen)] text-[var(--ash)]",
                  )}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                  Needs attention
                </h3>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-[family-name:var(--font-jetbrains-mono)]",
                  hasEscalations
                    ? "border-[var(--ember)]/30 bg-[var(--ember)]/10 text-[var(--ember)]"
                    : "border-[var(--slate)] bg-[var(--linen)] text-[var(--ash)]",
                )}
              >
                {escalations.length} waiting
              </Badge>
            </div>

            {hasEscalations ? (
              <div className="space-y-0">
                {escalations.slice(0, 3).map((conv, i) => (
                  <div key={conv.id}>
                    <Link
                      href={`/inbox?id=${conv.id}`}
                      className="flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-md hover:bg-white/60 transition-colors group"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ember)]/10 text-[var(--ember)] text-xs font-semibold font-[family-name:var(--font-dm-sans)]">
                        {conv.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[var(--ink)]">
                            {conv.contact}
                          </p>
                          {conv.unread > 0 && (
                            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--ember)] px-1.5 text-[9px] font-bold text-white">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--ash)] truncate max-w-[200px]">
                          {conv.lastMessage}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Clock className="h-3 w-3 text-[var(--ash)]" />
                        <span className="text-[10px] text-[var(--ash)] font-[family-name:var(--font-jetbrains-mono)]">
                          {conv.waitingSince}
                        </span>
                      </div>
                    </Link>
                    {i < Math.min(escalations.length, 3) - 1 && <Separator />}
                  </div>
                ))}
                {escalations.length > 3 && (
                  <Link
                    href="/inbox"
                    className="flex items-center justify-center pt-2 text-xs text-[var(--cedar)] hover:text-[var(--forest)] transition-colors"
                  >
                    +{escalations.length - 3} more in inbox
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mist)] text-[var(--cedar)]">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    All clear — nothing waiting on you.
                  </p>
                  <p className="text-xs text-[var(--ash)]">
                    Escalated conversations will appear here.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. LIVE RIGHT NOW */}

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--mist)] text-[var(--cedar)]">
                  <Radio className="h-3.5 w-3.5 animate-pulse" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                  Live right now
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cedar)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--cedar)]" />
                </span>
                <span className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[var(--cedar)]">
                  LIVE
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                {liveConversations.total}
              </p>
              <p className="text-xs text-[var(--ash)]">active conversations</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-[var(--linen)] px-3 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-[var(--cedar)]" />
                  <span className="text-[10px] text-[var(--ash)]">Agent</span>
                </div>
                <p className="text-lg font-semibold font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                  {liveConversations.agentHandled}
                </p>
              </div>
              <div className="rounded-md bg-[var(--linen)] px-3 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-[var(--amber)]" />
                  <span className="text-[10px] text-[var(--ash)]">Human</span>
                </div>
                <p className="text-lg font-semibold font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                  {liveConversations.humanHandled}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ ROW 2: Revenue + Connection health ═══ */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 3. THIS WEEK'S REVENUE */}

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--mist)] text-[var(--cedar)]">
                <ShoppingBag className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                This week's revenue
              </h3>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                ${weeklyRevenue.thisWeek.toLocaleString()}
              </p>
              <div
                className={cn(
                  "flex items-center gap-0.5 mb-1 px-1.5 py-0.5 rounded text-[10px] font-semibold font-[family-name:var(--font-jetbrains-mono)]",
                  revenueUp
                    ? "bg-[var(--mist)] text-[var(--cedar)]"
                    : "bg-[var(--ember)]/10 text-[var(--ember)]",
                )}
              >
                {revenueUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {revenueUp ? "+" : ""}{((revenueDelta / weeklyRevenue.lastWeek) * 100).toFixed(0)}%
              </div>
            </div>
            <p className="text-[10px] text-[var(--ash)] mt-1">
              vs. ${weeklyRevenue.lastWeek.toLocaleString()} last week
            </p>
          </CardContent>
        </Card>

        {/* 4. WHATSAPP CONNECTION HEALTH */}

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md",
                  connectionHealth.connected
                    ? "bg-[var(--mist)] text-[var(--cedar)]"
                    : "bg-[var(--ember)]/10 text-[var(--ember)]",
                )}
              >
                {connectionHealth.connected ? (
                  <Wifi className="h-3.5 w-3.5" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5" />
                )}
              </div>
              <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                WhatsApp connection
              </h3>
            </div>
            {connectionHealth.connected ? (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--mist)] text-[var(--cedar)]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">Connected</p>
                  <p className="text-[10px] text-[var(--ash)]">
                    Last synced {connectionHealth.lastSynced}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ember)]/10 text-[var(--ember)]">
                  <WifiOff className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--ember)]">Issue detected</p>
                  <p className="text-[10px] text-[var(--ash)]">
                    Connection lost — check Account & Billing
                  </p>
                </div>
              </div>
            )}
            <Link
              href="/account"
              className="inline-flex items-center gap-1 text-xs text-[var(--cedar)] hover:text-[var(--forest)] transition-colors mt-3"
            >
              Manage connection <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* ═══ ROW 3: Business outcomes ═══ */}

      <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-[family-name:var(--font-dm-sans)]">
                {isService ? "Today's bookings" : "Today's orders"}
              </CardTitle>
              <p className="text-[10px] text-[var(--ash)]">
                {isService
                  ? "Appointments booked for today"
                  : "Orders placed today"}
              </p>
            </div>
            <Link
              href="/bookings"
              className="text-xs text-[var(--cedar)] hover:text-[var(--forest)] flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Big outcome number */}
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-bold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {todayOutcome.count}
                </p>
                <p className="text-xs text-[var(--ash)]">
                  {outcomeLabel} today
                </p>
              </div>
              <div className="pb-1">
                <p className="text-xl font-semibold font-[family-name:var(--font-jetbrains-mono)] text-[var(--cedar)]">
                  ${todayOutcome.totalValue}
                </p>
                <p className="text-xs text-[var(--ash)]">total value</p>
              </div>
            </div>

            <Separator />

            {/* Secondary info */}
            {isService ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="h-3.5 w-3.5 text-[var(--ash)]" />
                  <p className="text-xs font-semibold text-[var(--ash)] uppercase tracking-wider">
                    Upcoming today
                  </p>
                </div>
                <div className="space-y-0">
                  {upcomingAppointments
                    .filter((a) => a.date === "Today")
                    .slice(0, 4)
                    .map((apt, i, arr) => (
                      <div key={apt.id}>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--mist)] text-[var(--cedar)] text-[10px] font-semibold font-[family-name:var(--font-dm-sans)]">
                              {apt.client
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[var(--ink)] truncate">
                                {apt.client}
                              </p>
                              <p className="text-[10px] text-[var(--ash)] truncate">
                                {apt.service}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                              {apt.time}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[9px] capitalize border-0",
                                statusStyles[apt.status],
                              )}
                            >
                              {apt.status}
                            </Badge>
                          </div>
                        </div>
                        {i < arr.length - 1 && <Separator />}
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-3.5 w-3.5 text-[var(--amber)]" />
                  <p className="text-xs font-semibold text-[var(--amber)] uppercase tracking-wider">
                    Low stock alerts
                  </p>
                </div>
                <div className="space-y-0">
                  {lowStockProducts.map((p, i) => (
                    <div key={p.id}>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--amber)]/10 text-[var(--amber)]">
                            <Package className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--ink)]">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-[var(--ash)]">
                              Threshold: {p.threshold}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm font-semibold font-[family-name:var(--font-jetbrains-mono)]",
                              p.stock <= 3
                                ? "text-[var(--ember)]"
                                : "text-[var(--amber)]",
                            )}
                          >
                            {p.stock}
                          </span>
                          <span className="text-[10px] text-[var(--ash)]">left</span>
                        </div>
                      </div>
                      {i < lowStockProducts.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
                <Link
                  href="/settings?tab=offerings"
                  className="inline-flex items-center gap-1 text-xs text-[var(--cedar)] hover:text-[var(--forest)] transition-colors mt-1"
                >
                  Manage inventory <ArrowRight className="h-3 w-3" />
                </Link>
              </>
            )}
          </CardContent>
        </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          3. RECENT ACTIVITY
          ══════════════════════════════════════════════════════════════════════ */}

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-[family-name:var(--font-dm-sans)]">
            Recent activity
          </CardTitle>
          <Link
            href="/inbox"
            className="text-xs text-[var(--cedar)] hover:text-[var(--forest)] flex items-center gap-1 transition-colors"
          >
            Open Inbox <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--linen)]">
                  <Clock className="h-5 w-5 text-[var(--ash)]" />
                </div>
                <p className="text-sm font-medium text-[var(--ink)]">
                  Nothing happening yet.
                </p>
                <p className="text-xs text-[var(--ash)] text-center max-w-[220px]">
                  Activity from your agent and customers will appear here as it
                  comes in.
                </p>
              </div>
            ) : (
              recentActivity.map((item, i) => (
                <div key={item.id}>
                  <div className="flex items-start gap-3 py-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                        activityColors[item.type],
                      )}
                    >
                      {activityIcons[item.type]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--ink)]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--ash)] mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Clock className="h-3 w-3 text-[var(--ash)]" />
                        <span className="text-[10px] text-[var(--ash)] font-[family-name:var(--font-jetbrains-mono)]">
                          {item.time}
                        </span>
                        {item.href && (
                          <>
                            <span className="text-[var(--slate)]">·</span>
                            <Link
                              href={item.href}
                              className="text-[10px] text-[var(--cedar)] hover:text-[var(--forest)] transition-colors flex items-center gap-0.5"
                            >
                              View details <ArrowUpRight className="h-2.5 w-2.5" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {i < recentActivity.length - 1 && <Separator />}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* ═══ ROW 5: Quick actions ═══ */}

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/inbox">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-[var(--slate)] bg-white text-[var(--ink)] hover:bg-[var(--mist)] hover:text-[var(--cedar)] hover:border-[var(--cedar)]/30 text-xs font-medium"
              >
                <Inbox className="h-3.5 w-3.5" />
                View Inbox
              </Button>
            </Link>
            <Link href="/settings?tab=offerings">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-[var(--slate)] bg-white text-[var(--ink)] hover:bg-[var(--mist)] hover:text-[var(--cedar)] hover:border-[var(--cedar)]/30 text-xs font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                Add offering
              </Button>
            </Link>
            <Link href="/broadcasts">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-[var(--slate)] bg-white text-[var(--ink)] hover:bg-[var(--mist)] hover:text-[var(--cedar)] hover:border-[var(--cedar)]/30 text-xs font-medium"
              >
                <Send className="h-3.5 w-3.5" />
                Send broadcast
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
