"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  { name: "Starter", price: 0, cadence: "Free forever", features: ["1 WhatsApp number", "500 messages / mo", "Playground + basic analytics", "Email support"], cta: "Start free" },
  { name: "Growth", price: 49, cadence: "per month", features: ["3 numbers (WhatsApp + voice)", "10,000 messages / mo", "All integrations", "Bookings & catalog automation", "Priority support"], cta: "Try Growth", highlight: true },
  { name: "Scale", price: 199, cadence: "per month", features: ["Unlimited numbers", "100,000 messages / mo", "Custom actions & webhooks", "Dedicated success manager", "SSO + audit logs"], cta: "Talk to sales" },
];

export default function Pricing() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Pricing</div>
        <h1 className="mt-3 text-5xl font-extrabold tracking-tight">Priced like a really good employee. Costs a lot less.</h1>
        <p className="mt-4 text-lg text-muted-foreground">Message-based. No per-seat games. Try any plan free for 14 days.</p>
      </div>
      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.name} className={`rounded-2xl border p-8 flex flex-col ${p.highlight ? "border-primary bg-white shadow-[0_20px_50px_-25px_rgba(79,70,229,0.5)]" : "border-border bg-white"}`}>
            {p.highlight && <div className="mb-4 inline-flex w-fit rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1">Most popular</div>}
            <div className="text-lg font-semibold">{p.name}</div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-5xl font-extrabold">${p.price}</span>
              <span className="text-sm text-muted-foreground">{p.cadence}</span>
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="mt-8">
              <Button className={`w-full h-11 ${p.highlight ? "bg-primary hover:bg-primary/90" : ""}`} variant={p.highlight ? "default" : "outline"}>{p.cta}</Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
