"use client";

import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { ConfidenceBar } from "@/components/app/ConfidenceBar";
import { conversations } from "@/lib/mock";
import { AlertTriangle, Bot, Zap, TrendingUp, MessageSquare, DollarSign, PhoneCall, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 3000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppShell title="Overview" subtitle="Bloom Studio · Growth plan">
      {/* Greeting banner */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Agent online · {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{greeting}, Ana.</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-lg leading-relaxed">
          While you were away, <span className="font-medium text-foreground">14 conversations</span> were handled, <span className="font-medium text-foreground">3 bookings</span> closed for <span className="font-medium text-foreground">$312</span>, and <span className="font-medium text-warning">1 refund</span> needs your call.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/inbox">
            <Button size="sm" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Review inbox</Button>
          </Link>
          <Link href="/agent-config">
            <Button size="sm" variant="outline" className="gap-1.5"><Bot className="h-3.5 w-3.5" /> Tune agent</Button>
          </Link>
          <Link href="/bookings">
            <Button size="sm" variant="outline" className="gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Bookings</Button>
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Bookings today" value="14" delta="+3 vs yesterday" icon={<CheckCircle2 />} />
        <Kpi label="Revenue influenced" value="$1,284" delta="+18% WoW" icon={<DollarSign />} />
        <Kpi label="Escalations" value="3" delta="Needs review" icon={<AlertTriangle />} tone="warning" />
        <Kpi label="Avg. response" value="1.8s" delta="-0.4s" icon={<Zap />} />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Realtime activity */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Realtime activity</span>
              <span className="rounded-full bg-success/10 text-success text-[10px] font-mono px-2 py-0.5 flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-success animate-pulse" /> LIVE
              </span>
            </div>
            <Link href="/inbox" className="text-xs text-primary hover:underline">Open inbox →</Link>
          </div>
          <ul className="divide-y divide-border">
            {conversations.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition">
                <span className={`grid h-8 w-8 place-items-center rounded-lg text-white text-[11px] ${c.channel === "whatsapp" ? "bg-whatsapp" : "bg-voice"}`}>
                  {c.channel === "whatsapp" ? "W" : <PhoneCall className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{c.customer}</span>
                    {c.ai && <ConfidenceBar level={c.confidence as 1 | 2 | 3} />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{c.preview}</div>
                </div>
                <div className="text-xs text-muted-foreground font-mono">{c.time}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Escalations */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="text-sm font-semibold flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" /> Escalations
              </div>
              <span className="rounded-full bg-warning/10 text-warning text-xs font-semibold px-2 py-0.5">3 pending</span>
            </div>
            <ul className="divide-y divide-border">
              {conversations.filter((c) => !c.ai).map((c) => (
                <li key={c.id} className="px-5 py-3">
                  <div className="text-sm font-medium">{c.customer}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.preview}</div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">Take over</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">Resolve</Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Agent health */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-sm font-semibold flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-primary" /> Agent health
            </div>
            <div className="mt-4 space-y-3">
              <HealthBar label="Model latency" value={82} suffix="ms" tone="ok" />
              <HealthBar label="Knowledge freshness" value={94} suffix="%" tone="ok" />
              <HealthBar label="Confidence avg." value={78} suffix="%" tone="ok" />
              <HealthBar label="Guardrail hits" value={12} suffix=" today" tone="warn" />
            </div>
          </div>

          {/* Copilot suggestion */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
              <TrendingUp className="h-3.5 w-3.5" /> Copilot suggestion
            </div>
            <div className="mt-2 text-sm leading-relaxed">
              Weekend availability questions are up <span className="font-mono font-bold">42%</span>. Consider adding Saturday hours to your catalog.
            </div>
            <Button size="sm" className="mt-3">Apply suggestion</Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value, delta, icon, tone }: { label: string; value: string; delta: string; icon: React.ReactNode; tone?: "warning" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-muted-foreground [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</div>
      </div>
      <div className="mt-2 font-mono text-2xl font-bold tabular-nums">{value}</div>
      <div className={`mt-0.5 text-xs ${tone === "warning" ? "text-warning" : "text-success"}`}>{delta}</div>
    </div>
  );
}

function HealthBar({ label, value, suffix, tone }: { label: string; value: number; suffix: string; tone: "ok" | "warn" }) {
  const pct = Math.min(value, 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono">{value}{suffix}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${tone === "ok" ? "bg-success" : "bg-warning"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
