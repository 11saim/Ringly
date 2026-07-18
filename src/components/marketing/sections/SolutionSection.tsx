"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Bot,
  CalendarCheck,
  BarChart3,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    num: "01",
    icon: MessageSquare,
    label: "Customer messages you",
    desc: "A customer reaches out on WhatsApp with a question about booking, pricing, or availability.",
    color: "#818CF8",
  },
  {
    num: "02",
    icon: Bot,
    label: "AI understands & reasons",
    desc: "The AI reads the message, understands intent, checks your calendar, inventory, or FAQ — and decides what to do.",
    color: "#818CF8",
  },
  {
    num: "03",
    icon: CalendarCheck,
    label: "Books, orders, or replies",
    desc: "It books the appointment, places the order, answers the question — whatever the customer needed.",
    color: "#818CF8",
  },
  {
    num: "04",
    icon: BarChart3,
    label: "You see everything",
    desc: "Every conversation, every booking, every dollar — logged and visible in your dashboard in real time.",
    color: "#818CF8",
  },
];

export function SolutionSection() {
  const [active, setActive] = useState(0);
  const rightColRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setActive(idx);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="solution" className="relative py-24 sm:py-28 px-5 sm:px-6 overflow-hidden" aria-labelledby="solution-heading">
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
        <div className="text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            How Ringly works
          </div>
          <h2 id="solution-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-[1.15]">
            Your existing WhatsApp number
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              becomes an AI employee
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            No new number. No app for your customers. Just your existing WhatsApp, now powered by an AI that works 24/7.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left side — sticky step list */}
          <div className="lg:w-[42%]">
            <div className="lg:sticky lg:top-32 space-y-20 lg:space-y-28 py-8">
              {steps.map((step, i) => {
                const isActive = i === active;
                const isPast = i < active;
                return (
                  <div
                    key={step.label}
                    className="transition-all duration-700"
                    style={{
                      opacity: isActive ? 1 : isPast ? 0.35 : 0.2,
                      transform: isActive ? "translateX(0)" : "translateX(-4px)",
                    }}
                  >
                    <div className="flex items-baseline gap-4 mb-2">
                      <span
                        className="text-4xl sm:text-5xl font-bold font-mono leading-none"
                        style={{ color: isActive ? step.color : "rgba(255,255,255,0.12)" }}
                      >
                        {step.num}
                      </span>
                      <h3 className={`text-xl sm:text-2xl font-bold ${isActive ? "text-white" : "text-white/30"}`}>
                        {step.label}
                      </h3>
                    </div>
                    <p className={`text-sm sm:text-base leading-relaxed ml-0 sm:ml-[4.5rem] ${isActive ? "text-slate-400" : "text-slate-600"}`}>
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right side — cards with sticky stacking */}
          <div className="lg:w-[58%]" ref={rightColRef}>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div
                  key={step.label}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  data-index={i}
                  className="lg:sticky lg:top-28"
                  style={{ top: `${11 + i * 3}rem` }}
                >
                  <div
                    className="rounded-3xl border border-white/[0.08] bg-[#131B2E]/95 backdrop-blur-xl p-8 sm:p-10 shadow-2xl transition-all duration-500"
                    style={{ height: "28rem" }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10">
                        <step.icon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <span className="text-sm text-slate-500">Step {step.num} of 04</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">{step.label}</h3>
                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{step.desc}</p>

                    <div className="mt-8 space-y-3">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                          <div className="h-3 w-24 rounded bg-white/10" />
                          <div className="h-3 w-12 rounded bg-white/10" />
                        </div>
                      ))}
                    </div>
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
