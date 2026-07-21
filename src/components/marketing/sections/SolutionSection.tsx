"use client";

import { useState } from "react";
import {
  MessageSquare,
  Bot,
  CalendarCheck,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    num: "01",
    icon: MessageSquare,
    title: "Customer messages you",
    description:
      "A customer reaches out on WhatsApp with a question about booking, pricing, or availability — just like they normally would.",
    highlight: "Supports text, images, voice notes & documents",
    color: "#3b82f6",
  },
  {
    num: "02",
    icon: Bot,
    title: "AI understands & reasons",
    description:
      "The AI reads the message, understands intent, checks your calendar, inventory, or FAQ — and decides exactly what to do.",
    highlight: "Trained on your business knowledge base",
    color: "#10b981",
  },
  {
    num: "03",
    icon: CalendarCheck,
    title: "Books, orders, or replies",
    description:
      "It books the appointment, places the order, answers the question — whatever the customer needed, instantly.",
    highlight: "Integrates with your existing tools & calendar",
    color: "#8b5cf6",
  },
  {
    num: "04",
    icon: BarChart3,
    title: "You see everything",
    description:
      "Every conversation, every booking, every dollar — logged and visible in your dashboard in real time.",
    highlight: "Full analytics, conversation history & insights",
    color: "#f59e0b",
  },
];

export function SolutionSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const current = steps[activeStep];

  return (
    <section
      id="solution"
      aria-labelledby="solution-heading"
      className="relative py-24 sm:py-28 px-5 sm:px-6 overflow-hidden"
      ref={(el) => {
        if (el && !revealed) {
          const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setRevealed(true); },
            { threshold: 0.1 }
          );
          obs.observe(el);
        }
      }}
    >
      <div className="absolute inset-0 pointer-events-none bg-white" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl">
        {/* Header */}
        <div
          className="mb-16"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: "#94a3b8" }}>
            How it works
          </p>
          <h2
            id="solution-heading"
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "#0f172a" }}
          >
            Your existing WhatsApp number
            <br />
            becomes an AI employee
          </h2>
          <p className="text-base sm:text-lg max-w-lg leading-relaxed" style={{ color: "#64748b" }}>
            No new number. No app for your customers. Just your existing
            WhatsApp, now powered by an AI that works 24/7.
          </p>
        </div>

        {/* Steps */}
        <div
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
          }}
        >
          {/* Step dots */}
          <div className="flex items-center gap-2 mb-12">
            {steps.map((step, i) => (
              <button
                key={step.num}
                onClick={() => setActiveStep(i)}
                className="flex items-center gap-2 group"
                aria-label={`Step ${i + 1}: ${step.title}`}
              >
                <div
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    background: i <= activeStep ? steps[i].color : "#d1d5db",
                    transform: i === activeStep ? "scale(1.4)" : "scale(1)",
                    boxShadow: i === activeStep ? `0 0 12px ${steps[i].color}50` : "none",
                  }}
                />
                {i < steps.length - 1 && (
                  <div
                    className="w-10 sm:w-14 h-px transition-colors duration-300"
                    style={{
                      background: i < activeStep ? steps[i].color : "#e5e7eb",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Active step */}
          <div key={activeStep} className="animate-fade-in">
            <div
              className="rounded-2xl p-6 sm:p-8 transition-all duration-500"
              style={{
                background: `${current.color}08`,
                border: `1px solid ${current.color}15`,
              }}
            >
              <div className="flex items-start gap-5 mb-5">
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <span className="text-lg font-mono font-bold" style={{ color: current.color }}>
                    {current.num}
                  </span>
                  <current.icon className="w-5 h-5" style={{ color: current.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "#0f172a" }}>
                    {current.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: "#64748b" }}>
                    {current.description}
                  </p>
                  <p className="text-xs font-medium" style={{ color: current.color }}>
                    {current.highlight}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                disabled={activeStep === 0}
                className="text-xs font-medium transition-all disabled:opacity-20 px-3 py-1.5 rounded-lg"
                style={{
                  color: "#64748b",
                  background: "rgba(0,0,0,0.04)",
                }}
              >
                Previous
              </button>
              <button
                onClick={() => setActiveStep((p) => Math.min(steps.length - 1, p + 1))}
                disabled={activeStep === steps.length - 1}
                className="text-xs font-medium inline-flex items-center gap-1 transition-all disabled:opacity-20 px-3 py-1.5 rounded-lg text-white"
                style={{
                  background: current.color,
                }}
              >
                Next
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
