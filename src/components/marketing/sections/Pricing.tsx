"use client";

import { Check, ArrowRight } from "lucide-react";
import { MagneticButton } from "../MagneticButton";

const plans = [
  {
    name: "Starter",
    price: 0,
    cadence: "Free forever",
    description: "Perfect for trying Ringly",
    features: [
      "1 WhatsApp number",
      "500 messages / month",
      "Playground + basic analytics",
      "Email support",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: 49,
    cadence: "per month",
    description: "For growing businesses",
    features: [
      "3 WhatsApp numbers",
      "10,000 messages / month",
      "All integrations",
      "Bookings & catalog automation",
      "Priority support",
      "Broadcast messaging",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Scale",
    price: 199,
    cadence: "per month",
    description: "For teams at scale",
    features: [
      "Unlimited numbers",
      "100,000 messages / month",
      "Custom actions & webhooks",
      "Dedicated success manager",
      "SSO + audit logs",
      "API access",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-28 px-5 sm:px-6" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-6xl">
        <div
          className="text-center mb-14 sm:mb-16"
        >
          <h2 id="pricing-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.15]">
            Simple, transparent pricing
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            Start free. Pay only when you grow. No hidden fees, no per-seat charges.
          </p>
        </div>

        <div
          className="grid md:grid-cols-3 gap-5 sm:gap-6 items-start"
          role="list"
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 sm:p-7 transition-all duration-300 ${plan.highlighted
                  ? "border-2 border-indigo-500 bg-white shadow-[0_20px_50px_-25px_rgba(99,102,241,0.3)]"
                  : "border border-black/[0.06] bg-white shadow-[0_2px_8px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgb(0,0,0,0.06)]"
                }`}
              role="listitem"
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-500 text-white text-[11px] font-bold" aria-label="Most popular plan">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#0F172A] font-mono">${plan.price}</span>
                  <span className="text-sm text-slate-400">{plan.cadence}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8" role="list">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <MagneticButton
                href={plan.highlighted ? "/signup" : plan.name === "Scale" ? "mailto:sales@ringly.ai" : "/signup"}
                className={`group w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${plan.highlighted
                    ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
                    : "bg-[#0F172A] text-white hover:bg-[#1E293B] hover:shadow-lg"
                  }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </MagneticButton>
            </div>
          ))}
        </div>

        <p
          className="text-center text-sm text-slate-400 mt-8"
        >
          All plans include a 14-day free trial. No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
