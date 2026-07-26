"use client";

import { AppShell } from "@/components/app/AppShell";
import { CreditCard, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD = "rounded-[16px] border border-border/30 bg-card shadow-[var(--shadow-card)]";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    features: ["100 conversations/mo", "AI agent", "Basic knowledge base", "Email support"],
    current: false,
  },
  {
    name: "Growth",
    price: "$79",
    period: "/month",
    features: ["500 conversations/mo", "AI agent + human handoff", "Full knowledge base", "Bookings", "Priority support"],
    current: true,
  },
  {
    name: "Pro",
    price: "$199",
    period: "/month",
    features: ["Unlimited conversations", "Multi-agent", "Advanced analytics", "Broadcasts", "Dedicated support"],
    current: false,
  },
];

export default function BillingPage() {
  return (
    <AppShell title="Billing">
      <div className="space-y-5">
        <div className={cn(CARD, "p-5")}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-foreground">Current Plan</h3>
              <p className="text-[12px] text-muted-foreground/50 mt-0.5">Billed monthly · Renews on Aug 1, 2026</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-bold text-foreground">$79</span>
              <span className="text-[12px] text-muted-foreground/40">/month</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                CARD,
                "p-5 flex flex-col",
                plan.current && "ring-2 ring-accent/30 border-accent/20",
              )}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[15px] font-semibold text-foreground">{plan.name}</h3>
                  {plan.current && (
                    <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">Current</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-bold text-foreground">{plan.price}</span>
                  <span className="text-[12px] text-muted-foreground/40">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={14} strokeWidth={2} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-[12px] text-foreground/70">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={cn(
                  "mt-4 w-full rounded-[10px] px-4 py-2.5 text-[12px] font-semibold transition-all duration-150",
                  plan.current
                    ? "bg-muted text-muted-foreground/50 cursor-default"
                    : "bg-accent text-white hover:bg-accent-hover",
                )}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
