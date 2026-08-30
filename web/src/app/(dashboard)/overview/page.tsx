"use client";

import { useEffect, useState, useCallback } from "react";
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
import { createClient } from "@/lib/supabase/client";
import { useTenant, useTenantContext } from "@/lib/tenant-context";
import { cn } from "@/lib/utils";

// ── Types ──

interface Escalation {
  id: string;
  contact: string;
  initials: string;
  lastMessage: string;
  waitingSince: string;
  unread: number;
}

interface ActivityItem {
  id: string;
  type: "booking" | "escalation" | "low_stock" | "new_contact" | "broadcast" | "large_order";
  title: string;
  description: string;
  time: string;
  contact?: string;
  href?: string;
}

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

// ── Helpers ──

function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "yesterday";
  return `${diffDay} days ago`;
}

function getInitials(name: string | null): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getTodayRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

function getWeekRange(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);
  return { start: monday.toISOString(), end: sunday.toISOString() };
}

function getLastWeekRange(): { start: string; end: string } {
  const thisWeek = getWeekRange();
  const start = new Date(thisWeek.start);
  start.setDate(start.getDate() - 7);
  const end = new Date(thisWeek.end);
  end.setDate(end.getDate() - 7);
  return { start: start.toISOString(), end: end.toISOString() };
}

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
  const { loading: tenantLoading } = useTenantContext();
  const isService = businessType === "Service";
  const [loading, setLoading] = useState(true);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [liveAgent, setLiveAgent] = useState(0);
  const [liveHuman, setLiveHuman] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [todayValue, setTodayValue] = useState(0);
  const [upcomingToday, setUpcomingToday] = useState<{ id: string; contact: string; service: string; time: string; status: string }[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<{ id: string; name: string; stock: number; threshold: number }[]>([]);
  const [revenueThisWeek, setRevenueThisWeek] = useState(0);
  const [revenueLastWeek, setRevenueLastWeek] = useState(0);
  const [connectionConnected, setConnectionConnected] = useState(true);
  const [connectionLastSynced, setConnectionLastSynced] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const fetchOverview = useCallback(async () => {
    const supabase = createClient();
    const today = getTodayRange();
    const thisWeek = getWeekRange();
    const lastWeek = getLastWeekRange();

    const [
      escalationsResult,
      liveResult,
      bookingsResult,
      ordersResult,
      upcomingResult,
      lowStockResult,
      revenueThisWeekResult,
      revenueLastWeekResult,
      connectionResult,
      recentConvsResult,
      recentBookingsResult,
      recentOrdersResult,
    ] = await Promise.all([
      // Escalated conversations (status = 'human')
      supabase
        .from("conversations")
        .select("id, contact_id, contacts(name), last_message_at, started_at")
        .eq("status", "human")
        .order("last_message_at", { ascending: false })
        .limit(10),

      // Live conversations count
      supabase
        .from("conversations")
        .select("status")
        .in("status", ["agent", "human"]),

      // Today's bookings (Service)
      isService
        ? supabase
            .from("bookings")
            .select("id, scheduled_at, status, services(price)")
            .gte("scheduled_at", today.start)
            .lt("scheduled_at", today.end)
            .neq("status", "cancelled")
        : Promise.resolve({ data: [] as never[] }),

      // Today's orders (Product)
      !isService
        ? supabase
            .from("orders")
            .select("id, total_amount, status, created_at")
            .gte("created_at", today.start)
            .lt("created_at", today.end)
            .neq("status", "cancelled")
        : Promise.resolve({ data: [] as never[] }),

      // Upcoming bookings today (Service)
      isService
        ? supabase
            .from("bookings")
            .select("id, scheduled_at, status, contacts(name), services(name)")
            .gte("scheduled_at", today.start)
            .lt("scheduled_at", today.end)
            .neq("status", "cancelled")
            .order("scheduled_at", { ascending: true })
            .limit(4)
        : Promise.resolve({ data: [] as never[] }),

      // Low stock products (Product)
      !isService
        ? supabase
            .from("products")
            .select("id, name, stock_quantity, low_stock_threshold")
            .eq("is_active", true)
            .filter("stock_quantity", "lt", "low_stock_threshold")
            .order("stock_quantity", { ascending: true })
            .limit(5)
        : Promise.resolve({ data: [] as never[] }),

      // This week's revenue (bookings or orders)
      isService
        ? supabase
            .from("bookings")
            .select("services(price)")
            .gte("scheduled_at", thisWeek.start)
            .lt("scheduled_at", thisWeek.end)
            .neq("status", "cancelled")
        : supabase
            .from("orders")
            .select("total_amount")
            .gte("created_at", thisWeek.start)
            .lt("created_at", thisWeek.end)
            .neq("status", "cancelled"),

      // Last week's revenue
      isService
        ? supabase
            .from("bookings")
            .select("services(price)")
            .gte("scheduled_at", lastWeek.start)
            .lt("scheduled_at", lastWeek.end)
            .neq("status", "cancelled")
        : supabase
            .from("orders")
            .select("total_amount")
            .gte("created_at", lastWeek.start)
            .lt("created_at", lastWeek.end)
            .neq("status", "cancelled"),

      // WhatsApp connection
      supabase
        .from("whatsapp_connections")
        .select("status, connected_at")
        .limit(1),

      // Recent conversations (for activity)
      supabase
        .from("conversations")
        .select("id, status, last_message_at, started_at, contacts(name)")
        .order("last_message_at", { ascending: false })
        .limit(5),

      // Recent bookings (for activity)
      isService
        ? supabase
            .from("bookings")
            .select("id, scheduled_at, status, contacts(name), services(name)")
            .order("created_at", { ascending: false })
            .limit(5)
        : Promise.resolve({ data: [] as never[] }),

      // Recent orders (for activity)
      !isService
        ? supabase
            .from("orders")
            .select("id, created_at, status, total_amount, contacts(name)")
            .order("created_at", { ascending: false })
            .limit(5)
        : Promise.resolve({ data: [] as never[] }),
    ]);

    // ── Process escalations ──
    type ConvRow = { id: string; contacts: { name: string }[] | null; last_message_at: string };
    const convIds = (escalationsResult.data ?? []).map((c: ConvRow) => c.id);
    const unreadMap: Record<string, number> = {};
    const lastMessages: Record<string, string> = {};
    if (convIds.length > 0) {
      type MsgRow = { conversation_id: string; content: string; sender_type: string };
      const { data: unreadData } = await supabase
        .from("messages")
        .select("conversation_id, content, created_at, sender_type")
        .in("conversation_id", convIds)
        .eq("sender_type", "customer")
        .order("created_at", { ascending: false });

      for (const msg of (unreadData ?? []) as MsgRow[]) {
        if (!unreadMap[msg.conversation_id]) {
          unreadMap[msg.conversation_id] = 0;
          lastMessages[msg.conversation_id] = msg.content;
        }
        unreadMap[msg.conversation_id]++;
      }
    }

    setEscalations(
      (escalationsResult.data ?? []).map((conv: ConvRow) => ({
        id: conv.id,
        contact: conv.contacts?.[0]?.name ?? "Unknown",
        initials: getInitials(conv.contacts?.[0]?.name ?? null),
        lastMessage: lastMessages[conv.id] ?? "Awaiting response",
        waitingSince: relativeTime(conv.last_message_at),
        unread: unreadMap[conv.id] ?? 0,
      })),
    );

    // ── Process live conversations ──
    type LiveRow = { status: string };
    const liveData = (liveResult.data ?? []) as LiveRow[];
    const agentCount = liveData.filter((c) => c.status === "agent").length;
    const humanCount = liveData.filter((c) => c.status === "human").length;
    setLiveAgent(agentCount);
    setLiveHuman(humanCount);

    // ── Process today's outcomes ──
    if (isService) {
      type BookingRow = { id: string; services: { price: number }[] | null };
      const bookings = (bookingsResult.data ?? []) as BookingRow[];
      let totalVal = 0;
      for (const b of bookings) {
        const price = b.services?.[0]?.price ?? 0;
        totalVal += Number(price);
      }
      setTodayCount(bookings.length);
      setTodayValue(totalVal);
    } else {
      type OrderRow = { id: string; total_amount: number | null };
      const orders = (ordersResult.data ?? []) as OrderRow[];
      let totalVal = 0;
      for (const o of orders) {
        totalVal += Number(o.total_amount ?? 0);
      }
      setTodayCount(orders.length);
      setTodayValue(totalVal);
    }

    // ── Process upcoming appointments ──
    type UpcomingRow = { id: string; scheduled_at: string; status: string; contacts: { name: string }[] | null; services: { name: string }[] | null };
    setUpcomingToday(
      (upcomingResult.data ?? []).map((b: UpcomingRow) => ({
        id: b.id,
        contact: b.contacts?.[0]?.name ?? "Unknown",
        service: b.services?.[0]?.name ?? "Service",
        time: new Date(b.scheduled_at).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        status: b.status,
      })),
    );

    // ── Process low stock ──
    type LowStockRow = { id: string; name: string; stock_quantity: number; low_stock_threshold: number };
    setLowStockProducts(
      (lowStockResult.data ?? []).map((p: LowStockRow) => ({
        id: p.id,
        name: p.name,
        stock: p.stock_quantity,
        threshold: p.low_stock_threshold,
      })),
    );

    // ── Process revenue ──
    if (isService) {
      type RevBookingRow = { services: { price: number }[] | null };
      const thisWk = (revenueThisWeekResult.data ?? []) as RevBookingRow[];
      const lastWk = (revenueLastWeekResult.data ?? []) as RevBookingRow[];
      setRevenueThisWeek(thisWk.reduce((sum, b) => sum + Number(b.services?.[0]?.price ?? 0), 0));
      setRevenueLastWeek(lastWk.reduce((sum, b) => sum + Number(b.services?.[0]?.price ?? 0), 0));
    } else {
      type RevOrderRow = { total_amount: number | null };
      const thisWk = (revenueThisWeekResult.data ?? []) as RevOrderRow[];
      const lastWk = (revenueLastWeekResult.data ?? []) as RevOrderRow[];
      setRevenueThisWeek(thisWk.reduce((sum, o) => sum + Number(o.total_amount ?? 0), 0));
      setRevenueLastWeek(lastWk.reduce((sum, o) => sum + Number(o.total_amount ?? 0), 0));
    }

    // ── Process connection health ──
    type ConnRow = { status: string; connected_at: string | null };
    const conn = (connectionResult.data ?? [])[0] as ConnRow | undefined;
    setConnectionConnected(conn?.status === "connected");
    setConnectionLastSynced(conn?.connected_at ? relativeTime(conn.connected_at) : null);

    // ── Process recent activity ──
    const activity: ActivityItem[] = [];

    type ConvActivityRow = { id: string; status: string; last_message_at: string; contacts: { name: string }[] | null };
    for (const conv of (recentConvsResult.data ?? []) as ConvActivityRow[]) {
      if (conv.status === "human") {
        activity.push({
          id: `conv-${conv.id}`,
          type: "escalation",
          title: `Escalated: ${conv.contacts?.[0]?.name ?? "Unknown"}`,
          description: "This conversation was handed off to a human agent",
          time: relativeTime(conv.last_message_at),
          contact: conv.contacts?.[0]?.name ?? undefined,
          href: "/inbox",
        });
      }
    }

    if (isService) {
      type BookActivityRow = { id: string; scheduled_at: string; contacts: { name: string }[] | null; services: { name: string }[] | null };
      for (const b of (recentBookingsResult.data ?? []) as BookActivityRow[]) {
        activity.push({
          id: `booking-${b.id}`,
          type: "booking",
          title: `New booking: ${b.services?.[0]?.name ?? "Service"}`,
          description: `${b.contacts?.[0]?.name ?? "Unknown"} booked ${b.services?.[0]?.name ?? "a service"}`,
          time: relativeTime(b.scheduled_at),
          contact: b.contacts?.[0]?.name ?? undefined,
          href: "/bookings",
        });
      }
    } else {
      type OrdActivityRow = { id: string; created_at: string; total_amount: number | null; contacts: { name: string }[] | null };
      for (const o of (recentOrdersResult.data ?? []) as OrdActivityRow[]) {
        activity.push({
          id: `order-${o.id}`,
          type: "large_order",
          title: `New order: $${Number(o.total_amount ?? 0).toLocaleString()}`,
          description: `${o.contacts?.[0]?.name ?? "Unknown"} placed an order`,
          time: relativeTime(o.created_at),
          contact: o.contacts?.[0]?.name ?? undefined,
          href: "/bookings",
        });
      }
    }

    for (const p of (lowStockResult.data ?? []) as LowStockRow[]) {
      activity.push({
        id: `lowstock-${p.id}`,
        type: "low_stock",
        title: `Low stock: ${p.name}`,
        description: `${p.stock_quantity} units remaining — threshold is ${p.low_stock_threshold}`,
        time: "today",
        href: "/settings?tab=offerings",
      });
    }

    activity.sort((a, b) => {
      const timeA = a.time === "today" ? 0 : parseInt(a.time) || 0;
      const timeB = b.time === "today" ? 0 : parseInt(b.time) || 0;
      return timeA - timeB;
    });

    setRecentActivity(activity.slice(0, 6));
    setLoading(false);
  }, [isService]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOverview();
  }, [fetchOverview]);

  if (tenantLoading || loading) return <OverviewSkeleton />;

  if (!businessType) return null;

  const hasEscalations = escalations.length > 0;
  const liveTotal = liveAgent + liveHuman;
  const revenueDelta = revenueThisWeek - revenueLastWeek;
  const revenueUp = revenueDelta > 0;
  const revenuePct = revenueLastWeek > 0 ? ((revenueDelta / revenueLastWeek) * 100).toFixed(0) : "0";
  const outcomeLabel = isService ? "bookings" : "orders";

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
                {liveTotal}
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
                  {liveAgent}
                </p>
              </div>
              <div className="rounded-md bg-[var(--linen)] px-3 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-[var(--amber)]" />
                  <span className="text-[10px] text-[var(--ash)]">Human</span>
                </div>
                <p className="text-lg font-semibold font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                  {liveHuman}
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
                This week&apos;s revenue
              </h3>
            </div>
            {revenueThisWeek === 0 && revenueLastWeek === 0 ? (
              <div>
                <p className="text-3xl font-bold font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                  $0
                </p>
                <p className="text-xs text-[var(--ash)] mt-1">
                  No revenue data yet this week.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-3">
                  <p className="text-3xl font-bold font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                    ${revenueThisWeek.toLocaleString()}
                  </p>
                  {revenueLastWeek > 0 && (
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
                      {revenueUp ? "+" : ""}{revenuePct}%
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-[var(--ash)] mt-1">
                  {revenueLastWeek > 0
                    ? `$${revenueLastWeek.toLocaleString()} last week`
                    : "No revenue data from last week"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* 4. WHATSAPP CONNECTION HEALTH */}

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md",
                  connectionConnected
                    ? "bg-[var(--mist)] text-[var(--cedar)]"
                    : "bg-[var(--ember)]/10 text-[var(--ember)]",
                )}
              >
                {connectionConnected ? (
                  <Wifi className="h-3.5 w-3.5" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5" />
                )}
              </div>
              <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                WhatsApp connection
              </h3>
            </div>
            {connectionConnected ? (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--mist)] text-[var(--cedar)]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">Connected</p>
                  <p className="text-[10px] text-[var(--ash)]">
                    {connectionLastSynced ? `Last synced ${connectionLastSynced}` : "Connected"}
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
                    {connectionLastSynced
                      ? `Connection lost since ${connectionLastSynced} — check Account & Billing`
                      : "Not connected — check Account & Billing"}
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
                  {todayCount}
                </p>
                <p className="text-xs text-[var(--ash)]">
                  {outcomeLabel} today
                </p>
              </div>
              <div className="pb-1">
                <p className="text-xl font-semibold font-[family-name:var(--font-jetbrains-mono)] text-[var(--cedar)]">
                  ${todayValue.toLocaleString()}
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
                {upcomingToday.length === 0 ? (
                  <div className="flex items-center gap-3 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mist)] text-[var(--cedar)]">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--ink)]">
                        No upcoming appointments today.
                      </p>
                      <p className="text-xs text-[var(--ash)]">
                        Bookings will appear here as they come in.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {upcomingToday.map((apt, i, arr) => (
                      <div key={apt.id}>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--mist)] text-[var(--cedar)] text-[10px] font-semibold font-[family-name:var(--font-dm-sans)]">
                              {getInitials(apt.contact)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[var(--ink)] truncate">
                                {apt.contact}
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
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-3.5 w-3.5 text-[var(--amber)]" />
                  <p className="text-xs font-semibold text-[var(--amber)] uppercase tracking-wider">
                    Low stock alerts
                  </p>
                </div>
                {lowStockProducts.length === 0 ? (
                  <div className="flex items-center gap-3 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mist)] text-[var(--cedar)]">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--ink)]">
                        All stock levels are healthy.
                      </p>
                      <p className="text-xs text-[var(--ash)]">
                        Low stock alerts will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
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
                )}
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
