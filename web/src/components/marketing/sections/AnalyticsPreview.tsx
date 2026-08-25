"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  CalendarCheck,
  ShoppingCart,
  TrendingUp,
  Users,
  ThumbsUp,
  ArrowUpRight,
} from "lucide-react";

const metrics: Array<{ icon: React.ComponentType<{ className?: string }>; label: string; value: number; displayValue: string; suffix?: string; change: string; color: string; bg: string }> = [
  { icon: MessageSquare, label: "Conversations", value: 12847, displayValue: "12,847", change: "+34%", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: CalendarCheck, label: "Bookings Made", value: 3219, displayValue: "3,219", change: "+28%", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: ShoppingCart, label: "Orders Taken", value: 1847, displayValue: "1,847", change: "+41%", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: TrendingUp, label: "Conversion Rate", value: 24, displayValue: "24.3%", suffix: ".3%", change: "+5.2%", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: Users, label: "AI Confidence", value: 95, displayValue: "94.7%", suffix: ".7%", change: "+2.1%", color: "text-violet-600", bg: "bg-violet-50" },
  { icon: ThumbsUp, label: "CSAT Score", value: 5, displayValue: "4.8/5", suffix: ".8/5", change: "+0.4", color: "text-pink-600", bg: "bg-pink-50" },
];

const barData = [35, 55, 40, 70, 45, 80, 60, 90, 75, 95, 85, 100];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  const formatted = count.toLocaleString();
  return <>{formatted}{suffix}</>;
}

function MiniChart() {
  return (
    <div className="flex items-end gap-1 h-20" aria-hidden="true">
      {barData.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-gradient-to-t from-emerald-500/20 to-emerald-500/60 origin-bottom animate-bar-grow group/bar relative"
          style={{
            height: `${h}%`,
            animationDelay: `${i * 0.08}s`,
          }}
        >
          <div className="absolute inset-0 rounded-t bg-emerald-400/0 group-hover/bar:bg-emerald-400/20 transition-colors duration-300" />
        </div>
      ))}
    </div>
  );
}

export function AnalyticsPreview() {
  return (
    <section className="relative py-24 sm:py-28 px-5 sm:px-6 overflow-hidden" aria-labelledby="analytics-heading">
      <div className="absolute inset-0 bg-[#0F172A]" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glow behind dashboard */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/[0.07] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center mb-14 sm:mb-16">
          <h2 id="analytics-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-[1.15]">
            Real-time analytics
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              that drive decisions
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            See what your customers ask, where they drop off, and how your AI improves over time.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden shadow-[0_32px_64px_rgb(0,0,0,0.3)]">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10">
            <div className="absolute inset-0 animate-dashboard-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          </div>

          {/* Dashboard header */}
          <div className="relative flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
              </div>
              <span className="text-sm font-semibold text-white/80">Ringly Dashboard</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="relative w-2 h-2" aria-hidden="true">
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping" />
                <div className="relative w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span aria-label="Dashboard is live">Live</span>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-4 sm:p-6">
            {/* Metrics grid */}
            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-5 sm:mb-6">
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className="group bg-white/[0.04] border border-white/[0.06] rounded-lg p-3.5 sm:p-4 hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300 animate-metric-pop cursor-default"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                    <div className={`p-1.5 rounded-lg ${m.bg}`} aria-hidden="true">
                      <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-white font-mono">
                    <AnimatedCounter target={m.value} suffix={m.suffix ?? ""} />
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-slate-500">{m.label}</p>
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400">
                      <ArrowUpRight className="h-2.5 w-2.5" />
                      {m.change}
                  </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 sm:p-5 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-white">Conversation Volume</p>
                  <p className="text-xs text-slate-500">Last 12 months</p>
                </div>
              </div>
              <MiniChart />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
