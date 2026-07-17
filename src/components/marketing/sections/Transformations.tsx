"use client";

import { ArrowRight, Clock, Users, Zap, TrendingUp } from "lucide-react";

const transformations = [
  {
    before: {
      title: "Manual replies",
      desc: "Owner spends 4+ hours daily responding to WhatsApp messages manually.",
      icon: Clock,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    after: {
      title: "AI handles 90%",
      desc: "Agent responds instantly to hundreds of conversations simultaneously.",
      icon: Zap,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  },
  {
    before: {
      title: "Missed bookings",
      desc: "Messages pile up during busy hours. Customers book elsewhere.",
      icon: Users,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    after: {
      title: "Zero missed bookings",
      desc: "Every inquiry is handled immediately. Calendar stays full.",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  },
];


export function Transformations() {
  return (
    <section className="relative py-24 sm:py-28 px-5 sm:px-6" aria-labelledby="transformations-heading">
      <div className="mx-auto max-w-6xl">
        <div
          className="text-center mb-14 sm:mb-16"
        >
          <h2 id="transformations-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.15]">
            Why businesses choose Ringly
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            Not just features. Real transformations that impact your bottom line.
          </p>
        </div>

        <div
          className="space-y-6 sm:space-y-8"
        >
          {transformations.map((t, i) => (
            <div
              key={i}
              className="grid md:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-center"
            >
              {/* Before */}
              <div className="rounded-2xl border border-red-200/60 bg-red-50/30 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Before</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${t.before.bg} shrink-0`} aria-hidden="true">
                    <t.before.icon className={`h-5 w-5 ${t.before.color}`} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0F172A] mb-1">{t.before.title}</h4>
                    <p className="text-sm text-slate-500">{t.before.desc}</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div
                  className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center shadow-lg"
                  aria-hidden="true"
                >
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* After */}
              <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/30 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">After Ringly</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${t.after.bg} shrink-0`} aria-hidden="true">
                    <t.after.icon className={`h-5 w-5 ${t.after.color}`} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0F172A] mb-1">{t.after.title}</h4>
                    <p className="text-sm text-slate-500">{t.after.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
