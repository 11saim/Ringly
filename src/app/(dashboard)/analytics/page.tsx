"use client";

import { AppShell } from "@/components/app/AppShell";
import { BarChart3, MessageSquare, Users, Calendar, TrendingUp } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { Sparkline } from "@/components/app/Sparkline";
import { cn } from "@/lib/utils";

const CARD = "rounded-[16px] border border-border/30 bg-card shadow-[var(--shadow-card)]";

const kpis = [
  { label: "Total Conversations", value: 3847, sparkline: [45,52,58,62,68,72,78,82,88,92,96,100], color: "#6366f1", icon: MessageSquare },
  { label: "Total Customers", value: 486, sparkline: [18,22,25,28,32,30,35,38,42,40,45,48], color: "#22c55e", icon: Users },
  { label: "Total Bookings", value: 892, sparkline: [30,35,40,45,50,48,55,60,65,62,68,72], color: "#f59e0b", icon: Calendar },
  { label: "Conversion Rate", value: 78, suffix: "%", sparkline: [60,62,65,68,70,72,73,74,75,76,77,78], color: "#8b5cf6", icon: TrendingUp },
];

function KpiCard({ kpi }: { kpi: (typeof kpis)[number] }) {
  const count = useCountUp(kpi.value, 1400);
  const Icon = kpi.icon;
  return (
    <div className={cn(CARD, "p-5")}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-muted-foreground/50 tracking-widest uppercase">{kpi.label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-muted/50">
          <Icon size={14} strokeWidth={1.8} className="text-muted-foreground/40" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-[32px] font-bold text-foreground tracking-[-0.03em] leading-none tabular-nums">
          {count.toLocaleString()}{kpi.suffix ?? ""}
        </div>
        <Sparkline data={kpi.sparkline} color={kpi.color} />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AppShell title="Analytics">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </div>
        <div className={cn(CARD, "p-8 text-center")}>
          <BarChart3 size={32} strokeWidth={1.2} className="text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-[14px] font-semibold text-foreground/60 mb-1">Detailed analytics coming soon</p>
          <p className="text-[12px] text-muted-foreground/40">Conversation trends, booking insights, and customer metrics will appear here.</p>
        </div>
      </div>
    </AppShell>
  );
}
