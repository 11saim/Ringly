"use client";

import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { Sparkline } from "@/components/app/Sparkline";
import { ConfidenceBar } from "@/components/app/ConfidenceBar";
import { conversations } from "@/lib/mock";
import { ArrowUpRight, AlertTriangle, Bot, Zap, TrendingUp, Activity, MessageSquare, DollarSign, PhoneCall, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [now, setNow] = useState(new Date());
  const [live, setLive] = useState(216);
  useEffect(() => {
    const t = setInterval(() => { setNow(new Date()); setLive((n) => n + (Math.random() > 0.7 ? 1 : 0)); }, 3000);
    return () => clearInterval(t);
  }, []);
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppShell title="Overview" subtitle="Bloom Studio · Growth plan">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#1e1e5a] text-white p-8">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#8b5cf6]/30 blur-3xl animate-blob" style={{ animationDelay: "-6s" }} />
        <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" /> Agent online · {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight">{greeting}, Ana.</h1>
            <p className="mt-3 text-white/70 max-w-lg leading-relaxed">
              While you were away, <span className="text-white font-semibold">14 conversations</span> were handled, <span className="text-white font-semibold">3 bookings</span> closed for <span className="text-white font-semibold">$312</span>, and <span className="text-warning font-semibold">1 refund</span> needs your call.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/inbox"><Button className="bg-white text-black hover:bg-white/90"><MessageSquare className="mr-1.5 h-4 w-4" /> Review inbox</Button></Link>
              <Link href="/agent-config"><Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10"><Bot className="mr-1.5 h-4 w-4" /> Tune agent</Button></Link>
              <Link href="/bookings"><Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10"><CheckCircle2 className="mr-1.5 h-4 w-4" /> Bookings</Button></Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
            <div className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-1.5"><Activity className="h-3 w-3" /> Live conversations</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-5xl font-black tracking-tight tabular-nums">{live}</span>
              <span className="text-xs text-success flex items-center"><ArrowUpRight size={12} /> 24%</span>
            </div>
            <div className="mt-4 h-16 text-primary"><Sparkline data={[8, 14, 12, 22, 18, 28, 34, 30, 42, 38, 44, 52]} /></div>
            <div className="mt-2 text-[11px] text-white/60">Resolution rate <span className="text-success font-mono">78%</span> · Streaming</div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Bookings today" value="14" delta="+3 vs yesterday" icon={<CheckCircle2 />} accent="from-emerald-500/20 to-emerald-500/0" />
        <Kpi label="Revenue influenced" value="$1,284" delta="+18% WoW" icon={<DollarSign />} accent="from-primary/20 to-primary/0" />
        <Kpi label="Escalations" value="3" delta="Needs review" icon={<AlertTriangle />} tone="warning" accent="from-amber-500/20 to-amber-500/0" />
        <Kpi label="Avg. response" value="1.8s" delta="-0.4s" icon={<Zap />} accent="from-fuchsia-500/20 to-fuchsia-500/0" />
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold">Realtime activity</div>
              <span className="rounded-full bg-success/10 text-success text-[10px] font-mono px-2 py-0.5 flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-success animate-pulse-dot" /> LIVE</span>
            </div>
            <Link href="/inbox" className="text-xs text-primary hover:underline">Open inbox →</Link>
          </div>
          <ul className="divide-y divide-border">
            {conversations.slice(0, 5).map((c, i) => (
              <li key={c.id} className="group flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <span className={`grid h-9 w-9 place-items-center rounded-lg text-white text-[11px] ${c.channel === "whatsapp" ? "bg-whatsapp" : "bg-voice"}`}>
                  {c.channel === "whatsapp" ? "W" : <PhoneCall className="h-4 w-4" />}
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

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="text-sm font-semibold flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 text-warning" /> Escalations</div>
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

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-sm font-semibold flex items-center gap-1.5"><Bot className="h-4 w-4 text-primary" /> Agent health</div>
            <div className="mt-4 space-y-3">
              <HealthBar label="Model latency" value={82} suffix="ms" tone="ok" />
              <HealthBar label="Knowledge freshness" value={94} suffix="%" tone="ok" />
              <HealthBar label="Confidence avg." value={78} suffix="%" tone="ok" />
              <HealthBar label="Guardrail hits" value={12} suffix=" today" tone="warn" />
            </div>
          </div>

          <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-accent-soft to-transparent p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold"><TrendingUp className="h-3.5 w-3.5" /> Copilot suggestion</div>
            <div className="mt-2 text-sm leading-relaxed">
              Weekend availability questions are up <span className="font-mono font-bold">42%</span>. Consider adding Saturday hours to your catalog.
            </div>
            <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90">Apply suggestion</Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value, delta, icon, tone, accent }: { label: string; value: string; delta: string; icon: React.ReactNode; tone?: "warning"; accent?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-border bg-card p-5`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accent || "from-transparent to-transparent"} pointer-events-none`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="text-muted-foreground [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</div>
        </div>
        <div className="mt-2 font-mono text-3xl font-bold tabular-nums">{value}</div>
        <div className={`mt-1 text-xs ${tone === "warning" ? "text-warning" : "text-success"}`}>{delta}</div>
      </div>
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
        <div className={`h-full ${tone === "ok" ? "bg-success" : "bg-warning"} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
