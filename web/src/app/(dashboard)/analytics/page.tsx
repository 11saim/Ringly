"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { cn } from "@/lib/utils";

// ── Types ──

interface ResolutionPoint {
  label: string;
  agentResolved: number;
  handedOff: number;
}

interface OutcomeTrendPoint {
  label: string;
  count: number;
  value: number;
}

interface HourlyHeatmap {
  day: string;
  hours: number[];
}

interface CustomerTypePoint {
  label: string;
  new: number;
  returning: number;
}

interface HandoffPoint {
  label: string;
  count: number;
}

interface ResponseTimePoint {
  label: string;
  seconds: number;
}

interface DbMessage {
  id: string;
  conversation_id: string;
  sender_type: "customer" | "agent" | "human_staff";
  created_at: string;
}

interface DbBooking {
  id: string;
  scheduled_at: string;
  services?: { price: number }[];
}

interface DbOrder {
  id: string;
  created_at: string;
  total_amount: number;
}

// ── Helpers ──

function getDateKey(date: Date, mode: "daily" | "weekly"): string {
  if (mode === "daily") {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    const start = new Date();
    start.setDate(start.getDate() - 41);
    const weekNum = Math.floor((date.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
    return `Week ${Math.min(weekNum, 6)}`;
  }
}

// ── Components ──

function Toggle({
  value,
  onChange,
}: {
  value: "daily" | "weekly";
  onChange: (v: "daily" | "weekly") => void;
}) {
  return (
    <div className="flex rounded-md border border-[var(--slate)] overflow-hidden">
      <button
        onClick={() => onChange("daily")}
        className={cn(
          "px-2.5 py-1 text-[10px] font-medium transition-colors",
          value === "daily"
            ? "bg-[var(--mist)] text-[var(--cedar)]"
            : "text-[var(--ash)] hover:bg-[var(--linen)]",
        )}
      >
        Daily
      </button>
      <button
        onClick={() => onChange("weekly")}
        className={cn(
          "px-2.5 py-1 text-[10px] font-medium transition-colors border-l border-[var(--slate)]",
          value === "weekly"
            ? "bg-[var(--mist)] text-[var(--cedar)]"
            : "text-[var(--ash)] hover:bg-[var(--linen)]",
        )}
      >
        Weekly
      </button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--linen)] mb-3">
        <MessageSquare className="h-5 w-5 text-[var(--ash)]" />
      </div>
      <p className="text-sm text-[var(--ash)]">{message}</p>
    </div>
  );
}

