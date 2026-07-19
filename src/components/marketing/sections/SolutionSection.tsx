"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  MessageSquare,
  Bot,
  CalendarCheck,
  BarChart3,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";

const steps = [
  {
    num: "01",
    icon: MessageSquare,
    title: "Customer messages you",
    description:
      "A customer reaches out on WhatsApp with a question about booking, pricing, or availability — just like they normally would.",
    detail: "Supports text, images, voice notes, and documents",
    color: "#3b82f6",
    gradient: "from-blue-500 to-cyan-400",
    bg: "rgba(59,130,246,0.04)",
  },
  {
    num: "02",
    icon: Bot,
    title: "AI understands & reasons",
    description:
      "The AI reads the message, understands intent, checks your calendar, inventory, or FAQ — and decides exactly what to do.",
    detail: "Trained on your business knowledge base",
    color: "#10b981",
    gradient: "from-emerald-500 to-green-400",
    bg: "rgba(16,185,129,0.04)",
  },
  {
    num: "03",
    icon: CalendarCheck,
    title: "Books, orders, or replies",
    description:
      "It books the appointment, places the order, answers the question — whatever the customer needed, instantly.",
    detail: "Integrates with your existing tools & calendar",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-400",
    bg: "rgba(139,92,246,0.04)",
  },
  {
    num: "04",
    icon: BarChart3,
    title: "You see everything",
    description:
      "Every conversation, every booking, every dollar — logged and visible in your dashboard in real time.",
    detail: "Full analytics, conversation history & insights",
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-400",
    bg: "rgba(245,158,11,0.04)",
  },
];

