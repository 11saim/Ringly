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

const capabilities = [
  {
    icon: CalendarClock,
    title: "Appointment Booking",
    desc: "Checks availability, books slots, handles reschedules and cancellations — all conversationally.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Package,
    title: "Order Management",
    desc: "Takes orders, modifies them, cancels them. Customers never need to call back.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Warehouse,
    title: "Inventory Checks",
    desc: "Real-time stock queries from your actual database. Never oversells or underquotes.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Headset,
    title: "Human Handoff",
    desc: "Routes to staff instantly when confidence drops or customers request a person.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Languages,
    title: "Multi-Language",
    desc: "Handles Urdu, Roman Urdu, and English code-switching naturally. No setup needed.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Brain,
    title: "Smart Memory",
    desc: "Recognizes returning customers. Remembers preferences, order history, and past conversations.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Radio,
    title: "Broadcast Messaging",
    desc: "Send announcements, promotions, and updates to opted-in customers through the same number.",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    icon: BarChart3,
    title: "Owner Analytics",
    desc: "Auto-surfaced knowledge gaps, booking conversion rates, and lightweight CSAT.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];


export function AICapabilities() {
  return (
    <section id="capabilities" className="relative py-24 sm:py-28 px-5 sm:px-6" aria-labelledby="capabilities-heading">
      <div className="mx-auto max-w-6xl">
        <div
          className="text-center mb-14 sm:mb-16"
        >
          <h2 id="capabilities-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.15]">
            Everything your AI agent can do
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            One agent. Every capability. Trained on your business data, following your rules.
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="group relative rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6 shadow-[0_2px_8px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgb(0,0,0,0.06)] hover:border-black/[0.1] transition-all duration-300 cursor-default"
            >
              <div className={`inline-flex p-2.5 rounded-xl ${cap.bg} mb-4 transition-transform duration-300 group-hover:scale-110`} aria-hidden="true">
                <cap.icon className={`h-5 w-5 ${cap.color}`} />
              </div>
              <h3 className="text-[15px] font-bold text-[#0F172A] mb-2">{cap.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