function StackedBarChart({
  data,
  maxValue,
  topKey,
  bottomKey,
  labelKey = "label",
  topLabel,
  bottomLabel,
  topColor = "bg-[var(--cedar)]",
  bottomColor = "bg-[var(--ash)]/30",
}: {
  data: Record<string, string | number>[];
  maxValue: number;
  topKey: string;
  bottomKey: string;
  labelKey?: string;
  topLabel: string;
  bottomLabel: string;
  topColor?: string;
  bottomColor?: string;
}) {
  if (data.length === 0 || maxValue === 0) {
    return <EmptyState message="Not enough activity yet to show this" />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-[10px]">
        <span className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-sm", topColor)} />
          {topLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-sm", bottomColor)} />
          {bottomLabel}
        </span>
      </div>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[10px] text-[var(--ash)] w-14 text-right shrink-0 font-[family-name:var(--font-jetbrains-mono)]">
              {String(d[labelKey])}
            </span>
            <div className="flex-1 flex items-center gap-0.5">
              <div
                className={cn("h-5 rounded-sm", topColor)}
                style={{ width: `${(Number(d[topKey]) / maxValue) * 100}%` }}
              />
              <div
                className={cn("h-5 rounded-sm", bottomColor)}
                style={{ width: `${(Number(d[bottomKey]) / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)] w-8 text-right shrink-0">
              {Number(d[topKey]) + Number(d[bottomKey])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({
  data,
  maxValue,
  valueKey,
  labelKey,
  barColor = "bg-[var(--cedar)]",
  showValues = false,
  valueSuffix,
}: {
  data: Record<string, string | number>[];
  maxValue: number;
  valueKey: string;
  labelKey: string;
  barColor?: string;
  showValues?: boolean;
  valueSuffix?: string;
}) {
  if (data.length === 0 || maxValue === 0) {
    return <EmptyState message="Not enough activity yet to show this" />;
  }

  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[10px] text-[var(--ash)] w-14 text-right shrink-0 font-[family-name:var(--font-jetbrains-mono)]">
            {String(d[labelKey])}
          </span>
          <div className="flex-1 flex items-center gap-1">
            <div
              className={cn("h-5 rounded-sm", barColor)}
              style={{ width: `${(Number(d[valueKey]) / maxValue) * 100}%` }}
            />
          </div>
          {showValues && (
            <span className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)] w-10 text-right shrink-0">
              {Number(d[valueKey])}{valueSuffix || ""}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function Heatmap({ data }: { data: HourlyHeatmap[] }) {
  const allValues = data.flatMap((d) => d.hours);
  const maxVal = Math.max(...allValues);
  const labels = ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm", "12am"];

  if (data.length === 0 || maxVal === 0) {
    return <EmptyState message="Not enough activity yet to show this" />;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[10px] text-[var(--ash)]">
        <span className="w-10" />
        {labels.map((l) => (
          <span key={l} className="flex-1 text-center font-[family-name:var(--font-jetbrains-mono)]">
            {l}
          </span>
        ))}
      </div>
      {data.map((row) => (
        <div key={row.day} className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--ash)] w-10 text-right font-[family-name:var(--font-jetbrains-mono)]">
            {row.day}
          </span>
          <div className="flex-1 flex gap-0.5">
            {row.hours.map((val, i) => {
              const intensity = val / maxVal;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex-1 h-6 rounded-sm transition-colors",
                    intensity === 0 && "bg-[var(--linen)]",
                    intensity > 0 && intensity <= 0.25 && "bg-[var(--mist)]",
                    intensity > 0.25 && intensity <= 0.5 && "bg-[var(--cedar)]/30",
                    intensity > 0.5 && intensity <= 0.75 && "bg-[var(--cedar)]/50",
                    intensity > 0.75 && "bg-[var(--cedar)]",
                  )}
                  title={`${row.day} ${labels[i]}: ${val} conversations`}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 text-[10px] text-[var(--ash)] mt-2">
        <span>Quiet</span>
        <div className="flex gap-0.5">
          {["bg-[var(--linen)]", "bg-[var(--mist)]", "bg-[var(--cedar)]/30", "bg-[var(--cedar)]/50", "bg-[var(--cedar)]"].map(
            (c, i) => (
              <div key={i} className={cn("h-3 w-4 rounded-sm", c)} />
            ),
          )}
        </div>
        <span>Busy</span>
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-28 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-5 flex-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-5 space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-5 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Page ──

export default function AnalyticsPage() {
  const { businessType } = useTenant();
  const isService = businessType === "Service";
  const [loading, setLoading] = useState(true);
  const [customerMode, setCustomerMode] = useState<"daily" | "weekly">("daily");
  const [handoffMode, setHandoffMode] = useState<"daily" | "weekly">("daily");
  const [responseMode, setResponseMode] = useState<"daily" | "weekly">("daily");

  // ── Data states ──
  const [resolutionData, setResolutionData] = useState<ResolutionPoint[]>([]);
  const [outcomeData, setOutcomeData] = useState<OutcomeTrendPoint[]>([]);
  const [heatmapData, setHeatmapData] = useState<HourlyHeatmap[]>([]);
  const [customerData, setCustomerData] = useState<CustomerTypePoint[]>([]);
  const [handoffData, setHandoffData] = useState<HandoffPoint[]>([]);
  const [responseData, setResponseData] = useState<ResponseTimePoint[]>([]);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const now = new Date();

    // ── Fetch conversations for resolution & handoff ──
    const sixWeeksAgo = new Date(now);
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);
    const sixWeeksAgoISO = sixWeeksAgo.toISOString();

    const { data: conversations } = await supabase
      .from("conversations")
      .select("id, started_at, handed_off_at, status")
      .gte("started_at", sixWeeksAgoISO);

    // ── Fetch messages for busiest hours & response time ──
    const { data: messages } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_type, created_at")
      .gte("created_at", sixWeeksAgoISO)
      .order("created_at", { ascending: true });

    // ── Fetch contacts for new vs returning ──
    const { data: contacts } = await supabase
      .from("contacts")
      .select("id, first_contact_at");

    // ── Fetch bookings/orders for outcome trend ──
    let bookings: DbBooking[] = [];
    let orders: DbOrder[] = [];

    if (isService) {
      const { data } = await supabase
        .from("bookings")
        .select("id, scheduled_at, services(price)")
        .gte("created_at", sixWeeksAgoISO);
      bookings = data || [];
    } else {
      const { data } = await supabase
        .from("orders")
        .select("id, created_at, total_amount")
        .gte("created_at", sixWeeksAgoISO);
      orders = data || [];
    }

    // ── Process resolution rate trend (weekly only) ──
    const weeklyResolution: Record<string, { agentResolved: number; handedOff: number }> = {};
    for (const conv of conversations || []) {
      const weekKey = getDateKey(new Date(conv.started_at), "weekly");
      if (!weeklyResolution[weekKey]) {
        weeklyResolution[weekKey] = { agentResolved: 0, handedOff: 0 };
      }
      if (conv.handed_off_at) {
        weeklyResolution[weekKey].handedOff++;
      } else {
        weeklyResolution[weekKey].agentResolved++;
      }
    }

    const resolutionResult: ResolutionPoint[] = Object.entries(weeklyResolution).map(([label, data]) => ({
      label,
      agentResolved: data.agentResolved,
      handedOff: data.handedOff,
    }));
    setResolutionData(resolutionResult);

    // ── Process outcome trend (bookings/orders) ──
    const outcomeByDay: Record<string, { count: number; value: number }> = {};
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    if (isService) {
      for (const booking of bookings) {
        const date = new Date(booking.scheduled_at);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const price = booking.services?.[0]?.price || 0;
        if (!outcomeByDay[dayName]) {
          outcomeByDay[dayName] = { count: 0, value: 0 };
        }
        outcomeByDay[dayName].count++;
        outcomeByDay[dayName].value += price;
      }
    } else {
      for (const order of orders) {
        const date = new Date(order.created_at);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        if (!outcomeByDay[dayName]) {
          outcomeByDay[dayName] = { count: 0, value: 0 };
        }
        outcomeByDay[dayName].count++;
        outcomeByDay[dayName].value += order.total_amount;
      }
    }

    const outcomeResult: OutcomeTrendPoint[] = dayLabels.map((label) => ({
      label,
      count: outcomeByDay[label]?.count || 0,
      value: outcomeByDay[label]?.value || 0,
    }));
    setOutcomeData(outcomeResult);

    // ── Process busiest hours ──
    const hourlyHeatmap: Record<string, number[]> = {};
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (const day of dayNames) {
      hourlyHeatmap[day] = new Array(10).fill(0);
    }

    for (const msg of messages || []) {
      const date = new Date(msg.created_at);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const hour = date.getHours();

      // Map hour to our 10 buckets (6am, 8am, 10am, 12pm, 2pm, 4pm, 6pm, 8pm, 10pm, 12am)
      let bucketIndex = -1;
      if (hour >= 6 && hour < 8) bucketIndex = 0;
      else if (hour >= 8 && hour < 10) bucketIndex = 1;
      else if (hour >= 10 && hour < 12) bucketIndex = 2;
      else if (hour >= 12 && hour < 14) bucketIndex = 3;
      else if (hour >= 14 && hour < 16) bucketIndex = 4;
      else if (hour >= 16 && hour < 18) bucketIndex = 5;
      else if (hour >= 18 && hour < 20) bucketIndex = 6;
      else if (hour >= 20 && hour < 22) bucketIndex = 7;
      else if (hour >= 22) bucketIndex = 8;
      else if (hour < 6) bucketIndex = 9;

      if (bucketIndex >= 0 && hourlyHeatmap[dayName]) {
        hourlyHeatmap[dayName][bucketIndex]++;
      }
    }

    const heatmapResult: HourlyHeatmap[] = dayNames.map((day) => ({
      day,
      hours: hourlyHeatmap[day],
    }));
    setHeatmapData(heatmapResult);

    // ── Process new vs returning customers ──
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const dailyCustomerData: Record<string, { new: number; returning: number }> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      dailyCustomerData[dayName] = { new: 0, returning: 0 };
    }

    for (const contact of contacts || []) {
      const firstContact = new Date(contact.first_contact_at);
      firstContact.setHours(0, 0, 0, 0);

      // Check which day this contact first appeared
      const dayName = firstContact.toLocaleDateString("en-US", { weekday: "short" });

      if (dailyCustomerData[dayName]) {
        if (firstContact >= sevenDaysAgo && firstContact <= today) {
          dailyCustomerData[dayName].new++;
        } else {
          dailyCustomerData[dayName].returning++;
        }
      }
    }

    const customerResult: CustomerTypePoint[] = Object.entries(dailyCustomerData).map(([label, data]) => ({
      label,
      new: data.new,
      returning: data.returning,
    }));
    setCustomerData(customerResult);

    // ── Process handoff volume ──
    const weeklyHandoff: Record<string, number> = {};
    for (const conv of conversations || []) {
      if (conv.handed_off_at) {
        const weekKey = getDateKey(new Date(conv.handed_off_at), "weekly");
        weeklyHandoff[weekKey] = (weeklyHandoff[weekKey] || 0) + 1;
      }
    }

    const handoffResult: HandoffPoint[] = Object.entries(weeklyHandoff).map(([label, count]) => ({
      label,
      count,
    }));
    setHandoffData(handoffResult);

    // ── Process average response time ──
    const messagesByConv: Record<string, DbMessage[]> = {};
    for (const msg of messages || []) {
      if (!messagesByConv[msg.conversation_id]) {
        messagesByConv[msg.conversation_id] = [];
      }
      messagesByConv[msg.conversation_id].push(msg);
    }

    const dailyResponseTimes: Record<string, number[]> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      dailyResponseTimes[dayName] = [];
    }

    for (const convMessages of Object.values(messagesByConv)) {
      for (let i = 0; i < convMessages.length - 1; i++) {
        const current = convMessages[i];
        const next = convMessages[i + 1];

        if (current.sender_type === "customer" &&
            (next.sender_type === "agent" || next.sender_type === "human_staff")) {
          const responseTime = (new Date(next.created_at).getTime() - new Date(current.created_at).getTime()) / 1000;

          if (responseTime >= 0 && responseTime <= 300) {
            const date = new Date(current.created_at);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
            if (dailyResponseTimes[dayName]) {
              dailyResponseTimes[dayName].push(responseTime);
            }
          }
        }
      }
    }

    const responseResult: ResponseTimePoint[] = Object.entries(dailyResponseTimes).map(([label, times]) => ({
      label,
      seconds: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0,
    }));
    setResponseData(responseResult);

    setLoading(false);
  }, [isService]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  if (loading) return <AnalyticsSkeleton />;

  // ── Computed values ──
  const customerDataForChart = customerMode === "daily" ? customerData : [];
  const maxCustomer = customerDataForChart.length > 0
    ? Math.max(...customerDataForChart.map((d) => d.new + d.returning))
    : 0;

  const handoffDataForChart = handoffMode === "daily" ? handoffData : handoffData;
  const maxHandoff = handoffDataForChart.length > 0
    ? Math.max(...handoffDataForChart.map((d) => d.count))
    : 0;

  const responseDataForChart = responseMode === "daily" ? responseData : responseData;
  const maxResponse = responseDataForChart.length > 0
    ? Math.max(...responseDataForChart.map((d) => d.seconds))
    : 0;

  const maxOutcome = outcomeData.length > 0
    ? Math.max(...outcomeData.map((d) => d.count))
    : 0;

  const lastCustomer = customerDataForChart[customerDataForChart.length - 1];
  const newPct = lastCustomer
    ? Math.round((lastCustomer.new / (lastCustomer.new + lastCustomer.returning || 1)) * 100)
    : 0;

  const lastHandoff = handoffDataForChart[handoffDataForChart.length - 1];

  const avgResponse = responseDataForChart.length > 0
    ? responseDataForChart.reduce((s, d) => s + d.seconds, 0) / responseDataForChart.length
    : 0;

  const lastResolution = resolutionData[resolutionData.length - 1];
  const totalResolved = lastResolution ? lastResolution.agentResolved + lastResolution.handedOff : 0;
  const agentResolutionPct = totalResolved > 0
    ? Math.round((lastResolution.agentResolved / totalResolved) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-[var(--ash)]">
          Understand how your agent is performing and what customers are asking.
        </p>
      </div>

      {/* ═══ 1. NEW VS. RETURNING CUSTOMERS ═══ */}

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-[family-name:var(--font-dm-sans)]">
              New vs. returning customers
            </CardTitle>
            <p className="text-[10px] text-[var(--ash)]">First-time contacts versus repeat visitors</p>
          </div>
          <Toggle value={customerMode} onChange={setCustomerMode} />
        </CardHeader>
        <CardContent>
          <StackedBarChart
            data={customerDataForChart as unknown as Record<string, string | number>[]}
            maxValue={maxCustomer}
            topKey="new"
            bottomKey="returning"
            topLabel="New"
            bottomLabel="Returning"
            topColor="bg-[var(--cedar)]"
            bottomColor="bg-[var(--amber)]/40"
          />
          {customerDataForChart.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {lastCustomer ? lastCustomer.new + lastCustomer.returning : 0}
                </p>
                <p className="text-[10px] text-[var(--ash)]">
                  {customerMode === "daily" ? "Today total" : "This week total"}
                </p>
              </div>
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--cedar)]">
                  {newPct}%
                </p>
                <p className="text-[10px] text-[var(--ash)]">First-time rate</p>
              </div>
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {lastCustomer ? lastCustomer.returning : 0}
                </p>
                <p className="text-[10px] text-[var(--ash)]">Returning</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══ 2. HANDOFF VOLUME ═══ */}

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-[family-name:var(--font-dm-sans)]">
              Handoff volume
            </CardTitle>
            <p className="text-[10px] text-[var(--ash)]">Conversations escalated from agent to human</p>
          </div>
          <Toggle value={handoffMode} onChange={setHandoffMode} />
        </CardHeader>
        <CardContent>
          <BarChart
            data={handoffDataForChart as unknown as Record<string, string | number>[]}
            maxValue={maxHandoff}
            valueKey="count"
            labelKey="label"
            barColor="bg-[var(--ember)]"
            showValues
          />
          {handoffDataForChart.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {lastHandoff ? lastHandoff.count : 0}
                </p>
                <p className="text-[10px] text-[var(--ash)]">
                  {handoffMode === "daily" ? "Yesterday" : "This week"}
                </p>
              </div>
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {handoffDataForChart.reduce((s, d) => s + d.count, 0)}
                </p>
                <p className="text-[10px] text-[var(--ash)]">
                  {handoffMode === "daily" ? "7-day total" : "6-week total"}
                </p>
              </div>
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--cedar)]">
                  {handoffDataForChart.length > 0
                    ? (handoffDataForChart.reduce((s, d) => s + d.count, 0) / handoffDataForChart.length).toFixed(1)
                    : "0"}
                </p>
                <p className="text-[10px] text-[var(--ash)]">Avg per period</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══ 3. AVERAGE RESPONSE TIME ═══ */}

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-[family-name:var(--font-dm-sans)]">
              Average response time
            </CardTitle>
            <p className="text-[10px] text-[var(--ash)]">Time between customer message and agent first reply</p>
          </div>
          <Toggle value={responseMode} onChange={setResponseMode} />
        </CardHeader>
        <CardContent>
          <BarChart
            data={responseDataForChart as unknown as Record<string, string | number>[]}
            maxValue={maxResponse}
            valueKey="seconds"
            labelKey="label"
            barColor="bg-[var(--cedar)]"
            showValues
            valueSuffix="s"
          />
          {responseDataForChart.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {avgResponse.toFixed(1)}s
                </p>
                <p className="text-[10px] text-[var(--ash)]">
                  {responseMode === "daily" ? "7-day avg" : "6-week avg"}
                </p>
              </div>
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--cedar)]">
                  {responseDataForChart.length > 0
                    ? Math.min(...responseDataForChart.map((d) => d.seconds)).toFixed(1)
                    : "0"}s
                </p>
                <p className="text-[10px] text-[var(--ash)]">Fastest</p>
              </div>
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {responseDataForChart.length > 0
                    ? Math.max(...responseDataForChart.map((d) => d.seconds)).toFixed(1)
                    : "0"}s
                </p>
                <p className="text-[10px] text-[var(--ash)]">Slowest</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══ 4. RESOLUTION RATE TREND ═══ */}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-[family-name:var(--font-dm-sans)]">
            Resolution rate trend
          </CardTitle>
          <p className="text-[10px] text-[var(--ash)]">Agent-only resolutions vs human handoffs over time</p>
        </CardHeader>
        <CardContent>
          <StackedBarChart
            data={resolutionData as unknown as Record<string, string | number>[]}
            maxValue={resolutionData.length > 0
              ? Math.max(...resolutionData.map((d) => d.agentResolved + d.handedOff))
              : 0}
            topKey="agentResolved"
            bottomKey="handedOff"
            topLabel="Agent resolved"
            bottomLabel="Handed off"
            topColor="bg-[var(--cedar)]"
            bottomColor="bg-[var(--ash)]/30"
          />
          {resolutionData.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {lastResolution ? lastResolution.agentResolved : 0}
                </p>
                <p className="text-[10px] text-[var(--ash)]">This week resolved</p>
              </div>
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--cedar)]">
                  {agentResolutionPct}%
                </p>
                <p className="text-[10px] text-[var(--ash)]">Agent resolution</p>
              </div>
              <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {lastResolution ? lastResolution.handedOff : 0}
                </p>
                <p className="text-[10px] text-[var(--ash)]">Handed off</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══ 5-6. BOOKINGS/ORDERS TREND + BUSIEST HOURS ═══ */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-[family-name:var(--font-dm-sans)]">
                {isService ? "Bookings trend" : "Orders trend"}
              </CardTitle>
              <p className="text-[10px] text-[var(--ash)]">
                {isService
                  ? "Appointments booked each day this week"
                  : "Orders placed each day this week"}
              </p>
            </div>
            <Link
              href="/bookings"
              className="text-[10px] text-[var(--cedar)] hover:text-[var(--forest)] flex items-center gap-1 transition-colors"
            >
              View details <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {outcomeData.length > 0 && maxOutcome > 0 ? (
              <>
                <div className="space-y-2">
                  {outcomeData.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] text-[var(--ash)] w-14 text-right shrink-0 font-[family-name:var(--font-jetbrains-mono)]">
                        {d.label}
                      </span>
                      <div className="flex-1 flex items-center gap-1">
                        <div
                          className="h-5 rounded-sm bg-[var(--cedar)]"
                          style={{ width: `${(d.count / maxOutcome) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)] w-6 text-right">
                          {d.count}
                        </span>
                        <span className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] text-[var(--cedar)] w-12 text-right">
                          ${d.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--ash)]">This week total</p>
                    <p className="text-xl font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                      {outcomeData.reduce((s, d) => s + d.count, 0)}{" "}
                      <span className="text-sm font-normal text-[var(--ash)]">
                        {isService ? "bookings" : "orders"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--ash)]">Total value</p>
                    <p className="text-xl font-semibold font-[family-name:var(--font-jetbrains-mono)] text-[var(--cedar)]">
                      ${outcomeData.reduce((s, d) => s + d.value, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <EmptyState message="Not enough activity yet to show this" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-[family-name:var(--font-dm-sans)]">
              Busiest hours
            </CardTitle>
            <p className="text-[10px] text-[var(--ash)]">When customers reach out most</p>
          </CardHeader>
          <CardContent>
            <Heatmap data={heatmapData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
