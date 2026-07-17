"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Owner, Glow Salon",
    type: "Salon",
    avatar: "AK",
    avatarBg: "bg-pink-100 text-pink-700",
    rating: 5,
    quote: "Ringly handles our bookings so well that we've stopped missing Saturday appointments entirely. Our revenue is up 30% since we started.",
    metric: "+30% revenue",
    metricBg: "bg-emerald-50",
    metricColor: "text-emerald-600",
  },
  {
    name: "Dr. Hassan Malik",
    role: "Director, CareFirst Clinic",
    type: "Clinic",
    avatar: "HM",
    avatarBg: "bg-blue-100 text-blue-700",
    rating: 5,
    quote: "Our patients love that they can book appointments via WhatsApp at any hour. The AI handles it perfectly — and the human handoff is seamless.",
    metric: "24/7 booking",
    metricBg: "bg-indigo-50",
    metricColor: "text-indigo-600",
  },
  {
    name: "Fatima Zahra",
    role: "Founder, StyleHub",
    type: "E-commerce",
    avatar: "FZ",
    avatarBg: "bg-violet-100 text-violet-700",
    rating: 5,
    quote: "We used to spend 5 hours a day answering 'is this in stock?' messages. Now Ringly handles it automatically and our conversion rate jumped 40%.",
    metric: "+40% conversion",
    metricBg: "bg-amber-50",
    metricColor: "text-amber-600",
  },
];


export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-28 px-5 sm:px-6" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-6xl">
        <div
          className="text-center mb-14 sm:mb-16"
        >
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.15]">
            Trusted by businesses like yours
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            Real results from real businesses using Ringly every day.
          </p>
        </div>

        <div
          className="grid md:grid-cols-3 gap-5 sm:gap-6"
        >
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="relative rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-7 shadow-[0_2px_8px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgb(0,0,0,0.06)] transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-slate-100" aria-hidden="true" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-[15px] text-slate-600 leading-relaxed mb-6 relative z-10">
                &quot;{t.quote}&quot;
              </blockquote>

              {/* Metric badge */}
              <div className="mb-5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full ${t.metricBg} text-xs font-bold ${t.metricColor}`}>
                  {t.metric}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-black/[0.04]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${t.avatarBg}`} aria-hidden="true">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
                <span className="ml-auto text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t.type}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
