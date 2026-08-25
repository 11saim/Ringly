"use client";

import { useRef, useState, useEffect } from "react";
import {
  CalendarCheck,
  Sparkles,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  Check,
  AlertTriangle,
  Headphones,
  Clock,
  Users,
  Heart,
} from "lucide-react";

function useStagger(total: number, active: boolean, delay = 250) {
  const [visible, setVisible] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!active) return;
    for (let i = 0; i < total; i++) {
      timers.current.push(setTimeout(() => setVisible(i), delay + i * delay));
    }
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [active, total, delay]);
  return active ? visible : -1;
}

/* ── Booking Flow Card (large 2x2) ── */
function BookingFlowCard({ active }: { active: boolean }) {
  const [stepState, setStepState] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!active) return;
    const seq = [0, 1200, 2400, 3400, 4200, 5000];
    seq.forEach((d, i) => { timers.current.push(setTimeout(() => setStepState(i), d)); });
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [active]);

  const step = active ? stepState : -1;

  const steps = [
    { label: "Customer arrives", sub: "Walk-in or online", icon: Users, color: "#6366f1" },
    { label: "Selects service", sub: "Haircut, color, style...", icon: Heart, color: "#ec4899" },
    { label: "Picks time slot", sub: "Real-time availability", icon: Clock, color: "#f59e0b" },
    { label: "Confirms booking", sub: "Instant confirmation", icon: CalendarCheck, color: "#10b981" },
  ];

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-100/40 to-transparent pointer-events-none" />

      <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "12px 12px" }} />
        <div className="w-7 h-7 rounded bg-white/20 flex items-center justify-center backdrop-blur-sm relative">
          <CalendarCheck className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 relative">
          <p className="text-[10px] font-bold text-white tracking-wide">Booking Flow</p>
          <p className="text-[7px] text-violet-200 mt-px">Fully automated, zero effort</p>
        </div>
        <div className="flex items-center gap-1 bg-white/15 rounded px-1.5 py-px relative">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[7px] text-white/90 font-medium">Live</span>
        </div>
      </div>

      <div className="flex-1 p-3 flex flex-col justify-center gap-2.5">
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5"
            style={{
              opacity: i <= step ? 1 : 0,
              transform: i <= step ? "translateX(0)" : "translateX(-10px)",
              transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div className="relative shrink-0">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-500"
                style={{
                  background: i <= step ? `${s.color}12` : "#f8fafc",
                  border: `1.5px solid ${i <= step ? s.color : "#e2e8f0"}`,
                  boxShadow: i <= step ? `0 0 0 3px ${s.color}10` : "none",
                }}
              >
                {i < step ? (
                  <Check className="w-3.5 h-3.5" style={{ color: s.color }} strokeWidth={2.5} />
                ) : (
                  <s.icon className="w-3.5 h-3.5 transition-colors duration-300" style={{ color: i === step ? s.color : "#cbd5e1" }} />
                )}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute left-4 top-8 w-px h-2" style={{ background: i < step ? s.color : "#e2e8f0" }} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <p className="text-[9px] font-semibold" style={{ color: i <= step ? "#0f172a" : "#94a3b8" }}>{s.label}</p>
                <p className="text-[6px]" style={{ color: i <= step ? "#94a3b8" : "#cbd5e1" }}>{s.sub}</p>
              </div>
              <div className="mt-1 h-[3px] rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: i < step ? "100%" : i === step ? "65%" : "0%",
                    background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <div
          className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-md border transition-all duration-500"
          style={{
            opacity: step >= 5 ? 1 : 0,
            transform: step >= 5 ? "translateY(0) scale(1)" : "translateY(6px) scale(0.95)",
            background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
            borderColor: "#a7f3d0",
          }}
        >
          <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
          <div>
            <span className="text-[9px] font-bold text-emerald-800 block">Booking confirmed</span>
            <span className="text-[7px] text-emerald-600">Completed in 4.2 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Setup Steps Card ── */
function SetupStepsCard({ active }: { active: boolean }) {
  const [stepState, setStepState] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!active) return;
    const seq = [0, 900, 1800, 2600];
    seq.forEach((d, i) => { timers.current.push(setTimeout(() => setStepState(i), d)); });
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [active]);

  const step = active ? stepState : -1;

  const steps = [
    { num: "1", label: "Connect your calendar", sub: "Google, iCal, Outlook", color: "#3b82f6" },
    { num: "2", label: "Set your services & hours", sub: "Prices, durations, availability", color: "#8b5cf6" },
    { num: "3", label: "Go live in under 5 minutes", sub: "AI starts working immediately", color: "#10b981" },
  ];

  return (
    <div className="h-full p-3 flex flex-col relative">
      <div className="flex items-center gap-1.5 mb-3 relative">
        <div className="w-0.5 h-3 rounded-full bg-gradient-to-b from-blue-500 to-emerald-500" />
        <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">Get started in 3 steps</p>
      </div>
      <div className="space-y-2.5 flex-1 relative">
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5"
            style={{
              opacity: i <= step ? 1 : 0,
              transform: i <= step ? "translateX(0)" : "translateX(-10px)",
              transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div
              className="w-6 h-6 rounded flex items-center justify-center shrink-0 text-[8px] font-bold transition-all duration-300"
              style={{
                background: i <= step ? s.color : "#f1f5f9",
                color: i <= step ? "white" : "#94a3b8",
                boxShadow: i <= step ? `0 0 0 3px ${s.color}15` : "none",
              }}
            >
              {i < step ? <Check className="w-3 h-3" strokeWidth={3} /> : s.num}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-[9px] font-semibold" style={{ color: i <= step ? "#0f172a" : "#94a3b8" }}>{s.label}</p>
              <p className="text-[7px] mt-px" style={{ color: i <= step ? "#94a3b8" : "#cbd5e1" }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Integrations Card ── */
function IntegrationsCard({ active }: { active: boolean }) {
  const visible = useStagger(6, active, 150);

  const integrations = [
    { name: "Google Calendar", letter: "G", color: "#4285f4" },
    { name: "Apple iCal", letter: "A", color: "#333" },
    { name: "Outlook", letter: "O", color: "#0078d4" },
    { name: "Stripe", letter: "S", color: "#635bff" },
    { name: "WhatsApp", letter: "W", color: "#25d366" },
    { name: "Instagram", letter: "I", color: "#e4405f" },
  ];

  return (
    <div className="h-full p-3 flex flex-col relative">
      <div className="flex items-center gap-1.5 mb-2.5 relative">
        <div className="w-0.5 h-3 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
        <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">Integrations</p>
      </div>
      <div className="grid grid-cols-3 gap-1.5 flex-1 relative">
        {integrations.map((int, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-1 py-2 rounded border border-black/[0.04] bg-white hover:border-black/[0.08] hover:shadow-sm transition-all duration-200 cursor-pointer"
            style={{
              opacity: i <= visible ? 1 : 0,
              transform: i <= visible ? "scale(1)" : "scale(0.85)",
              transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ background: int.color }}>
              {int.letter}
            </div>
            <span className="text-[6px] text-slate-500 font-medium text-center leading-tight">{int.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Service Menu Card ── */
function ServiceMenuCard({ active }: { active: boolean }) {
  const visible = useStagger(4, active, 250);

  const services = [
    { name: "Haircut & Style", duration: "45 min", price: "$35" },
    { name: "Full Color", duration: "90 min", price: "$120" },
    { name: "Gel Manicure", duration: "30 min", price: "$45" },
    { name: "Deep Tissue Massage", duration: "60 min", price: "$90" },
  ];

  return (
    <div className="h-full p-3 flex flex-col relative">
      <div className="flex items-center gap-1.5 mb-2.5 relative">
        <div className="w-0.5 h-3 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
        <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">Service Menu</p>
      </div>
      <div className="space-y-1.5 flex-1 relative">
        {services.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded border border-black/[0.04] bg-white hover:border-black/[0.08] hover:shadow-sm transition-all duration-200"
            style={{
              opacity: i <= visible ? 1 : 0,
              transform: i <= visible ? "translateY(0)" : "translateY(6px)",
              transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[8px] font-bold text-slate-800">{s.name}</p>
              <p className="text-[6px] text-slate-400 mt-px">{s.duration}</p>
            </div>
            <span className="text-[9px] font-bold text-slate-900 font-mono">{s.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Industry Tags Card ── */
function IndustryCard({ active }: { active: boolean }) {
  const visible = useStagger(6, active, 200);
  const [hovered, setHovered] = useState(-1);

  const industries = [
    { name: "Hair Salon", emoji: "💇", color: "#ec4899", bg: "#fdf2f8", light: "#fce7f3" },
    { name: "Spa & Wellness", emoji: "🧖", color: "#10b981", bg: "#ecfdf5", light: "#d1fae5" },
    { name: "Dental Clinic", emoji: "🦷", color: "#3b82f6", bg: "#eff6ff", light: "#dbeafe" },
    { name: "Fitness Studio", emoji: "💪", color: "#f59e0b", bg: "#fffbeb", light: "#fef3c7" },
    { name: "Pet Grooming", emoji: "🐕", color: "#8b5cf6", bg: "#f5f3ff", light: "#ede9fe" },
    { name: "Restaurant", emoji: "🍽️", color: "#ef4444", bg: "#fef2f2", light: "#fee2e2" },
  ];

  return (
    <div className="h-full p-3 flex flex-col relative">
      <div className="flex items-center gap-1.5 mb-2.5 relative">
        <div className="w-0.5 h-3 rounded-full bg-gradient-to-b from-pink-500 to-violet-500" />
        <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">Works for any industry</p>
      </div>
      <div className="flex flex-wrap gap-1.5 flex-1 items-start content-start relative">
        {industries.map((ind, i) => (
          <div
            key={i}
            className="px-2 py-1.5 rounded border transition-all duration-300 cursor-pointer flex items-center gap-1.5"
            style={{
              opacity: i <= visible ? 1 : 0,
              transform: i <= visible ? "scale(1)" : "scale(0.85)",
              background: hovered === i ? ind.light : "white",
              borderColor: hovered === i ? ind.color : "rgba(0,0,0,0.05)",
              boxShadow: hovered === i ? `0 2px 8px ${ind.color}18` : "0 1px 2px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(-1)}
          >
            <span className="text-[10px]">{ind.emoji}</span>
            <span className="text-[8px] font-bold" style={{ color: hovered === i ? ind.color : "#475569" }}>{ind.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Booking Slots Card ── */
function BookingSlotsCard({ active }: { active: boolean }) {
  const visible = useStagger(4, active, 300);

  const slots = [
    { time: "9:00 AM", label: "Morning", available: true },
    { time: "11:30 AM", label: "Midday", available: true },
    { time: "2:00 PM", label: "Afternoon", available: true },
    { time: "4:30 PM", label: "Evening", available: false },
  ];

  return (
    <div className="h-full p-3 flex flex-col relative">
      <div className="flex items-center gap-1.5 mb-2.5 relative">
        <div className="w-0.5 h-3 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />
        <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">Available Slots</p>
      </div>
      <div className="space-y-1.5 flex-1 relative">
        {slots.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded border transition-all duration-300 cursor-pointer"
            style={{
              opacity: i <= visible ? 1 : 0,
              transform: i <= visible ? "translateX(0)" : "translateX(-10px)",
              background: i === 0
                ? "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)"
                : "white",
              borderColor: i === 0 ? "transparent" : s.available ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.03)",
              boxShadow: i === 0 ? "0 2px 10px rgba(99,102,241,0.3)" : "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="w-7 h-7 rounded flex items-center justify-center shrink-0"
              style={{ background: i === 0 ? "rgba(255,255,255,0.2)" : s.available ? "#eff6ff" : "#f8fafc" }}
            >
              <CalendarCheck className="w-3 h-3" style={{ color: i === 0 ? "white" : s.available ? "#3b82f6" : "#cbd5e1" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold" style={{ color: i === 0 ? "white" : "#0f172a" }}>{s.time}</p>
              <p className="text-[7px] mt-px" style={{ color: i === 0 ? "rgba(255,255,255,0.7)" : "#94a3b8" }}>{s.label}</p>
            </div>
            {!s.available && (
              <span className="text-[6px] text-slate-400 font-bold bg-slate-100 px-1.5 py-px rounded">Full</span>
            )}
            {i === 0 && (
              <span className="text-[6px] text-white font-bold bg-white/20 px-1.5 py-px rounded">Popular</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Activity Feed Card ── */
function ActivityFeedCard({ active }: { active: boolean }) {
  const visible = useStagger(5, active, 350);

  const events = [
    { icon: CalendarCheck, text: "Booking #1847 confirmed", time: "2s ago", color: "#10b981", bg: "#ecfdf5" },
    { icon: Zap, text: "AI responded in 0.8s", time: "5s ago", color: "#f59e0b", bg: "#fffbeb" },
    { icon: Headphones, text: "Escalated to Sarah M.", time: "12s ago", color: "#8b5cf6", bg: "#f5f3ff" },
    { icon: TrendingUp, text: "Revenue +$45 today", time: "18s ago", color: "#ec4899", bg: "#fdf2f8" },
    { icon: Users, text: "New customer onboarded", time: "24s ago", color: "#3b82f6", bg: "#eff6ff" },
  ];

  return (
    <div className="h-full p-3 flex flex-col relative">
      <div className="flex items-center gap-1.5 mb-2.5 relative">
        <div className="w-0.5 h-3 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
        <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">Live Activity</p>
      </div>
      <div className="space-y-1.5 flex-1 relative">
        {events.map((e, i) => (
          <div
            key={i}
            className="flex items-center gap-2 py-0.5 group"
            style={{
              opacity: i <= visible ? 1 : 0,
              transform: i <= visible ? "translateX(0)" : "translateX(-10px)",
              transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 border" style={{ background: e.bg, borderColor: `${e.color}15` }}>
              <e.icon className="w-3 h-3" style={{ color: e.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[8px] text-slate-700 font-semibold block">{e.text}</span>
              <span className="text-[6px] text-slate-400 font-mono">{e.time}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: e.color, boxShadow: `0 0 4px ${e.color}40` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 24/7 Coverage Card ── */
function CoverageCard({ active }: { active: boolean }) {
  const [idxState, setIdxState] = useState(-1);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const interval = setInterval(() => { setIdxState(i); i = (i + 1) % 24; }, 180);
    const timeout = setTimeout(() => { clearInterval(interval); setIdxState(23); }, 4500);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [active]);

  const activeIdx = active ? idxState : -1;

  return (
    <div className="h-full p-3 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 80%, rgba(99,102,241,0.04) 0%, transparent 60%)" }} />

      <div className="flex items-center gap-2 mb-3 relative">
        <div className="w-6 h-6 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Globe className="w-3 h-3 text-indigo-500" />
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">24/7 Coverage</p>
          <p className="text-[6px] text-slate-400 mt-px">Never miss a customer</p>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-[2px] relative">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i}>
            <div
              className="w-full h-5 rounded-[2px] transition-all duration-200"
              style={{
                background: i <= activeIdx
                  ? "linear-gradient(180deg, #6366f1, #818cf8)"
                  : "rgba(99,102,241,0.06)",
                boxShadow: i === activeIdx ? "0 0 8px rgba(99,102,241,0.5)" : "none",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1 px-px relative">
        {["12a","6a","12p","6p","11p"].map((h) => (
          <span key={h} className="text-[5px] text-slate-400 font-mono font-medium">{h}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Safety / Handoff Card ── */
function SafetyCard({ active }: { active: boolean }) {
  const [checkedState, setCheckedState] = useState(false);
  const [pulseState, setPulseState] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t1 = setTimeout(() => setPulseState(true), 600);
    const t2 = setTimeout(() => setCheckedState(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active]);

  const checked = active && checkedState;
  const pulse = active && pulseState;

  return (
    <div className="h-full p-3 flex flex-col justify-center relative">
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 20%, rgba(244,63,94,0.03) 0%, transparent 60%)" }} />

      <div className="flex items-center gap-2 mb-2.5 relative">
        <div className="w-6 h-6 rounded bg-rose-50 border border-rose-100 flex items-center justify-center">
          <Shield className="w-3 h-3 text-rose-500" />
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">Smart Handoff</p>
          <p className="text-[6px] text-slate-400 mt-px">Detects frustration instantly</p>
        </div>
      </div>
      <div className="bg-gradient-to-br from-amber-50/80 via-rose-50/40 to-white rounded-md p-3 border border-amber-100/50 relative">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="relative">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            {pulse && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />}
          </div>
          <span className="text-[8px] font-bold text-amber-700">Frustration detected</span>
        </div>
        <p className="text-[7px] text-slate-500 italic mb-2 leading-relaxed">&ldquo;I&apos;ve been waiting 20 minutes for a reply...&rdquo;</p>
        <div
          className="flex items-center gap-1.5 py-1.5 px-2 rounded transition-all duration-500"
          style={{
            background: checked ? "rgba(16,185,129,0.08)" : "rgba(0,0,0,0.02)",
            border: `1px solid ${checked ? "rgba(16,185,129,0.2)" : "transparent"}`,
          }}
        >
          <div
            className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-300"
            style={{
              borderColor: checked ? "#10b981" : "#d1d5db",
              background: checked ? "#10b981" : "transparent",
              transform: checked ? "scale(1.1)" : "scale(1)",
              boxShadow: checked ? "0 1px 4px rgba(16,185,129,0.3)" : "none",
            }}
          >
            {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
          <span className="text-[8px] font-bold transition-colors duration-300" style={{ color: checked ? "#10b981" : "#94a3b8" }}>
            {checked ? "Sarah M. notified instantly" : "Notify team member"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const cards = [
    { component: BookingFlowCard, colSpan: "col-span-2", rowSpan: "row-span-2", delay: "0s" },
    { component: ServiceMenuCard, colSpan: "col-span-1", rowSpan: "row-span-1", delay: "0.1s" },
    { component: SetupStepsCard, colSpan: "col-span-1", rowSpan: "row-span-1", delay: "0.15s" },
    { component: IndustryCard, colSpan: "col-span-1", rowSpan: "row-span-1", delay: "0.2s" },
    { component: IntegrationsCard, colSpan: "col-span-1", rowSpan: "row-span-1", delay: "0.25s" },
    { component: BookingSlotsCard, colSpan: "col-span-1", rowSpan: "row-span-1", delay: "0.3s" },
    { component: ActivityFeedCard, colSpan: "col-span-1", rowSpan: "row-span-1", delay: "0.35s" },
    { component: CoverageCard, colSpan: "col-span-1", rowSpan: "row-span-1", delay: "0.4s" },
    { component: SafetyCard, colSpan: "col-span-1", rowSpan: "row-span-1", delay: "0.45s" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 px-5 sm:px-6 overflow-hidden"
      aria-labelledby="showcase-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-white to-[#F8FAFC]" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)", backgroundSize: "32px 32px" }} aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <div
          className="text-center mb-12 sm:mb-14"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100/80 text-violet-600 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="h-3 w-3" />
            Interactive preview
          </div>
          <h2
            id="showcase-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.1]"
          >
            See Ringly in action
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Every feature below is live. Hover and explore what your AI employee can do.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5 auto-rows-[170px] sm:auto-rows-[185px]">
          {cards.map((card, i) => {
            const Comp = card.component;
            return (
              <div
                key={i}
                className={`${card.colSpan} ${card.rowSpan} rounded-lg border border-black/[0.06] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 relative`}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${card.delay}, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${card.delay}, box-shadow 0.3s ease, transform 0.3s ease`,
                }}
              >
                <Comp active={inView} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
