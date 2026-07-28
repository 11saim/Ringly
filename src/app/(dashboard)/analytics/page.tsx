"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  MessageSquare,
  Package,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  resolutionTrend,
  busiestHours,
  bookingsTrend,
  ordersTrend,
  customerTypeDaily,
  customerTypeWeekly,
  handoffDaily,
  handoffWeekly,
  responseTimeDaily,
  responseTimeWeekly,
} from "@/lib/data";
import { useTenant } from "@/lib/tenant-context";
import { cn } from "@/lib/utils";

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

function Heatmap({ data }: { data: typeof busiestHours }) {
  const allValues = data.flatMap((d) => d.hours);
  const maxVal = Math.max(...allValues);
  const labels = ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm", "12am"];

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

export default function AnalyticsPage() {
  const { businessType } = useTenant();
  const isService = businessType === "Service";
  const [loading, setLoading] = useState(true);
  const [customerMode, setCustomerMode] = useState<"daily" | "weekly">("daily");
  const [handoffMode, setHandoffMode] = useState<"daily" | "weekly">("daily");
  const [responseMode, setResponseMode] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <AnalyticsSkeleton />;

  const customerData = customerMode === "daily" ? customerTypeDaily : customerTypeWeekly;
  const maxCustomer = Math.max(...customerData.map((d) => d.new + d.returning));

  const handoffData = handoffMode === "daily" ? handoffDaily : handoffWeekly;
  const maxHandoff = Math.max(...handoffData.map((d) => d.count));

  const responseData = responseMode === "daily" ? responseTimeDaily : responseTimeWeekly;
  const maxResponse = Math.max(...responseData.map((d) => d.seconds));

  const maxOutcome = Math.max(
    ...(isService ? bookingsTrend : ordersTrend).map((d) => d.count),
  );

  const lastCustomer = customerData[customerData.length - 1];
  const newPct = Math.round((lastCustomer.new / (lastCustomer.new + lastCustomer.returning)) * 100);

  const lastHandoff = handoffData[handoffData.length - 1];

  const avgResponse =
    responseData.reduce((s, d) => s + d.seconds, 0) / responseData.length;

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
            data={customerData as unknown as Record<string, string | number>[]}
            maxValue={maxCustomer}
            topKey="new"
            bottomKey="returning"
            topLabel="New"
            bottomLabel="Returning"
            topColor="bg-[var(--cedar)]"
            bottomColor="bg-[var(--amber)]/40"
          />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
              <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                {lastCustomer.new + lastCustomer.returning}
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
                {lastCustomer.returning}
              </p>
              <p className="text-[10px] text-[var(--ash)]">Returning</p>
            </div>
          </div>
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
            data={handoffData as unknown as Record<string, string | number>[]}
            maxValue={maxHandoff}
            valueKey="count"
            labelKey="label"
            barColor="bg-[var(--ember)]"
            showValues
          />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
              <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                {lastHandoff.count}
              </p>
              <p className="text-[10px] text-[var(--ash)]">
                {handoffMode === "daily" ? "Yesterday" : "This week"}
              </p>
            </div>
            <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
              <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                {handoffData.reduce((s, d) => s + d.count, 0)}
              </p>
              <p className="text-[10px] text-[var(--ash)]">
                {handoffMode === "daily" ? "7-day total" : "6-week total"}
              </p>
            </div>
            <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
              <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--cedar)]">
                {(handoffData.reduce((s, d) => s + d.count, 0) / handoffData.length).toFixed(1)}
              </p>
              <p className="text-[10px] text-[var(--ash)]">Avg per period</p>
            </div>
          </div>
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
            data={responseData as unknown as Record<string, string | number>[]}
            maxValue={maxResponse}
            valueKey="seconds"
            labelKey="label"
            barColor="bg-[var(--cedar)]"
            showValues
            valueSuffix="s"
          />
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
                {Math.min(...responseData.map((d) => d.seconds)).toFixed(1)}s
              </p>
              <p className="text-[10px] text-[var(--ash)]">Fastest</p>
            </div>
            <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
              <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                {Math.max(...responseData.map((d) => d.seconds)).toFixed(1)}s
              </p>
              <p className="text-[10px] text-[var(--ash)]">Slowest</p>
            </div>
          </div>
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
            data={resolutionTrend as unknown as Record<string, string | number>[]}
            maxValue={Math.max(...resolutionTrend.map((d) => d.agentResolved + d.handedOff))}
            topKey="agentResolved"
            bottomKey="handedOff"
            topLabel="Agent resolved"
            bottomLabel="Handed off"
            topColor="bg-[var(--cedar)]"
            bottomColor="bg-[var(--ash)]/30"
          />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
              <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                {resolutionTrend[resolutionTrend.length - 1].agentResolved}
              </p>
              <p className="text-[10px] text-[var(--ash)]">This week resolved</p>
            </div>
            <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
              <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--cedar)]">
                {Math.round(
                  (resolutionTrend[resolutionTrend.length - 1].agentResolved /
                    (resolutionTrend[resolutionTrend.length - 1].agentResolved +
                      resolutionTrend[resolutionTrend.length - 1].handedOff)) *
                    100,
                )}
                %
              </p>
              <p className="text-[10px] text-[var(--ash)]">Agent resolution</p>
            </div>
            <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
              <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                {resolutionTrend[resolutionTrend.length - 1].handedOff}
              </p>
              <p className="text-[10px] text-[var(--ash)]">Handed off</p>
            </div>
          </div>
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
            <div className="space-y-2">
              {(isService ? bookingsTrend : ordersTrend).map((d, i) => (
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
                  {(isService ? bookingsTrend : ordersTrend).reduce((s, d) => s + d.count, 0)}{" "}
                  <span className="text-sm font-normal text-[var(--ash)]">
                    {isService ? "bookings" : "orders"}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--ash)]">Total value</p>
                <p className="text-xl font-semibold font-[family-name:var(--font-jetbrains-mono)] text-[var(--cedar)]">
                  ${(isService ? bookingsTrend : ordersTrend).reduce((s, d) => s + d.value, 0).toLocaleString()}
                </p>
              </div>
            </div>
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
            <Heatmap data={busiestHours} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
