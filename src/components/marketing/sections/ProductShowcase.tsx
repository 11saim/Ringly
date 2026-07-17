"use client";

import { useRef } from "react";
import {
  MessageSquare,
  CalendarCheck,
  BarChart3,
  Headset,
  CheckCircle2,
} from "lucide-react";

const windows = [
  {
    id: "whatsapp",
    title: "WhatsApp Chat",
    icon: MessageSquare,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    width: "w-[300px]",
    content: (
      <div className="space-y-3 p-3">
        {[
          { text: "Do you have a haircut available today?", left: true },
          { text: "Yes! Sarah is available at 3pm and 5pm.", left: false },
          { text: "Book me for 5pm please", left: true },
          { text: "Done! Booking confirmed for 5pm with Sarah.", left: false },
        ].map((m, i) => (
          <div key={i} className={`flex ${m.left ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${m.left ? "bg-white border border-black/[0.06] text-slate-700" : "bg-emerald-50 text-emerald-800"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "booking",
    title: "Smart Booking",
    icon: CalendarCheck,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    width: "w-[280px]",
    content: (
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Today&apos;s Bookings</span>
          <span className="text-xs text-emerald-600 font-mono font-bold">12</span>
        </div>
        {["Sarah — 5pm Haircut", "Ahmed — 3pm Facial", "Fatima — 6pm Manicure"].map((b, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
            {b}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: BarChart3,
    color: "text-amber-600",
    bg: "bg-amber-50",
    width: "w-[260px]",
    content: (
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Conversations", value: "847", delta: "+23%" },
            { label: "Bookings", value: "312", delta: "+18%" },
            { label: "Orders", value: "96", delta: "+31%" },
            { label: "CSAT", value: "4.8", delta: "+0.3" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-[10px] text-slate-400 mb-0.5">{s.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-slate-900 font-mono">{s.value}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">{s.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "handoff",
    title: "Human Handoff",
    icon: Headset,
    color: "text-rose-600",
    bg: "bg-rose-50",
    width: "w-[280px]",
    content: (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
          <span className="text-xs font-semibold text-amber-700">1 pending handoff</span>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-1">Customer complaint about order #4821</p>
          <div className="flex gap-2">
            <button className="flex-1 text-[11px] font-semibold bg-[#0F172A] text-white rounded-lg py-1.5 transition-colors hover:bg-[#1E293B]">Take Over</button>
            <button className="flex-1 text-[11px] font-semibold bg-white border border-black/[0.08] text-slate-700 rounded-lg py-1.5 transition-colors hover:bg-slate-50">Dismiss</button>
          </div>
        </div>
      </div>
    ),
  },
];

function WindowCard({ window: win, index }: { window: typeof windows[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`${win.width} bg-white rounded-2xl border border-black/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden shrink-0 transition-shadow duration-300 hover:shadow-[0_16px_40px_rgb(0,0,0,0.1)]`}
    >
      {/* Window header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-black/[0.04]">
        <div className={`p-1.5 rounded-lg ${win.bg}`} aria-hidden="true">
          <win.icon className={`h-3.5 w-3.5 ${win.color}`} />
        </div>
        <span className="text-xs font-semibold text-slate-700">{win.title}</span>
        <div className="ml-auto flex gap-1" aria-hidden="true">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        </div>
      </div>
      {/* Window content */}
      <div className="max-h-[240px] overflow-hidden">{win.content}</div>
    </div>
  );
}

export function ProductShowcase() {
  return (
    <section className="relative py-24 sm:py-28 px-5 sm:px-6 overflow-hidden" aria-labelledby="showcase-heading">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-white to-[#FAFAFA]" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <div
          className="text-center mb-14 sm:mb-16"
        >
          <h2 id="showcase-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.15]">
            See Ringly in action
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            From conversations to bookings to analytics — everything works together seamlessly.
          </p>
        </div>

        {/* Floating windows grid */}
        <div className="flex flex-wrap justify-center gap-5 sm:gap-6" style={{ perspective: 1000 }} role="list">
          {windows.map((win, i) => (
            <WindowCard key={win.id} window={win} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
