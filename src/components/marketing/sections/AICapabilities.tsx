"use client";

import {
  CalendarClock,
  Package,
  Warehouse,
  Headset,
  Languages,
  Brain,
  Radio,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";

const capabilities = [
  {
    icon: CalendarClock,
    title: "Appointment Booking",
    category: "Scheduling",
    body: "Checks availability, books slots, handles reschedules and cancellations — all conversationally.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Package,
    title: "Order Management",
    category: "Commerce",
    body: "Takes orders, modifies them, cancels them. Customers never need to call back.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Warehouse,
    title: "Inventory Checks",
    category: "Database",
    body: "Real-time stock queries from your actual database. Never oversells or underquotes.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Headset,
    title: "Human Handoff",
    category: "Support",
    body: "Routes to staff instantly when confidence drops or customers request a person.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Languages,
    title: "Multi-Language",
    category: "NLP",
    body: "Handles Urdu, Roman Urdu, and English code-switching naturally. No setup needed.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Brain,
    title: "Smart Memory",
    category: "AI",
    body: "Recognizes returning customers. Remembers preferences, order history, and past conversations.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Radio,
    title: "Broadcast Messaging",
    category: "Marketing",
    body: "Send announcements, promotions, and updates to opted-in customers through the same number.",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    icon: BarChart3,
    title: "Owner Analytics",
    category: "Insights",
    body: "Auto-surfaced knowledge gaps, booking conversion rates, and lightweight CSAT.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

const firstRow = capabilities.slice(0, capabilities.length / 2);
const secondRow = capabilities.slice(capabilities.length / 2);

const CapabilityCard = ({
  icon: Icon,
  title,
  category,
  body,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  category: string;
  body: string;
  color: string;
  bg: string;
}) => {
  return (
    <Card className="relative h-full w-64 shrink-0 cursor-pointer overflow-hidden border-border bg-card shadow-none p-4 rounded-lg">
      <CardContent className="p-0 flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <div className={`inline-flex p-2 rounded-lg ${bg}`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs font-medium text-muted-foreground">
              {category}
            </p>
          </div>
        </div>
        <p className="text-sm line-clamp-2 text-foreground">{body}</p>
      </CardContent>
    </Card>
  );
};

export function AICapabilities() {
  return (
    <section id="capabilities" className="relative py-24 sm:py-28 px-5 sm:px-6" aria-labelledby="capabilities-heading">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14 sm:mb-16">
          <h2 id="capabilities-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.15]">
            Everything your AI agent can do
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            One agent. Every capability. Trained on your business data, following your rules.
          </p>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-1">
        <Marquee reverse pauseOnHover className="py-1" style={{ "--duration": "5s", "--gap": "1rem" } as React.CSSProperties}>
          {firstRow.map((cap) => (
            <CapabilityCard key={cap.title} {...cap} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className="py-1" style={{ "--duration": "5s", "--gap": "1rem" } as React.CSSProperties}>
          {secondRow.map((cap) => (
            <CapabilityCard key={cap.title} {...cap} />
          ))}
        </Marquee>
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
      </div>
    </section>
  );
}
