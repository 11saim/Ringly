"use client";

import { MessageSquare, Clock, PhoneMissed, UserX, TrendingDown } from "lucide-react";
import { AnimatedCounter } from "../AnimatedCounter";

const problems = [
  {
    icon: MessageSquare,
    metric: 32,
    suffix: "",
    unit: "messages",
    label: "unread at end of day",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: Clock,
    metric: 4.2,
    suffix: "h",
    unit: "avg reply time",
    label: "during business hours",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: PhoneMissed,
    metric: 2000,
    suffix: "",
    unit: "lost ($)",
    label: "in one Saturday alone",
    color: "text-red-400",
    bg: "bg-red-500/10",
    prefix: "$",
  },
  {
    icon: UserX,
    metric: 68,
    suffix: "%",
    unit: "of customers",
    label: "go to competitors",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function ProblemSection() {
  return (
    <section className="relative py-24 sm:py-28 px-5 sm:px-6 overflow-hidden" aria-labelledby="problem-heading">
      {/* Dark background for contrast */}
      <div className="absolute inset-0 bg-[#0F172A]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div
          className="text-center mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold mb-6">
            <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
            The real cost of manual WhatsApp
          </div>
          <h2 id="problem-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-[1.15]">
            Every unanswered message
            <br />
            <span className="text-red-400">is a customer you lose</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A hairdresser missed $2,000 in Saturday bookings because 32 WhatsApp messages piled up while she was busy with clients.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {problems.map((p) => (
            <div key={p.label} className="text-center">
              <AnimatedCounter
                target={p.metric}
                suffix={p.suffix}
                prefix={p.prefix}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-mono leading-none"
              />
              <p className={`text-sm font-medium ${p.color} mt-2`}>{p.unit}</p>
              <p className="text-xs text-slate-500 mt-1">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
