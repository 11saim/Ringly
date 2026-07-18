"use client";

import {
  MessageSquare,
  Bot,
  CalendarCheck,
  BarChart3,
  Sparkles,
} from "lucide-react";
import ScrollStack, { ScrollStackItem } from "../../ui/ScrollStack";

const steps = [
  {
    num: "01",
    icon: MessageSquare,
    label: "Customer messages you",
    desc: "A customer reaches out on WhatsApp with a question about booking, pricing, or availability.",
  },
  {
    num: "02",
    icon: Bot,
    label: "AI understands & reasons",
    desc: "The AI reads the message, understands intent, checks your calendar, inventory, or FAQ — and decides what to do.",
  },
  {
    num: "03",
    icon: CalendarCheck,
    label: "Books, orders, or replies",
    desc: "It books the appointment, places the order, answers the question — whatever the customer needed.",
  },
  {
    num: "04",
    icon: BarChart3,
    label: "You see everything",
    desc: "Every conversation, every booking, every dollar — logged and visible in your dashboard in real time.",
  },
];

export function SolutionSection() {
  return (
    <section id="solution" className="bg-[#0F172A]" aria-labelledby="solution-heading">
      {/* Static header, sits above the stack */}
      <div className="mx-auto max-w-6xl px-5 sm:px-6 pt-20 sm:pt-28 pb-2 text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          How Ringly works
        </div>
        <h2
          id="solution-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-[1.15]"
        >
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

      {/* useWindowScroll ties the pin/stack effect to the page's own scrollbar —
          no nested scroll container, no fixed-height wrapper needed */}
      <ScrollStack
        useWindowScroll
        className="!h-auto !overflow-visible bg-transparent"
        itemDistance={120}
        itemScale={0.03}
        itemStackDistance={30}
        stackPosition="18%"
        scaleEndPosition="8%"
        baseScale={0.87}
        rotationAmount={0}
        blurAmount={0}
      >
        {steps.map((step) => (
          <ScrollStackItem
            key={step.label}
            itemClassName="!bg-[#131B2E]/95 !backdrop-blur-xl !border !border-white/[0.08] !shadow-2xl !rounded-3xl !p-8 sm:!p-10 !h-auto !min-h-[20rem] max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10">
                <step.icon className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="text-sm text-slate-500">Step {step.num} of 04</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">{step.label}</h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{step.desc}</p>

            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.04]"
                >
                  <div className="h-3 w-24 rounded bg-white/10" />
                  <div className="h-3 w-12 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}