function StepCard({
  step,
  index,
  isActive,
  isRevealed,
  onClick,
}: {
  step: (typeof steps)[number];
  index: number;
  isActive: boolean;
  isRevealed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left rounded-2xl will-change-transform"
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: isRevealed ? `${index * 100}ms` : "0ms",
        animation: "none",
      }}
    >
      {/* Gradient border — active only */}
      <div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${step.color}50, ${step.color}15, transparent 60%)`,
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Card body */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: isActive ? step.bg : "#ffffff",
          border: `1px solid ${isActive ? step.color + "25" : "rgba(0,0,0,0.05)"}`,
          boxShadow: isActive
            ? `0 8px 32px -8px ${step.color}18, 0 2px 8px rgba(0,0,0,0.04)`
            : "0 1px 3px rgba(0,0,0,0.03)",
          transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease",
          transform: isActive ? "scale(1)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          if (!isActive) (e.currentTarget as HTMLDivElement).style.transform = "scale(1.008)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        }}
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(to right, transparent, ${step.color}, transparent)`,
            opacity: isActive ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="relative shrink-0">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${step.gradient}`}
                style={{
                  boxShadow: isActive ? `0 6px 20px -4px ${step.color}30` : "none",
                  transition: "box-shadow 0.4s ease",
                }}
              >
                <step.icon
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                  style={{
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>

              {/* Single subtle pulse on active */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-xl animate-ring-expand"
                  style={{ border: `2px solid ${step.color}40` }}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span
                  className="font-mono text-[10px] font-bold tracking-[0.15em]"
                  style={{ color: isActive ? step.color : "#cbd5e1" }}
                >
                  {step.num}
                </span>
                <div
                  className="h-px flex-1"
                  style={{
                    background: isActive
                      ? `linear-gradient(to right, ${step.color}25, transparent)`
                      : "rgba(0,0,0,0.04)",
                    transition: "background 0.4s ease",
                  }}
                />
              </div>

              <h3
                className="text-base sm:text-lg font-bold mb-1"
                style={{
                  color: isActive ? "#0f172a" : "#475569",
                  transition: "color 0.3s ease",
                }}
              >
                {step.title}
              </h3>

              <p
                className="text-sm leading-relaxed"
                style={{
                  color: isActive ? "#64748b" : "#94a3b8",
                  transition: "color 0.3s ease",
                }}
              >
                {step.description}
              </p>

              {/* Expandable detail */}
              <div
                style={{
                  maxHeight: isActive ? "80px" : "0px",
                  opacity: isActive ? 1 : 0,
                  marginTop: isActive ? "12px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease, margin 0.3s ease",
                }}
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
                  style={{
                    background: `${step.color}0a`,
                    color: step.color,
                    border: `1px solid ${step.color}15`,
                  }}
                >
                  <Check className="w-3 h-3 shrink-0" />
                  {step.detail}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div
              className="shrink-0 mt-2"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateX(0)" : "translateX(-8px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              <ArrowRight className="w-4 h-4" style={{ color: step.color }} />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Single observer for section reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Track active step by scroll position — which card is closest to viewport center
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const viewportCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const distance = Math.abs(cardCenter - viewportCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        });

        setActiveStep(closestIndex);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleStepClick = useCallback((index: number) => {
    setActiveStep(index);
    cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const progressPercent = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);

  return (
    <section
      id="solution"
      ref={sectionRef}
      aria-labelledby="solution-heading"
      className="relative py-24 sm:py-22 px-5 sm:px-6 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #f8faff 0%, #f0f4ff 30%, #eef6ff 50%, #f5f0ff 80%, #faf5ff 100%)" }}
      />

      {/* Floating blobs — static, no animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 60%)" }}
        />
        <div
          className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 60%)" }}
        />
        <div
          className="absolute -bottom-20 right-1/4 w-[450px] h-[450px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 60%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* Header */}
        <div
          className="text-center mb-16 sm:mb-20"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-sm font-semibold mb-7"
            style={{
              background: "rgba(16,185,129,0.06)",
              borderColor: "rgba(16,185,129,0.15)",
              color: "#059669",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "scale(1)" : "scale(0.9)",
              transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            How Ringly works
          </div>
          <h2
            id="solution-heading"
            className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight mb-5 leading-[1.15]"
            style={{ color: "#0f172a" }}
          >
            Your existing WhatsApp number
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
              becomes an AI employee
            </span>
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#64748b" }}>
            No new number. No app for your customers. Just your existing
            WhatsApp, now powered by an AI that works 24/7.
          </p>
        </div>

        {/* Steps */}
        <div className="relative" role="list">
          {/* Timeline track */}
          <div
            className="absolute left-[25px] sm:left-[29px] top-0 bottom-0 w-[2px] rounded-full"
            aria-hidden="true"
            style={{ background: "rgba(0,0,0,0.05)" }}
          />
          {/* Timeline progress — height transition instead of clipPath */}
          <div
            className="absolute left-[25px] sm:left-[29px] top-0 w-[2px] rounded-full"
            aria-hidden="true"
            style={{
              background: "linear-gradient(to bottom, #3b82f6, #10b981, #8b5cf6, #f59e0b)",
              height: `${progressPercent}%`,
              transition: "height 0.5s cubic-bezier(0.22,1,0.36,1)",
            }}
          />

          <div className="space-y-3">
            {steps.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="relative pl-14 sm:pl-[64px]"
                role="listitem"
              >
                {/* Dot */}
                <div className="absolute left-[19px] sm:left-[23px] top-6 sm:top-7 z-10" aria-hidden="true">
                  <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: i <= activeStep ? step.color : "transparent",
                        border: i <= activeStep ? "none" : "2px solid rgba(0,0,0,0.1)",
                        boxShadow: i <= activeStep ? `0 0 8px ${step.color}30` : "none",
                        transition: "background 0.4s ease, box-shadow 0.4s ease",
                      }}
                    />
                    {i <= activeStep && (
                      <div
                        className="absolute inset-[3px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)" }}
                      />
                    )}
                  </div>
                </div>

                <StepCard
                  step={step}
                  index={i}
                  isActive={i === activeStep}
                  isRevealed={revealed}
                  onClick={() => handleStepClick(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
