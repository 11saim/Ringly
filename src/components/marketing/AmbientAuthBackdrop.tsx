"use client";

import { useEffect, useState } from "react";

const heroMessages = [
  "Booked in 12 seconds.",
  "Answered while you slept.",
  "Zero missed messages.",
  "Sold out and reordered — automatically.",
  "Refund request escalated.",
  "Calendar checked instantly.",
];

const chatBubbles = [
  { from: "customer", text: "Hi! Do you have space for 2 people Saturday at 3pm?", align: "left" as const },
  { from: "agent", text: "Yes — Saturday at 3:30 PM works with Ana. $30 for cut + blowout. Lock it in?", align: "right" as const },
  { from: "customer", text: "Yes please 🙌", align: "left" as const },
  { from: "agent", text: "Booked — Saturday 3:30 PM. Reminder sent Friday ✨", align: "right" as const },
];

const agentStats = [
  { label: "Intent", value: "booking", confidence: "92%" },
  { label: "Catalog", value: "synced", confidence: "6 items" },
  { label: "Next action", value: "hold slot", confidence: "safe" },
];

const floatingCards = [
  { icon: "📞", title: "Voice call", sub: "Answered · 48s", top: "12%", left: "8%", delay: "0s", dur: "8s" },
  { icon: "💬", title: "WhatsApp", sub: "Resolved in 12s", top: "28%", left: "72%", delay: "-2s", dur: "9s" },
  { icon: "📅", title: "Booking", sub: "Sat 3:30 PM · Ana", top: "65%", left: "6%", delay: "-4s", dur: "10s" },
  { icon: "💳", title: "Payment", sub: "$30 deposit received", top: "72%", left: "68%", delay: "-6s", dur: "11s" },
  { icon: "🔔", title: "Escalation", sub: "Refund → human review", top: "45%", left: "80%", delay: "-1s", dur: "7s" },
  { icon: "⚡", title: "Agent action", sub: "Calendar checked · slot held", top: "85%", left: "35%", delay: "-3s", dur: "12s" },
];

export function AmbientAuthBackdrop({ businessName }: { businessName?: string }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [chatIdx, setChatIdx] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setHeroIdx((n) => (n + 1) % heroMessages.length), 3500);
    const t2 = setInterval(() => setChatIdx((n) => (n + 1) % chatBubbles.length), 2800);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#06060a]">
      {/* Animated gradient blobs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#4f46e5] opacity-30 blur-[120px] animate-blob" />
      <div className="absolute top-1/4 -right-20 h-[450px] w-[450px] rounded-full bg-[#7c3aed] opacity-25 blur-[100px] animate-blob" style={{ animationDelay: "-6s" }} />
      <div className="absolute -bottom-24 left-1/3 h-[400px] w-[400px] rounded-full bg-[#6366f1] opacity-20 blur-[100px] animate-blob" style={{ animationDelay: "-12s" }} />
      <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b5cf6] opacity-15 blur-[80px] animate-blob" style={{ animationDelay: "-8s" }} />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,6,10,0.4)_70%,rgba(6,6,10,0.8)_100%)]" />

      {/* Floating status cards */}
      {floatingCards.map((card, idx) => (
        <div
          key={idx}
          className="absolute hidden lg:block animate-bubble opacity-0"
          style={{
            top: card.top,
            left: card.left,
            ["--rot" as string]: `${(idx % 2 === 0 ? -1 : 1) * (2 + idx)}deg`,
            ["--dur" as string]: card.dur,
            animationDelay: card.delay,
            animationFillMode: "forwards",
          } as React.CSSProperties}
        >
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{card.icon}</span>
              <div>
                <div className="text-xs font-medium text-white/80">{card.title}</div>
                <div className="text-[11px] text-white/40">{card.sub}</div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Agent state panel (left side) */}
      <div className="absolute left-6 top-1/2 hidden w-64 -translate-y-1/2 xl:block">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium">{businessName ? `${businessName} agent` : "Agent state"}</span>
          </div>
          <div className="space-y-2.5">
            {agentStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5 border border-white/[0.05]">
                <span className="text-xs text-white/40">{stat.label}</span>
                <span className="text-xs font-mono text-white/70">{stat.value} · <span className="text-emerald-400/80">{stat.confidence}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp conversation preview (right side) */}
      <div className="absolute right-6 top-1/2 hidden w-72 -translate-y-1/2 xl:block">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-[#25d366] text-[9px] font-bold text-white">W</div>
            <span className="text-xs text-white/60">Sofia N. · WhatsApp</span>
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-2.5">
            {chatBubbles.slice(0, chatIdx + 1).map((bubble, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed animate-slide-in ${
                  bubble.align === "right"
                    ? "ml-auto bg-[#4f46e5]/80 text-white"
                    : "bg-white/[0.08] text-white/80 border border-white/[0.06]"
                }`}
              >
                {bubble.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rotating hero messages (bottom center) */}
      <div className="absolute inset-x-0 bottom-8 sm:bottom-12 flex flex-col items-center px-6 text-center z-10">
        <div className="text-[10px] uppercase tracking-[0.35em] text-white/25 mb-4 font-medium">Live on Ringly</div>
        <div className="h-12 sm:h-14 relative w-full max-w-lg mx-auto overflow-hidden">
          {heroMessages.map((m, idx) => (
            <div
              key={m}
              className={`absolute inset-0 flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold tracking-tight transition-all duration-700 ${
                idx === heroIdx
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top-left brand mark */}
      <div className="absolute top-6 left-6 flex items-center gap-2.5 z-10">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#4f46e5] text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)]">R</div>
        <span className="text-sm font-semibold text-white/60 tracking-tight">Ringly</span>
      </div>

      {/* Bottom-left subtle stats */}
      <div className="absolute bottom-6 left-6 hidden sm:flex items-center gap-4 text-[10px] text-white/20 font-mono z-10">
        <span>500+ businesses</span>
        <span className="h-3 w-px bg-white/10" />
        <span>99.98% uptime</span>
        <span className="h-3 w-px bg-white/10" />
        <span>SOC 2 Type II</span>
      </div>
    </div>
  );
}
