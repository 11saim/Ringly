"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Clock, Users, Zap, TrendingUp } from "lucide-react";

const transformations = [
  {
    before: {
      title: "Manual replies",
      desc: "Owner spends 4+ hours daily responding to WhatsApp messages manually.",
      icon: Clock,
      value: 4,
      max: 8,
      unit: "hrs/day",
    },
    after: {
      title: "AI handles 90%",
      desc: "Agent responds instantly to hundreds of conversations simultaneously.",
      icon: Zap,
      value: 90,
      max: 100,
      unit: "%",
    },
  },
  {
    before: {
      title: "Missed bookings",
      desc: "Messages pile up during busy hours. Customers book elsewhere.",
      icon: Users,
      value: 35,
      max: 100,
      unit: "% lost",
    },
    after: {
      title: "Zero missed bookings",
      desc: "Every inquiry is handled immediately. Calendar stays full.",
      icon: TrendingUp,
      value: 0,
      max: 100,
      unit: "missed",
    },
  },
];

function AnimatedBar({ value, max, color, delay }: { value: number; max: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth((value / max) * 100);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, max, delay]);

  return (
    <div className="relative h-2.5 rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`absolute inset-y-0 left-0 rounded-full ${color} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function TransformationCard({ item, index }: { item: (typeof transformations)[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="grid md:grid-cols-2 gap-0 rounded-3xl bg-white overflow-hidden shadow-[0_2px_16px_rgb(0,0,0,0.06)]">
        {/* Before side */}
        <div className="relative p-7 sm:p-9 bg-[#FFF8F8]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2.5 rounded-2xl bg-[#FFE8E8]">
              <item.before.icon className="h-5 w-5 text-rose-400" />
            </div>
            <span className="text-xs font-semibold text-rose-300 tracking-wide">Before</span>
          </div>

          <h4 className="text-xl font-bold text-slate-800 mb-2">{item.before.title}</h4>
          <p className="text-sm text-slate-400 leading-relaxed mb-7">{item.before.desc}</p>

          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-rose-400 font-mono tracking-tight">{item.before.value}</span>
              <span className="text-sm text-rose-300 font-medium">{item.before.unit}</span>
            </div>
            <AnimatedBar value={item.before.value} max={item.before.max} color="bg-rose-300" delay={isVisible ? 200 + index * 300 : 0} />
          </div>
        </div>

        {/* After side */}
        <div className="relative p-7 sm:p-9 bg-[#F0FFF4]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2.5 rounded-2xl bg-[#D1FAE5]">
              <item.after.icon className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-emerald-400 tracking-wide">After Ringly</span>
          </div>

          <h4 className="text-xl font-bold text-slate-800 mb-2">{item.after.title}</h4>
          <p className="text-sm text-slate-400 leading-relaxed mb-7">{item.after.desc}</p>

          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-emerald-500 font-mono tracking-tight">{item.after.value}</span>
              <span className="text-sm text-emerald-400 font-medium">{item.after.unit}</span>
            </div>
            <AnimatedBar value={item.after.value} max={item.after.max} color="bg-emerald-400" delay={isVisible ? 600 + index * 300 : 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Transformations() {
  return (
    <section className="relative py-24 sm:py-28 px-5 sm:px-6" aria-labelledby="transformations-heading">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-14 sm:mb-16">
          <h2 id="transformations-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.15]">
            Why businesses choose Ringly
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            Not just features. Real transformations that impact your bottom line.
          </p>
        </div>

        <div className="space-y-8">
          {transformations.map((t, i) => (
            <TransformationCard key={i} item={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
