"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Bot,
  CalendarCheck,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    label: "Customer",
    desc: "Sends a WhatsApp message",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    icon: Bot,
    label: "AI Agent",
    desc: "Understands & reasons",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    icon: CalendarCheck,
    label: "Action",
    desc: "Books, orders, or checks",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  {
    icon: BarChart3,
    label: "Dashboard",
    desc: "You see everything",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function SolutionSection() {
  return (
    <section id="solution" className="relative py-24 sm:py-28 px-5 sm:px-6 overflow-hidden" aria-labelledby="solution-heading">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            How Ringly works
          </div>
          <h2 id="solution-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.15]">
            Your existing WhatsApp number
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
              becomes an AI employee
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            No new number. No app for your customers. Just your existing WhatsApp, now powered by an AI that works 24/7.
          </p>
        </motion.div>

        {/* Workflow visualization */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="relative"
        >
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-px bg-gradient-to-r from-blue-200 via-emerald-200 to-amber-200 -translate-y-1/2" aria-hidden="true" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                variants={itemVariants}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <motion.div
                  whileHover={{ scale: 1.08, y: -4 }}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-4 sm:mb-5 shadow-[0_4px_16px_rgb(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)]`}
                >
                  <step.icon className={`h-7 w-7 sm:h-8 sm:w-8 ${step.color}`} aria-hidden="true" />
                  {/* Step number */}
                  <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0F172A] text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center font-mono" aria-hidden="true">
                    {i + 1}
                  </span>
                </motion.div>

                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-1">{step.label}</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-[180px]">{step.desc}</p>

                {/* Arrow (between steps on desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-7 sm:top-8 -right-3 z-10" aria-hidden="true">
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
