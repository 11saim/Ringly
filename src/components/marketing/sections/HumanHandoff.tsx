"use client";

import { Bot, User, Phone, CheckCircle2 } from "lucide-react";

const timeline = [
  { time: "0s", event: "Customer sends message", icon: Phone, color: "text-blue-500", bg: "bg-blue-50", detail: "\"I want to complain about my last order...\"" },
  { time: "1s", event: "AI detects frustration", icon: Bot, color: "text-emerald-500", bg: "bg-emerald-50", detail: "Confidence drops below threshold" },
  { time: "2s", event: "Staff notified", icon: User, color: "text-amber-500", bg: "bg-amber-50", detail: "Conversation appears in handoff queue" },
  { time: "3s", event: "Human takes over", icon: User, color: "text-indigo-500", bg: "bg-indigo-50", detail: "Full context passed to staff member" },
  { time: "5m", event: "Issue resolved", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", detail: "Agent resumes automatically" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function HumanHandoff() {
  return (
    <section className="relative py-24 sm:py-28 px-5 sm:px-6 overflow-hidden" aria-labelledby="handoff-heading">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-6">
              <Bot className="h-3.5 w-3.5" aria-hidden="true" />
              Built-in safety net
            </div>
            <h2 id="handoff-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.15]">
              Your AI knows when
              <br />
              <span className="text-rose-500">to step aside</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">
              When confidence drops, a customer asks for a human, or your team wants to intervene — the agent goes silent and a live staff member takes over. Full context. Zero friction.
            </p>

            <div className="space-y-3.5" role="list">
              {[
                "Customers can always reach a real person",
                "Full conversation context passed to staff",
                "Agent resumes automatically after resolution",
                "Manual takeover available at any time",
              ].map((point, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                  role="listitem"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" aria-hidden="true" />
                  <span className="text-sm text-slate-600">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-amber-200 to-emerald-200" aria-hidden="true" />

            <div className="space-y-4 sm:space-y-6">
              {timeline.map((step) => (
                <div
                  key={step.time}
                  className="relative flex items-start gap-4 sm:gap-5 pl-0.5"
                >
                  {/* Timeline dot */}
                  <div className={`relative z-10 shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${step.bg} border border-black/[0.04] flex items-center justify-center shadow-sm`} aria-hidden="true">
                    <step.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${step.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-xl border border-black/[0.06] p-3.5 sm:p-4 shadow-[0_2px_8px_rgb(0,0,0,0.03)]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{step.time}</span>
                      <span className="text-sm font-semibold text-[#0F172A]">{step.event}</span>
                    </div>
                    <p className="text-xs text-slate-500">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
