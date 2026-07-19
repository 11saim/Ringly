"use client";

import { useRef, useState, useEffect } from "react";
import { MessageSquare, Clock, PhoneMissed, UserX, TrendingDown, AlertTriangle } from "lucide-react";
import { AnimatedCounter } from "../AnimatedCounter";

const problems = [
  {
    icon: MessageSquare,
    metric: 32,
    suffix: "",
    unit: "messages",
    label: "unread at end of day",
    color: "#f87171",
    gradient: "from-red-500 to-rose-400",
    ring: "rgba(248,113,113,0.15)",
    barPercent: 64,
  },
  {
    icon: Clock,
    metric: 4.2,
    suffix: "h",
    unit: "avg reply time",
    label: "during business hours",
    color: "#fbbf24",
    gradient: "from-amber-500 to-yellow-400",
    ring: "rgba(251,191,36,0.15)",
    barPercent: 52,
  },
  {
    icon: PhoneMissed,
    metric: 2000,
    suffix: "",
    unit: "lost ($)",
    label: "in one Saturday alone",
    color: "#f87171",
    gradient: "from-red-500 to-orange-400",
    ring: "rgba(248,113,113,0.15)",
    barPercent: 85,
    prefix: "$",
  },
  {
    icon: UserX,
    metric: 68,
    suffix: "%",
    unit: "of customers",
    label: "go to competitors",
    color: "#fb923c",
    gradient: "from-orange-500 to-amber-400",
    ring: "rgba(251,146,60,0.15)",
    barPercent: 68,
  },
];

function StatCard({
  problem,
  index,
}: {
  problem: (typeof problems)[number];
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-2xl p-5 sm:p-6 transition-all duration-500 hover:-translate-y-1 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      style={{
        animationDelay: `${index * 100}ms`,
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${problem.ring} 0%, transparent 70%)`,
        }}
      />

      {/* Left accent */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full transition-all duration-500 group-hover:h-[60%] group-hover:top-[20%]"
        style={{
          background: `linear-gradient(to bottom, transparent, ${problem.color}, transparent)`,
          opacity: 0.5,
        }}
      />

      <div className="relative">
        {/* Icon + label row */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${problem.color}15, ${problem.color}08)`,
              border: `1px solid ${problem.color}20`,
            }}
          >
            <problem.icon className="h-4 w-4" style={{ color: problem.color }} />
          </div>
          <span
            className="text-xs font-medium tracking-wide"
            style={{ color: `${problem.color}90` }}
          >
            {problem.label}
          </span>
        </div>

        {/* Big number */}
        <div className="mb-3">
          <AnimatedCounter
            target={problem.metric}
            suffix={problem.suffix}
            prefix={problem.prefix}
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white font-mono leading-none tracking-tight"
          />
          <span
            className="text-sm font-semibold ml-2"
            style={{ color: problem.color }}
          >
            {problem.unit}
          </span>
        </div>

        {/* Mini progress bar */}
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: isVisible ? `${problem.barPercent}%` : "0%",
              background: `linear-gradient(to right, ${problem.color}, ${problem.color}80)`,
              transitionDelay: `${index * 100 + 300}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function ProblemSection() {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-28 px-5 sm:px-6 overflow-hidden"
      aria-labelledby="problem-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0F172A]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Subtle red glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div
          className={`text-center mb-14 sm:mb-16 transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold mb-6"
          >
            <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
            The real cost of manual WhatsApp
          </div>
          <h2
            id="problem-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-[1.15]"
          >
            Every unanswered message
            <br />
            <span className="text-red-400">is a customer you lose</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A hairdresser missed $2,000 in Saturday bookings because 32 WhatsApp
            messages piled up while she was busy with clients.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {problems.map((p, i) => (
            <StatCard key={p.label} problem={p} index={i} />
          ))}
        </div>

        {/* Bottom callout */}
        <div
          className={`mt-10 sm:mt-12 flex items-center justify-center gap-3 transition-all duration-500 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          style={{ transitionDelay: "600ms" }}
        >
          <AlertTriangle className="h-4 w-4 text-amber-500/60" />
          <span className="text-sm text-slate-500">
            This happens to{" "}
            <span className="text-slate-400 font-medium">every small business</span>{" "}
            managing WhatsApp manually
          </span>
        </div>
      </div>
    </section>
  );
}
