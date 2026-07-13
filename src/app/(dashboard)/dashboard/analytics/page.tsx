"use client";

import { AppShell } from "@/components/app/AppShell";
import { Sparkline } from "@/components/app/Sparkline";
import { Button } from "@/components/ui/button";
import { questions } from "@/lib/mock";
import {
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  TrendingUp,
  Filter,
} from "lucide-react";
import { useState } from "react";

export default function AnalyticsPage() {
  const [range, setRange] = useState("30d");
  const ranges = [
    { id: "7d", label: "7d" },
    { id: "30d", label: "30d" },
    { id: "90d", label: "90d" },
    { id: "1y", label: "1y" },
  ];

  return (
    <AppShell
      title="Analytics"
      subtitle="How your agent is performing"
      actions={
        <>
          <div className="inline-flex rounded-md border border-border p-0.5 bg-card">
            {ranges.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`px-3 h-7 text-xs rounded font-medium transition ${
                  range === r.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline">
            <Filter className="mr-1 h-3.5 w-3.5" /> Filters
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-1 h-3.5 w-3.5" /> Export
          </Button>
        </>
      }
    >
      {/* Insight banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">
            Copilot insight
          </div>
          <div className="text-sm mt-1 leading-relaxed">
            Your resolution rate jumped{" "}
            <span className="font-mono font-bold text-success">+6pts</span>{" "}
            after enabling &quot;confirm before booking&quot; — that change alone
            is worth ~
            <span className="font-mono font-bold">$1,200/mo</span> in retained
            bookings.
          </div>
        </div>
        <Button size="sm" variant="outline" className="shrink-0">
          View change
        </Button>
      </div>

      {/* Metric cards */}
      <div className="mt-4 grid md:grid-cols-4 gap-3">
        <Metric
          label="Resolution rate"
          value="78%"
          delta="+6%"
          trend="up"
          spark={[60, 62, 65, 68, 72, 75, 78]}
        />
        <Metric
          label="Avg. handle time"
          value="1.8s"
          delta="-0.4s"
          trend="up"
          spark={[3, 2.6, 2.4, 2.1, 2, 1.9, 1.8]}
        />
        <Metric
          label="Revenue influenced"
          value="$14,320"
          delta="+22%"
          trend="up"
          spark={[4, 6, 8, 9, 12, 13, 14]}
        />
        <Metric
          label="CSAT"
          value="4.7"
          delta="+0.2"
          trend="up"
          spark={[4.2, 4.3, 4.4, 4.5, 4.6, 4.6, 4.7]}
        />
      </div>

      {/* Volume + Outcomes */}
      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold">Conversation volume</div>
            <div className="flex gap-3 text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-primary" /> AI
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-warning" /> Human
              </span>
            </div>
          </div>
          <StackedBars
            ai={[24, 32, 28, 40, 35, 48, 52]}
            human={[6, 8, 5, 9, 7, 11, 8]}
            labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold mb-4">Outcomes</div>
          <Donut
            segments={[
              { label: "Resolved by AI", value: 78, color: "var(--primary)" },
              { label: "Escalated to human", value: 15, color: "var(--warning)" },
              { label: "Abandoned", value: 7, color: "var(--muted-foreground)" },
            ]}
          />
        </div>
      </div>

      {/* Questions + Channels/Heatmap */}
      <div className="mt-4 grid lg:grid-cols-[1fr_400px] gap-4">
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3 flex items-center justify-between">
            <div className="text-sm font-semibold flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" /> Top questions
            </div>
            <span className="text-xs text-muted-foreground">
              Auto-clustered
            </span>
          </div>
          <ul className="divide-y divide-border">
            {questions.map((q, i) => {
              const TrendIcon =
                q.trend === "up"
                  ? ArrowUpRight
                  : q.trend === "down"
                    ? ArrowDownRight
                    : Minus;
              const max = Math.max(...questions.map((x) => x.volume));
              return (
                <li
                  key={q.topic}
                  className="px-5 py-3 hover:bg-muted/40 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-4">
                      {i + 1}
                    </span>
                    <span className="text-sm flex-1 truncate">{q.topic}</span>
                    <span className="font-mono text-sm">{q.volume}</span>
                    <TrendIcon
                      size={14}
                      className={
                        q.trend === "up"
                          ? "text-success"
                          : q.trend === "down"
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }
                    />
                  </div>
                  <div className="mt-1.5 ml-7 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary/70 group-hover:bg-primary transition-all"
                      style={{ width: `${(q.volume / max) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-sm font-semibold mb-3">Channels</div>
            <div className="text-xs text-muted-foreground mb-2 flex justify-between">
              <span>WhatsApp 82%</span>
              <span>Voice 18%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex">
              <div className="bg-whatsapp transition-all" style={{ width: "82%" }} />
              <div className="bg-voice transition-all" style={{ width: "18%" }} />
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Messages sent</span>
                <span className="font-mono">3,214</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bookings closed</span>
                <span className="font-mono">142</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Escalations</span>
                <span className="font-mono">31</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-sm font-semibold mb-3">Peak hours</div>
            <div className="grid grid-cols-12 gap-0.5">
              {Array.from({ length: 24 }, (_, h) => {
                const v =
                  Math.sin((h - 6) / 4) * 40 +
                  45 +
                  (h > 8 && h < 21 ? 30 : 0);
                const intensity = Math.max(0, Math.min(1, v / 100));
                return (
                  <div
                    key={h}
                    className="aspect-square rounded-sm"
                    style={{
                      background: `color-mix(in oklab, var(--primary) ${intensity * 100}%, transparent)`,
                    }}
                    title={`${h}:00`}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>00</span>
              <span>12</span>
              <span>23</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ── Sub-components ────────────────────────────────────────────────── */

function Metric({
  label,
  value,
  delta,
  trend,
  spark,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  spark: number[];
}) {
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div className="relative rounded-xl border border-border bg-card p-5 flex flex-col justify-between overflow-hidden">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-2 font-mono text-3xl font-bold tabular-nums">
          {value}
        </div>
        <div className={`mt-1 text-xs flex items-center gap-0.5 ${trendColor}`}>
          <TrendIcon size={12} />
          {delta}
        </div>
      </div>
      <div className="mt-4 h-10 text-primary/60">
        <Sparkline data={spark} />
      </div>
    </div>
  );
}

function Donut({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = 56;
  const c = 2 * Math.PI * r;
  const offsets = segments.reduce<number[]>((acc, s) => {
    const len = (s.value / total) * c;
    acc.push(acc[acc.length - 1] + len);
    return acc;
  }, [0]);

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 150 150" className="w-36 h-36 shrink-0 -rotate-90">
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          return (
            <circle
              key={s.label}
              r={r}
              cx={75}
              cy={75}
              fill="none"
              stroke={s.color}
              strokeWidth={20}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={offsets[i]}
              strokeLinecap="butt"
            />
          );
        })}
        <text
          x="75"
          y="78"
          textAnchor="middle"
          transform="rotate(90 75 75)"
          className="fill-foreground font-mono font-bold text-base"
        >
          {total}%
        </text>
      </svg>
      <ul className="space-y-2.5 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ background: s.color }}
            />
            <span className="flex-1">{s.label}</span>
            <span className="font-mono text-muted-foreground">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StackedBars({
  ai,
  human,
  labels,
}: {
  ai: number[];
  human: number[];
  labels: string[];
}) {
  const max = Math.max(...ai.map((v, i) => v + human[i]));
  return (
    <div>
      <div className="flex items-end gap-2 h-44">
        {ai.map((v, i) => {
          const h = human[i];
          const total = v + h;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col justify-end group cursor-pointer"
            >
              <div
                className="w-full rounded-t bg-warning/70 group-hover:bg-warning transition-all"
                style={{ height: `${(h / max) * 100}%` }}
              />
              <div
                className="w-full bg-primary/70 group-hover:bg-primary transition-all"
                style={{ height: `${(v / max) * 100}%` }}
              />
              <div className="mt-1 text-center text-[10px] font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                {total}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-2">
        {labels.map((l) => (
          <div
            key={l}
            className="flex-1 text-center text-[10px] font-mono text-muted-foreground"
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
